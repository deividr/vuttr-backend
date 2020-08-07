import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import { noCache } from '../middleware/no-cache'
import swaggerConfig from '../docs'

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerConfig))
}
