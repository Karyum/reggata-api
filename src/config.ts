import dotenv from 'dotenv'
dotenv.config()

const envVars = process.env

export const environment = envVars.NODE_ENV || 'development'
export const isDev = environment === 'development'

export const port = process.env.PORT || 3010

export const lpadApiUrl = envVars.LPAD_API_URL
export const commonApiSecret = envVars.COMMON_SERVERS_SECRET
export const selfUrl = envVars.SELF_URL || `http://localhost:3010`

export const databaseConf = {
  host: envVars.DATABASE_HOST,
  user: envVars.DATABASE_USER,
  password: envVars.DATABASE_PASSWORD,
  database: envVars.DATABASE_NAME
}

export const testingDatabaseConf = {
  host: envVars.TEST_DATABASE_HOST,
  user: envVars.TEST_DATABASE_USER,
  password: envVars.TEST_DATABASE_PASSWORD,
  database: envVars.TEST_DATABASE_NAME
}

