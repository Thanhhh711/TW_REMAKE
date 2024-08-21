import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface LoginReqBody {
  email: string
  password: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  iat: number
  exp: number
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface ForgotPassWordReqBody {
  email: string
}
export interface VerifyForgotPassWordReqBody {
  forgot_password_token: string
}

export interface ResetPassWordReq {
  password: string
  confirm_password: string
  forgot_password_token: string
}
