import express from 'express'
import usersRoutes from './routes/user.routes'
const app = express()
const PORT = 3000

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
app.use('/api', usersRoutes)
