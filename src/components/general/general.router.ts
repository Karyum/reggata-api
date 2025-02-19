import express from 'express'
import generalControllers from './general.controllers'

const router = express.Router()

router.post('/test-socket', generalControllers.testSocket)
router.get('/test-socket', generalControllers.testSocket)

export default router
