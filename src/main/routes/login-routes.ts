import { Router } from 'express'
import { adaptRouter } from '../adapters/routes-adapter'
import { makeSigninController } from '../factories/controllers/signin/signin-controller-factory'
import { makeSignupController } from '../factories/controllers/signup/signup-controller-factory'

export default (routes: Router): void => {
  routes.post('/login', adaptRouter(makeSigninController()))
  routes.post('/signup', adaptRouter(makeSignupController()))
}
