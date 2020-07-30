import { Router } from 'express'
import adaptRouter from '../adapters/routes-adapter'
import makeLoginController from '../factories/controllers/login/login-controller-factory'

export default (routes: Router): void => {
  routes.post('/login', adaptRouter(makeLoginController()))
}
