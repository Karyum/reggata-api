import { NextFunction, Request, Response } from 'express'

export interface ISessionObj {
  email?: string
  socketId?: string
  role?: string
  patientId?: string
}

export interface Req extends Request {
  token: any
  session: {
    user: ISessionObj
    destroy?: Function
  }
}

export interface Res extends Response {
  __: Function
  session: { user: ISessionObj }
}

export interface Next extends NextFunction {}

export enum Gender {
  male = 'male',
  female = 'female'
}
