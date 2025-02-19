import { NextFunction, Request, Response } from 'express'

export interface Req extends Request {
  token: any
  session: {
    destroy?: Function
  }
}

export interface Res extends Response {
  __: Function
}

export interface Next extends NextFunction {}

export enum Gender {
  male = 'male',
  female = 'female'
}
