import { Router } from 'express'

export default (routes: Router): void => {
  routes.post('/signup', (req, res) => {
    res.json({ statusCode: 'ok' })
  })
}
