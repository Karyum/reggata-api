import { Req, Res } from '@/types'
import catchAsync from '@/utils/catchAsync'
import generalService from './general.services'
import { v4 as uuidv4 } from 'uuid'
import { serverSocket } from '@/app'

const testSocket = catchAsync(async (req: Req, res: Res) => {
  res.send({ a: 'test' })
})

const connect = catchAsync(async (req: Req, res: Res) => {
  if (req.session.user) {
    return res.send({
      status: 'success',
      token: (req.token && req.token[0]) || ''
    })
  }

  req.session.user = { id: uuidv4() }

  return res.send({
    status: 'success',
    token: (req.token && req.token[0]) || ''
  })
})

const createMatch = catchAsync(async (req: Req, res: Res) => {
  const { color } = req.body
  const user = req.session.user

  const match = await generalService.createMatch(color, user.id)

  res.send({
    status: 'success',
    matchId: match.id
  })
})

const getMatch = catchAsync(async (req: Req, res: Res) => {
  const { id } = req.params
  const user = req.session.user

  const match = await generalService.getMatch(id)

  res.send({
    status: 'success',
    match,
    myTurn:
      match.turn === 'host'
        ? match.hostId === user.id
        : match.guestId === user.id
  })
})

const getBoard = catchAsync(async (req: Req, res: Res) => {
  const { matchId } = req.params
  const user = req.session.user

  const board = await generalService.getBoard(matchId, user.id)

  res.send({
    status: 'success',
    board
  })
})

const joinMatch = catchAsync(async (req: Req, res: Res) => {
  const { id } = req.params
  const user = req.session.user

  const match = await generalService.joinMatch(id, user.id)

  if (!match) {
    return res.send({
      status: 'error',
      message: 'Match not found or already full'
    })
  }

  return res.send({
    status: 'success',
    matchId: id
  })
})

const flip = catchAsync(async (req: Req, res: Res) => {
  const { matchId } = req.params
  const { coins } = req.body
  const user = req.session.user

  const match = await generalService.getMatch(matchId)

  if (!match) {
    return res.send({
      status: 'error',
      message: 'Match not found'
    })
  }

  if (match.hostId === user.id && match.turn !== 'guest') {
    const socketId = await generalService.getSocketId(match.guestId)

    serverSocket.emit('server:flip', {
      coins,
      socketId
    })
  }

  if (match.guestId === user.id && match.turn !== 'host') {
    const socketId = await generalService.getSocketId(match.hostId)
    serverSocket.emit('server:flip', {
      coins,
      socketId
    })
  }

  return res.send({
    status: 'success'
  })
})

const move = catchAsync(async (req: Req, res: Res) => {
  const { matchId } = req.params

  const { from, steps } = req.body

  const user = req.session.user

  await generalService.moveToken(matchId, user.id, from, steps)

  // send socket event to opponent

  return res.send({
    status: 'success'
  })
})

const endTurn = catchAsync(async (req: Req, res: Res) => {
  const { matchId } = req.params
  const user = req.session.user

  await generalService.endTurn(matchId)

  return res.send({
    status: 'success'
  })
})

const reset = catchAsync(async (req: Req, res: Res) => {
  const { matchId } = req.params
  const user = req.session.user

  await generalService.reset(matchId, user.id)

  return res.send({
    status: 'success'
  })
})

export default {
  testSocket,
  connect,
  createMatch,
  getMatch,
  joinMatch,
  flip,
  move,
  endTurn,
  getBoard,
  reset
}
