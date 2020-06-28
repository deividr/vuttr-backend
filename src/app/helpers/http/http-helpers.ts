import { HttpResponse } from '../../protocols/http'

export const badRequest = (body: any): HttpResponse => ({
  statusCode: 400,
  body,
})

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
})
