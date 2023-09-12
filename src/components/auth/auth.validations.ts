import Joi from 'joi'

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
  companyName: Joi.string().required(),
  phone: Joi.string().required(),
  date: Joi.date().required()
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean()
})

export const newLoginSchema = Joi.object({
  email: Joi.string().email().required()
})

export const newLoginPasswordSchema = Joi.object({
  password: Joi.string().required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')),
  email: Joi.string().email().required()
})

export const studentLoginSchema = Joi.object({
  classId: Joi.string().required(),
  loginId: Joi.string().required()
})
