export class ToolAlreadyExistError extends Error {
  constructor() {
    super('Tool title provided already exist for an other tool')
    this.name = 'ToolAlreadyExistError'
  }
}
