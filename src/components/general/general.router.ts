import express from 'express'
import generalControllers from './general.controllers'
import authMiddlewares from '@/middlewares/auth'

const router = express.Router()

router.post('/test-socket', generalControllers.testSocket)
router.get('/test-socket', generalControllers.testSocket)
router.post('/contact', generalControllers.contact)

router.use(authMiddlewares.checkAuth)

export default router
