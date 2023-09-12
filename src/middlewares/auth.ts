import { Req, Res, Next } from '@/types'
import ApiError from '@/utils/ApiError'
import { commonApiSecret } from '@/config'
import catchAsync from '@/utils/catchAsync'
import logger from '@/utils/logger'
import db from '@db'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'

const checkAuth = catchAsync((req: Req, res: Res, next: Next) => {
  if (req.session.user) {
    next()
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
  }
})

const LpadAccess = catchAsync(async (req: Req, res: Res, next: Next) => {
  const { s } = req.body

  if (s === commonApiSecret) {
    next()
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
  }
})

const isRole = (role: string) =>
  catchAsync(async (req: Req, res: Res, next: Next) => {
    if (role === 'student' && req.session.user.studentId) {
      next()
    } else if (role === 'teacher' && req.session.user.teacherId) {
      next()
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }
  })

const isManageClientAllowed = catchAsync(
  async (req: Req, res: Res, next: Next) => {
    if (!req.body.secret) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }

    const { secret } = req.body

    if (secret === commonApiSecret) {
      next()
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized')
    }
  }
)

export default {
  checkAuth,
  LpadAccess,
  isRole,
  isManageClientAllowed
}
