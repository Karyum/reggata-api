import authRouter from './auth/auth.router'
import generalRouter from './general/general.router'

// Add the app component to the router

const routers = {
  auth: authRouter,
  general: generalRouter,
}

export default routers
