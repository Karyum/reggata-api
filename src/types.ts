import { NextFunction, Request, Response } from 'express'

export interface ISessionObj {
  teacherId?: number
  studentId?: number
  email?: string
  socketId?: string
  teacherRole?: boolean
}

export interface Req extends Request {
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
