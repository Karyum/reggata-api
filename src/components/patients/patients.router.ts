import express from 'express'
import patientsControllers from './patients.controllers'
import authMiddlewares from '@/middlewares/auth'

const router = express.Router()

router.use(authMiddlewares.checkAuth)

router.post('/', patientsControllers.addPatient)
router.get('/:id', patientsControllers.getPatient)
router.get('/', patientsControllers.getPatients)
router.post('/sessions', patientsControllers.addSession)
router.post('/sessions/fetch', patientsControllers.fetchSessions)

export default router
