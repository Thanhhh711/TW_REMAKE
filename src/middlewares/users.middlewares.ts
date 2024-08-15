import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import databaseService from '~/services/database.services'
import userSerivce from '~/services/users.services'
import validate from '~/utils/validation'

export const loginValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      // độ dài
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExist = await userSerivce.checkEmail(value)
          if (isExist) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,

      // độ dài
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      errorMessage: 'Password is not valid'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,

      // độ dài
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      errorMessage: 'confirm_password is not valid',

      custom: {
        options: (value, { req }) => {
          const { password } = req.body

          if (value !== password) {
            throw new Error('Confirm password does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true, // ép mình nhập theo format
          strictSeparator: true // được quyền thêm dấu _
        }
      }
    }
  })
)
