import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const usersRoutes = Router()

usersRoutes.use((req, res, next) => {
  console.log('Time', Date.now())
  next()
})

usersRoutes.post('/login', loginValidator, loginController)
usersRoutes.post('/register', registerController)

export default usersRoutes
