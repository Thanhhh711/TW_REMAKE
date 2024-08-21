import { NextFunction, Request, Response, Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPassWordValidator,
  verifyForgotPasswordValidator
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
  wrarpAsync(logoutController)
)

/*
des: verify email khi người dùng nhấn vào cái link trong email, họ sẽ gữi lên email_verify_token
để ta kiểm tra, tìm kiếm user đó và update account của họ thành verify, 
đồng thời gữi at rf cho họ đăng nhập luôn, k cần login,
nếu mà 1 acc mà không verify email thì chỉ có đăng nhập được thôi
path: /verify-email
method: POST
không cần Header vì chưa đăng nhập vẫn có thể verify-email
body: {email_verify_token: string}
*/
usersRoutes.post(
  '/verify-email',
  emailVerifyTokenValidator,
  wrarpAsync(emailVerifyController)
)

/*
  des:gữi lại verify email khi người dùng nhấn vào nút gữi lại email,
  path: /resend-verify-email
  method: POST
  Header:{Authorization: Bearer <access_token>} //đăng nhập mới cho resend email verify
  body: {}
  */

usersRoutes.post(
  '/resend-verify-email',
  accessTokenValidator,
  wrarpAsync(resendEmailVerifyController)
)

///-----------------------ForGot PAssword
/*
    Des: khi ngưởi dungf quên mk, họ sẽ gửi cái email để xin mình tạo cái 
    forgot_password_token
    path:/users/forgot-password
    method: POST
    // body;{email;string }

*/
usersRoutes.post(
  '/forgot-password',
  forgotPasswordValidator,
  wrarpAsync(forgotPasswordController)
)

usersRoutes.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrarpAsync(verifyForgotPasswordTokenController)
)

/**
 * des: reset password
 * path: '/reset-password'
 * method: POST
 * Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
 * body: {forgot_password_token: string, password: string, confirm_password: string}
 */

usersRoutes.post(
  '/reset-password',
  resetPassWordValidator,
  wrarpAsync(resetPasswordController)
)

//  buổi 31
usersRoutes.post('/me', accessTokenValidator, wrarpAsync(getMeController))

export default usersRoutes
