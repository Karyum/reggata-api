import express from 'express'
import authControllers from './auth.controllers'
import authMiddlewares from '@/middlewares/auth'

const router = express.Router()

router.post('/login', authControllers.login)
router.get('/teacher/logout', authMiddlewares.checkAuth, authControllers.logout)
router.get('/is-in', authControllers.isIn)

export default router
