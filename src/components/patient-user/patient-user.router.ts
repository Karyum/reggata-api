import express from 'express'
import patientUserControllers from './patient-user.controllers'
import authMiddlewares from '@/middlewares/auth'

const router = express.Router()

router.use(authMiddlewares.checkAuth)

router.post('/save-situation-diary', patientUserControllers.saveSituationDiary)

router.post('/save-anxiety-survey', patientUserControllers.saveAnxietySurvey)

export default router
