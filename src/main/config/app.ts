import express, { json } from 'express'
import cors from 'cors'
import setupRoutes from './routes'

const app = express()
const bodyParser = json()

app.use(cors())

app.use(bodyParser)

app.disable('x-powered-by')

setupRoutes(app)

export default app
