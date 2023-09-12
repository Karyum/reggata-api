import db from '@db'

const getUserByEmail = async (email: string) => {
  const user = await db('users').where({ email }).first()

  return user
}

export default { getUserByEmail }
