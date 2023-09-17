import authRouter from './auth/auth.router'
import generalRouter from './general/general.router'
import patientsRouter from './patients/patients.router'

// Add the app component to the router

const routers = {
  auth: authRouter,
  general: generalRouter,
  patients: patientsRouter
}

export default routers
