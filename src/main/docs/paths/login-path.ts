export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'Login user',
    description: 'Validate email and password for login.',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/loginParams',
          },
          examples: {
            userParams: {
              $ref: '#/components/examples/loginParams',
            },
          },
        },
      },
    },
    responses: {
      '200': {
        description: 'Success',
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
      '401': {
        description: 'Unauthorized',
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
