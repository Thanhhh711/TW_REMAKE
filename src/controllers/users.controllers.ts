import { Request, Response, NextFunction } from 'express'
import { param } from 'express-validator'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import userSerivce from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'thanh@gmail.com' && password === '123') {
    return res.json({
      message: 'Login successfully',
      data: [
        { name: 'Điệp', yob: 1999 },
        { name: 'Được', yob: 1994 },
        { name: 'Hùng', yob: 2004 }
      ]
    })
  }
  return res.status(400).json({
    error: 'login failed'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const resutl = await userSerivce.register(req.body)
    return res.json({
      message: 'Register successfully',
      data: resutl
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ message: error })
  }
}
