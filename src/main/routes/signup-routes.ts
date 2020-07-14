import { Router } from 'express'
import adaptRoutes from '../adapters/routes-adapter'
import makeSignupController from '../factories/controllers/signup/signup-controller-factory'

export default (routes: Router): void => {
  routes.post('/signup', adaptRoutes(makeSignupController()))
}
