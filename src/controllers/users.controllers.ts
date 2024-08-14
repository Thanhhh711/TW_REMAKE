import { Request, Response, NextFunction } from 'express'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import userSerivce from '~/services/users.services'

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

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const resutl = await userSerivce.registerService({ email, password })
    return res.json({
      message: 'Register successfully',
      data: resutl
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ message: error })
  }
}
