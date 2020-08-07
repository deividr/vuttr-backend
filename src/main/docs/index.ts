import paths from './paths'
import schemas from './schemas'
import examples from './examples'

export default {
  openapi: '3.0.0',
  info: {
    title: 'VUTTR - Very Useful Tools to Remember',
    description:
      'API to manage tools with their respective names, links, descriptions and tags',
    version: '0.1.9',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
    },
  ],
  paths,
  components: {
    schemas,
    examples,
  },
}
