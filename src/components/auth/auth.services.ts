import Auth from './auth.models'
import bcrypt from 'bcrypt'
import logger from '@/utils/logger'
import ApiError from '@/utils/ApiError'

const login = async (credentials: any) => {
  const user = await Auth.getUserByEmail(credentials.email)

  // hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(credentials.password, salt)

  console.log(hashedPassword)

  if (user && user.password) {
    const isMatch = await bcrypt.compare(credentials.password, user.password)

    if (!isMatch) {
      throw new ApiError(400, 'Wrong password')
    }

    return user
  }

  if (!user) {
    throw new ApiError(400, 'User not found')
  }

  return user
}

export default {
  login
}
