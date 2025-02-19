import dotenv from 'dotenv'
dotenv.config()

const envVars = process.env

export const environment = envVars.NODE_ENV || 'development'
export const isDev = environment === 'development'

export const port = process.env.PORT || 3000

export const selfUrl = envVars.SELF_URL || `http://localhost:3000`

export const databaseConf = {
  host: envVars.DATABASE_HOST,
  user: envVars.DATABASE_USER,
  password: envVars.DATABASE_PASSWORD,
  database: envVars.DATABASE_NAME
}
