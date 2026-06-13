import { Router, Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { conversationService } from '../services/conversation.service'
import { streamAIResponse } from '../services/ai.service'
import { AppError } from '../middleware/errorHandler'
import { ConversationIdParams } from '../types/conversation.type'

const router = Router()

// All conversation routes require auth
router.use(authMiddleware)

// ── GET /api/conversations ────────────────────────────────────
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const convs = await conversationService.getAll(req.user!.id)
      res.json(convs)
    } catch (err) {
      next(err)
    }
  }
)

// ── POST /api/conversations ───────────────────────────────────
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conv = await conversationService.create(req.user!.id)
      res.status(201).json(conv)
    } catch (err) {
      next(err)
    }
  }
)

// ── DELETE /api/conversations/:id ────────────────────────────
router.delete(
  '/:id',
  async (req: Request<ConversationIdParams>, res: Response, next: NextFunction) => {
    try {
      await conversationService.delete(req.params.id, req.user!.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
)

// ── PATCH /api/conversations/:id/title ───────────────────────
router.patch(
  '/:id/title',
  async (req: Request<ConversationIdParams>, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body
      if (!title?.trim()) throw new AppError('Title is required', 400)

      const conv = await conversationService.updateTitle(
        req.params.id,
        req.user!.id,
        title.trim()
      )
      res.json(conv)
    } catch (err) {
      next(err)
    }
  }
)

// ── GET /api/conversations/:id/messages ──────────────────────
router.get(
  '/:id/messages',
  async (req: Request<ConversationIdParams>, res: Response, next: NextFunction) => {
    try {
      const msgs = await conversationService.getMessages(
        req.params.id,
        req.user!.id
      )
      res.json(msgs)
    } catch (err) {
      next(err)
    }
  }
)

// ── POST /api/conversations/:id/messages ─────────────────────
// This is the main chat endpoint — saves user message + streams AI reply
router.post(
  '/:id/messages',
  async (req: Request<ConversationIdParams>, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body
      if (!content?.trim()) throw new AppError('Message content is required', 400)

      const conversationId = req.params.id
      const userId = req.user!.id

      // 1. Verify conversation belongs to user
      const conv = await conversationService.getById(conversationId, userId)

      // 2. Load conversation history for context
      const history = await conversationService.getMessages(conversationId, userId)

      // 3. Save the user message to DB immediately
      await conversationService.saveMessage({
        conversationId,
        role: 'user',
        content: content.trim(),
      })

      // 4. Auto-title the conversation from first message
      if (history.length === 0 && conv.title === 'New conversation') {
        const title = await conversationService.generateTitle(content)
        await conversationService.updateTitle(conversationId, userId, title)
      }

      // 5. Stream AI response — this sets SSE headers and writes chunks
      const aiContent = await streamAIResponse(history, content.trim(), res)

      // 6. Save the complete AI reply to DB after streaming finishes
      await conversationService.saveMessage({
        conversationId,
        role: 'assistant',
        content: aiContent,
      })

      // 7. Update conversation's lastMessageAt
      await conversationService.updateLastMessageAt(conversationId)

    } catch (err) {
      // If headers already sent (SSE started), can't send JSON error
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: `${err}` })}\n\n`)
        res.end()
      } else {
        next(err)
      }
    }
  }
)

export default router