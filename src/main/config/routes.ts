import { Express, Router } from 'express'
import path from 'path'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  try {
    const routes = Router()

    app.use('/api', routes)

    const filesRoutes = readdirSync(path.resolve(__dirname, '../routes/'))

    filesRoutes.map(async (fileRoute) => {
      !fileRoute.includes('.test.') &&
        (await import(`../routes/${fileRoute}`)).default(routes)
    })
  } catch (error) {
    console.log('Deu erro, esse aqui =', error)
  }
}
