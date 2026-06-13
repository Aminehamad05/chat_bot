import { conversationService } from '../../services/conversation.service'
import { AppError } from '../../middleware/errorHandler'

jest.mock('../../db/index', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

import { db } from '../../db/index'

// ── Mock data ─────────────────────────────────────────────────
const mockConversation = {
  id: 'conv-123',
  userId: 'user-123',
  title: 'New conversation',
  createdAt: new Date(),
  lastMessageAt: new Date(),
}

const mockMessage = {
  id: 'msg-123',
  conversationId: 'conv-123',
  role: 'user' as const,
  content: 'كيفاش حالك؟',
  createdAt: new Date(),
}

// ── Chain helpers ─────────────────────────────────────────────
function mockSelect(value: unknown[]) {
  const chain = {
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockResolvedValue(value),
    limit: jest.fn().mockResolvedValue(value),
  }
  ;(db.select as jest.Mock).mockReturnValue(chain)
  return chain
}

function mockInsert(value: unknown[]) {
  const chain = {
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(value),
  }
  ;(db.insert as jest.Mock).mockReturnValue(chain)
  return chain
}

function mockUpdate() {
  const chain = {
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockResolvedValue([]),
  }
  ;(db.update as jest.Mock).mockReturnValue(chain)
  return chain
}

function mockDelete() {
  const chain = {
    where: jest.fn().mockResolvedValue([]),
  }
  ;(db.delete as jest.Mock).mockReturnValue(chain)
  return chain
}

// ── Tests ─────────────────────────────────────────────────────

describe('conversationService.getAll', () => {
  it('returns conversations for a user ordered by lastMessageAt', async () => {
    mockSelect([mockConversation])

    const result = await conversationService.getAll('user-123')

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe('user-123')
  })

  it('returns empty array if user has no conversations', async () => {
    mockSelect([])

    const result = await conversationService.getAll('user-123')

    expect(result).toEqual([])
  })
})

describe('conversationService.getById', () => {
  it('returns the conversation if it belongs to the user', async () => {
    mockSelect([mockConversation])

    const result = await conversationService.getById('conv-123', 'user-123')

    expect(result.id).toBe('conv-123')
  })

  it('throws 404 if conversation does not exist', async () => {
    mockSelect([])

    await expect(
      conversationService.getById('nonexistent', 'user-123')
    ).rejects.toThrow(new AppError('Conversation not found', 404))
  })

  it('throws 403 if conversation belongs to another user', async () => {
    mockSelect([{ ...mockConversation, userId: 'other-user' }])

    await expect(
      conversationService.getById('conv-123', 'user-123')
    ).rejects.toThrow(new AppError('Forbidden', 403))
  })
})

describe('conversationService.create', () => {
  it('creates a conversation with default title', async () => {
    mockInsert([mockConversation])

    const result = await conversationService.create('user-123')

    expect(result.userId).toBe('user-123')
    expect(result.title).toBe('New conversation')
  })

  it('creates a conversation with custom title', async () => {
    const custom = { ...mockConversation, title: 'My chat' }
    mockInsert([custom])

    const result = await conversationService.create('user-123', 'My chat')

    expect(result.title).toBe('My chat')
  })
})

describe('conversationService.delete', () => {
  it('deletes a conversation that belongs to the user', async () => {
    mockSelect([mockConversation])
    mockDelete()

    await expect(
      conversationService.delete('conv-123', 'user-123')
    ).resolves.not.toThrow()
  })

  it('throws 403 when trying to delete another user conversation', async () => {
    mockSelect([{ ...mockConversation, userId: 'other-user' }])

    await expect(
      conversationService.delete('conv-123', 'user-123')
    ).rejects.toThrow(new AppError('Forbidden', 403))
  })
})

describe('conversationService.saveMessage', () => {
  it('saves a message and returns it', async () => {
    mockInsert([mockMessage])

    const result = await conversationService.saveMessage({
      conversationId: 'conv-123',
      role: 'user',
      content: 'كيفاش حالك؟',
    })

    expect(result.content).toBe('كيفاش حالك؟')
    expect(result.role).toBe('user')
  })
})

describe('conversationService.generateTitle', () => {
  it('returns message as title if under 40 chars', async () => {
    const title = await conversationService.generateTitle('كيفاش حالك؟')
    expect(title).toBe('كيفاش حالك؟')
  })

  it('truncates long messages to 40 chars with ellipsis', async () => {
    const long = 'a'.repeat(60)
    const title = await conversationService.generateTitle(long)
    expect(title).toBe('a'.repeat(40) + '...')
  })
})