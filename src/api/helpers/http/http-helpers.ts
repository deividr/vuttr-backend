import { UnauthorizedError } from '../../errors/unauthorized-error'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const created = (body: any): HttpResponse => ({
  statusCode: 201,
  body,
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: error,
})
