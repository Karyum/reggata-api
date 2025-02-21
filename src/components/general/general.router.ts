import express from 'express'
import generalControllers from './general.controllers'

const router = express.Router()

router.post('/test-socket', generalControllers.testSocket)
router.get('/test-socket', generalControllers.testSocket)

router.get('/connect', generalControllers.connect)
router.post('/matches', generalControllers.createMatch)
router.get('/matches/:id', generalControllers.getMatch)
router.get('/join-match/:id', generalControllers.joinMatch)
router.post('/flip/:matchId', generalControllers.flip)
router.post('/move/:matchId', generalControllers.move)
router.post('/end-turn/:matchId', generalControllers.endTurn)
router.get('/board/:matchId', generalControllers.getBoard)
router.post('/reset/:matchId', generalControllers.reset)

export default router
