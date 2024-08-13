import { log } from 'console'
import { Router } from 'express'

const usersRoutes = Router()

usersRoutes.use((req, res, next) => {
  console.log('Time', Date.now())
  next()
})

usersRoutes.get('/tweets', (req, res) => {
  res.json({
    data: [
      { name: 'Điêpkj', yob: 1999 },
      { name: 'Được', yob: 1994 },
      { name: 'Hùng', yob: 2004 }
    ]
  })
})

export default usersRoutes
