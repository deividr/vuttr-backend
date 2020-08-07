import {
  loginSchema,
  userParamsSchema,
  errorSchema,
  loginParamsSchema,
} from './schemas/'

export default {
  login: loginSchema,
  loginParams: loginParamsSchema,
  userParams: userParamsSchema,
  error: errorSchema,
}
