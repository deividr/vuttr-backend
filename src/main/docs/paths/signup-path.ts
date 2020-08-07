export const signupPath = {
  post: {
    tags: ['Login'],
    summary: 'Create new user access',
    description: 'Create a new user to access system and operate other routes.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/userParams',
          },
          examples: {
            userParams: {
              $ref: '#/components/examples/userParams',
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description: 'User create success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/login',
            },
          },
        },
      },
      '400': {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
          },
        },
      },
      '500': {
        description: 'Server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/error',
            },
          },
        },
      },
    },
  },
}
