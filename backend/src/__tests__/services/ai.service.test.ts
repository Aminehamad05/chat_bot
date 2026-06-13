import { Response } from 'express'

// Mock the AI client before importing the service
jest.mock('../../config/env', () => ({
  env: { geminiApiKey: 'test-key' },   // adjust to match your env key name
}))

// Mock whatever AI SDK you are using
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContentStream: jest.fn(),
    }),
  })),
}))

import { streamAIResponse } from '../../services/ai.service'

// ── SSE response mock ─────────────────────────────────────────
function mockSSEResponse() {
  const chunks: string[] = []
  return {
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write: jest.fn((chunk: string) => chunks.push(chunk)),
    end: jest.fn(),
    _chunks: chunks,
  } as unknown as Response & { _chunks: string[] }
}

const mockHistory = [
  {
    id: 'msg-1',
    conversationId: 'conv-123',
    role: 'user' as const,
    content: 'مرحبا',
    createdAt: new Date(),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-123',
    role: 'assistant' as const,
    content: 'لاباس عليك!',
    createdAt: new Date(),
  },
]

describe('streamAIResponse', () => {
  it('sets correct SSE headers', async () => {
    // Mock a stream that immediately ends
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContentStream: jest.fn().mockResolvedValue({
          stream: (async function* () {
            yield { text: () => 'لاباس' }
            yield { text: () => ' برشا' }
          })(),
        }),
      }),
    }))

    const res = mockSSEResponse()
    await streamAIResponse(mockHistory, 'كيفاش حالك؟', res)

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream')
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(res.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive')
    expect(res.flushHeaders).toHaveBeenCalled()
  })

  it('writes chunks in SSE format', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContentStream: jest.fn().mockResolvedValue({
          stream: (async function* () {
            yield { text: () => 'لاباس' }
            yield { text: () => ' برشا' }
          })(),
        }),
      }),
    }))

    const res = mockSSEResponse()
    await streamAIResponse(mockHistory, 'كيفاش حالك؟', res)

    expect(res.write).toHaveBeenCalledWith(
      expect.stringContaining('data:')
    )
  })

  it('returns the full assembled content', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContentStream: jest.fn().mockResolvedValue({
          stream: (async function* () {
            yield { text: () => 'لاباس' }
            yield { text: () => ' برشا' }
          })(),
        }),
      }),
    }))

    const res = mockSSEResponse()
    const result = await streamAIResponse(mockHistory, 'كيفاش حالك؟', res)

    expect(result).toBe('لاباس برشا')
  })

  it('calls res.end() after streaming completes', async () => {
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContentStream: jest.fn().mockResolvedValue({
          stream: (async function* () {
            yield { text: () => 'يزي' }
          })(),
        }),
      }),
    }))

    const res = mockSSEResponse()
    await streamAIResponse(mockHistory, 'test', res)

    expect(res.end).toHaveBeenCalled()
  })
})