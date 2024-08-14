import express from 'express'
import usersRoutes from './routes/user.routes'

import { config } from 'dotenv'
import databaseService from './services/database.services'

const app = express()
config()
app.use(express.json()) // do là server chúng ta không hiểu là trả ra gì
//  đoạn code này giups server hiểu là trả json

const PORT = 3000
databaseService.connect()

// localhost 3000

app.get('/', () => {
  console.log('Hello wourld')
})

app.listen(PORT, () => {
  console.log(`Server đang chạy trên ${PORT}`)
})

// do userRoutes là hàm mà muốn sử dunjg thì phải gọi
// mà ai gọi?
// app chúng ta gọi
app.use('/users', usersRoutes)
