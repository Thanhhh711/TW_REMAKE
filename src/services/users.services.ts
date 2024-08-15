import { TokenType } from './../constants/enums'
import { Request, Response, NextFunction } from 'express'
import databaseService from './database.services'
import User from '~/models/schemas/User.schemas'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class UserSerivce {
  // hàm nhận vào user_id và bỏ vào payload
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }

  async checkEmail(email: string) {
    const user = await databaseService.users.findOne({ email })
    return user
  }

  async register(payload: RegisterReqBody) {
    // insert là 1 cái hàm của monggo cung cấp
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password),
        date_of_birth: new Date(payload.date_of_birth)
      })
    )

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    return [access_token, refresh_token]
  }
}

const userSerivce = new UserSerivce()

export default userSerivce
