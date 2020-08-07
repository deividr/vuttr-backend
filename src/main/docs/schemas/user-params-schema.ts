export const userParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    confirmPassword: {
      type: 'string',
    },
  },
  required: ['email', 'name', 'password', 'confirmPassword'],
}
