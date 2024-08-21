import { Request, Response, NextFunction } from 'express'

import {
  ForgotPassWordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPassWordReq,
  TokenPayload,
  VerifyEmailReqBody,
  VerifyForgotPassWordReqBody
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import userSerivce from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginReqBody>,
  res: Response
) => {
  const user = req.user as User
  const user_id = user._id as ObjectId // do là object user_id

  const result = await userSerivce.login(user_id.toString())
  // throw new Error('Tạo thử 1 cái lỗi nè')
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response
) => {
  const result = await userSerivce.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response
) => {
  const result = await userSerivce.logout(req.body)

  return res.json(result)
}

export const emailVerifyController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decode_email_verify_token as TokenPayload

  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  if (user === null) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  if (user?.email_verify_token === '') {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  const result = await userSerivce.verifyEmail(user_id)

  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendEmailVerifyController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  console.log(req.decoded_authorization as TokenPayload)

  const { user_id } = req.decoded_authorization as TokenPayload

  console.log('user_id', user_id)

  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  const result = await userSerivce.resendEmailVerify(user_id)

  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPassWordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as User

  const resutl = await userSerivce.forgotPassword(new ObjectId(_id).toString())

  return res.json(resutl)
}

export const verifyForgotPasswordTokenController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPassWordReqBody>,
  res: Response,
  next: NextFunction
) => {
  //nếu đã đến bước này nghĩa là ta đã tìm có forgot_password_token hợp lệ
  //và đã lưu vào req.decoded_forgot_password_token
  //thông tin của user
  //ta chỉ cần thông báo rằng token hợp lệ
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPassWordReq>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body

  const result = await userSerivce.resetPassWord({ user_id, password })

  return res.json(result)
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await userSerivce.getMe(user_id)

  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result
  })
}
