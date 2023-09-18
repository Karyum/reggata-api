import { Req, Res } from '@/types'
import authervice from './auth.services'

import { loginSchema } from './auth.validations'

import catchAsync from '@/utils/catchAsync'
import ApiError from '@/utils/ApiError'
import logger from '@/utils/logger'

const login = catchAsync(async (req: Req, res: Res) => {
  // const validation = loginSchema.validate(req.body)

  // if (validation.error) {
  //   throw new ApiError(
  //     400,
  //     'Invalid request body',
  //     null,
  //     validation.error.details
  //   )
  // }

  const data = await authervice.login(req.body)

  req.session.user = {
    email: data.email
  }

  res.send({
    message: 'Logged in',
    token: (req.token && req.token[0]) || ''
  })
})

const logout = catchAsync(async (req: Req, res: Res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error(err)
      throw new ApiError(500, 'Error logging out')
    }
  })

  res.send({})
})

const isIn = catchAsync(async (req: Req, res: Res) => {
  try {
    const { email } = req.session.user

    // if teacher get the email
    // if (teacherId) {
    //   const teacher = await authervice.getTeacherById(teacherId)

    //   if (!teacher) {
    //     throw new ApiError(401, 'Teacher not found')
    //   }

    //   res.send({
    //     role: 'teacher',
    //     email: teacher.email,
    //     name: teacher.name,
    //     socketId
    //   })
    // }

    res.send({
      isIn: !!email
    })
  } catch (error) {
    res.status(401).send({
      isIn: false
    })
  }
})

export default {
  login,
  logout,
  isIn
}
