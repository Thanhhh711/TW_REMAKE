import { NextFunction, Request, RequestHandler, Response } from 'express'

// kiểu currying
export const wrarpAsync =
  <P>(func: RequestHandler<P>) =>
  async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
