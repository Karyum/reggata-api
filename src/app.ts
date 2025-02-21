import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import httpStatus from 'http-status'
import session from 'express-session'
import karyumSession from '@karyum/express-session'
import db from '@db'
import knexSessionConnect from 'connect-session-knex'
import path from 'path'

import { errorHandler, errorConverter } from './middlewares/error'
import socketManager from './socket'

import routers from './components'
import ApiError from './utils/ApiError'
import { environment, isDev, selfUrl } from './config'
import { io } from 'socket.io-client'
import logger from './utils/logger'

const app = express()
const server = http.createServer(app)
export const socket = require('socket.io')(server)

const KnexSessionStore = knexSessionConnect(session)
const sessionStore = new KnexSessionStore({
  knex: db,
  tablename: 'sessions',
  createtable: true,
  clearInterval: 1000 * 60 * 60 * 24 // delete expired sessions every 7 days,
})

const sessionMiddleware = karyumSession({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  shouldReplaceCookieWithToken: true,
  resave: false,
  saveUninitialized: false
})

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) => {
  // to the request object add Authorization header with the token
  socket.request.headers.authorization = `${socket.handshake.query['token']}`

  return middleware(socket.request, { getHeader: () => 1 }, next)
}

socket.use(wrap(sessionMiddleware))

socketManager(socket)

export const serverSocket = io(selfUrl, {
  query: {
    isServer: true
  }
})

app.set('trust proxy', 1)

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://reggata-client.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200
  })
)
// limit amount of requests per minute to avoid DDoS
// app.use(
//   rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: isDev ? 99999 : 150, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false // Disable the `X-RateLimit-*` headers
//   })
// )

app.use(helmet())

app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false, limit: '10mb' }))

app.use(sessionMiddleware)

app.use('/api/general', routers.general)

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

// convert error to ApiError, if needed
app.use(errorConverter)

// handle error
app.use(errorHandler)

export default server
export { app }
