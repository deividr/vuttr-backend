import { Router } from 'express'
import { adaptRouter } from '../adapters/routes-adapter'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignupController } from '../factories/controllers/signup/signup-controller-factory'

export default (routes: Router): void => {
  routes.post('/login', adaptRouter(makeLoginController()))
  routes.post('/signup', adaptRouter(makeSignupController()))
}
