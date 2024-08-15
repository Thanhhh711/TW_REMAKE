import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRoutes = Router()

usersRoutes.use((req, res, next) => {
  console.log('Time', Date.now())
  next()
})

usersRoutes.post('/login', loginValidator, loginController)

/*
Descriptor : Register new user
Path: /register
Method: POST
body:{
    email:string
    password:string
    confirm_password:string // bởi vì đây là qui ước trong các collec trong MG là snacke case
    date_of_birth:string (thep chuẩn ISO8601)
}
*/
usersRoutes.post('/register', registerValidator, registerController)

export default usersRoutes
