import { Request, Response } from 'express'
import { errorHandler, AppError } from '../../middleware/errorHandler'

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }
  return res as unknown as Response
}

describe('errorHandler', () => {
  it('returns correct status and message for AppError', () => {
    const err = new AppError('Not found', 404)
    const res = mockRes()

    errorHandler(err, {} as Request, res, jest.fn())

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' })
  })

  it('returns 500 for unknown errors', () => {
    const err = new Error('Something exploded')
    const res = mockRes()

    errorHandler(err as AppError, {} as Request, res, jest.fn())

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' })
  })

  it('does not leak error details for unknown errors', () => {
    const err = new Error('DB connection string: postgres://secret@host')
    const res = mockRes()

    errorHandler(err as AppError, {} as Request, res, jest.fn())

    const response = (res.json as jest.Mock).mock.calls[0][0]
    expect(response.error).not.toContain('postgres://')
  })
})