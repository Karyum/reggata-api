import { Application, NextFunction, Request, Response } from 'express'
export interface ISessionObj {
  id?: string
  socketId?: string
}

export interface Req extends Request {
  token: any
  session: {
    user: ISessionObj
    destroy?: Function
  }

  app: Application & {
    io: any
  }
}

export interface Res extends Response {
  __: Function
  session: { user: ISessionObj }
}
export interface Next extends NextFunction {}
