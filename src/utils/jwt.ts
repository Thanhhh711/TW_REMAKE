import jwt from 'jsonwebtoken'

//  hàm nhận vào payload , privatekey, options từ đó ký tên

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string, // mặc định
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}
