import { ObjectId } from 'mongodb'
import { TokenType } from './../constants/enums'
import { Request, Response, NextFunction } from 'express'
import databaseService from './database.services'
import User from '~/models/schemas/User.schemas'
import { LogoutReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { USERS_MESSAGES } from '~/constants/messages'

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

  private signToken(user_id: string) {
    return Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
  }

  async checkEmail(email: string) {
    const user = await databaseService.users.findOne({ email })
    return user
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signToken(user_id)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return { access_token, refresh_token }
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

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token
      })
    )

    return { access_token, refresh_token }
  }

  async logout(payload: LogoutReqBody) {
    //  xóa token trong db
    await databaseService.refreshTokens.deleteOne({
      token: payload.refresh_token
    })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }
}

const userSerivce = new UserSerivce()

export default userSerivce
