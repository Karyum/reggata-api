import express from 'express'
import generalControllers from './general.controllers'

const router = express.Router()

router.post('/test-socket', generalControllers.testSocket)
router.get('/test-socket', generalControllers.testSocket)

router.get('/connect', generalControllers.connect)
router.post('/matches', generalControllers.createMatch)
router.get('/matches/:id', generalControllers.getMatch)
router.get('/join-match/:id', generalControllers.joinMatch)

export default router
