import { Request, Response, NextFunction } from 'express'
import { param } from 'express-validator'
import { LogoutReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import userSerivce from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'

export const loginController = async (req: Request, res: Response) => {
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
  const resutl = await userSerivce.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    resutl
  })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response
) => {
  const result = await userSerivce.logout(req.body)

  res.json(result)
}
