import Groq from 'groq-sdk'
import { Response } from 'express'
import { env } from '../config/env'
import { TUNISIAN_SYSTEM_PROMPT } from '../prompts/tunisian'
import type { Message } from '../db/schema'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
// Max messages to send as context — prevents hitting token limits
const MAX_CONTEXT_MESSAGES = 20

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ── Build context window ──────────────────────────────────────
// Takes DB messages + new user message, returns the array to send Groq
function buildMessages(
  history: Message[],
  newMessage: string
): ChatMessage[] {
  // Take last N messages for context window
  const contextMessages = history
    .slice(-MAX_CONTEXT_MESSAGES)
    .map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

  return [
    ...contextMessages,
    { role: 'user', content: newMessage },
  ]
}

// ── Stream response via SSE ───────────────────────────────────
export async function streamAIResponse(
  history: Message[],
  newMessage: string,
  res: Response
): Promise<string> {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // important for nginx proxies
  res.flushHeaders()

  const messages = buildMessages(history, newMessage)
  let fullContent = ''

 const prompt = [
  TUNISIAN_SYSTEM_PROMPT,
  ...messages.map(
    (m) => `${m.role}: ${m.content}`
  ),].join('\n')
  const stream = await ai.models.generateContentStream({
  model: 'gemini-2.5-flash',
  contents: prompt,
})

  for await (const chunk of stream) {
    const delta = chunk.text;

    if (delta) {
      fullContent += delta

      // SSE format: "data: ...\n\n"
      res.write(`data: ${JSON.stringify({ chunk: delta })}\n\n`)
    }
  }
  res.write(
  `data: ${JSON.stringify({
    done: true,
  })}\n\n`
  )

  res.end()

  // Return the full assembled response to save to DB
  return fullContent
}