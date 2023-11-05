import express from 'express'
import patientsControllers from './patients.controllers'
import authMiddlewares from '@/middlewares/auth'

const router = express.Router()

router.use(authMiddlewares.checkAuth)
router.use(authMiddlewares.isAdmin)

router.post('/', patientsControllers.addPatient)
router.get('/:id', patientsControllers.getPatient)
router.get('/', patientsControllers.getPatients)
router.post('/sessions', patientsControllers.addSession)
router.put('/sessions', patientsControllers.updateSession)
router.delete('/sessions/:sessionId', patientsControllers.deleteSession)
router.post('/sessions/fetch', patientsControllers.fetchSessions)
router.post('/add-user', patientsControllers.addUserToPatient)
router.post('/revoke-access', patientsControllers.revokeAccess)
router.post('/enact-access', patientsControllers.enactAccess)
router.post('/new-note', patientsControllers.addNote)
router.get(
  '/survey-results/:patientId/:surveyName',
  patientsControllers.getSurveyResults
)

export default router
