export class EmailAlreadyExistError extends Error {
  constructor() {
    super('Email provided already exist for an other user')
    this.name = 'EmailAlreadyExistError'
  }
}
