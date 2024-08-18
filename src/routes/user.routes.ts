import { NextFunction, Request, Response, Router } from 'express'
import {
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrarpAsync } from '~/utils/handlers'

const usersRoutes = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/

usersRoutes.post('/login', loginValidator, wrarpAsync(loginController))

/*
Descriptor : Register new user
Path: /register
Method: POST
body:{
    email:string
    password:string
    confirm_password:string // bởi vì đây là qui ước trong các collec trong MG là snacke case
    date_of_birth:string (thep chuẩn ISO8601)
}
*/
usersRoutes.post('/register', registerValidator, wrarpAsync(registerController))

/*
    des: lougout
    path: /users/logout
    method: POST
    Header: {Authorization: Bearer <access_token>}
    body: {refresh_token: string}
    */

usersRoutes.post(
  '/logout',
  accessTokenValidator,
  refreshTokenValidator,
  logoutController
)

export default usersRoutes
