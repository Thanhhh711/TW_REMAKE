import { Request, Response, NextFunction } from 'express'
import databaseService from './database.services'
import User from '~/models/schemas/User.schemas'

class UserSerivce {
  async registerService(payload: { email: string; password: string }) {
    const { email, password } = payload
    // insert là 1 cái hàm của monggo cung cấp
    const result = await databaseService.users.insertOne(new User({ email, password } as User))
    return result
  }
}

const userSerivce = new UserSerivce()

export default userSerivce
