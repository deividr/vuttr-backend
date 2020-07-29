export class UnauthorizedError extends Error {
  constructor() {
    super('Access Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
