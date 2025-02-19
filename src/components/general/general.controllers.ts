import { Req, Res } from '@/types'
import catchAsync from '@/utils/catchAsync'
import generalService from './general.services'
import { v4 as uuidv4 } from 'uuid'

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

  const match = await generalService.getMatch(id)

  res.send({
    status: 'success',
    match
  })
})

const joinMatch = catchAsync(async (req: Req, res: Res) => {
  const { id } = req.params
  const user = req.session.user

  const match = await generalService.joinMatch(id, user.id)

  res.send({
    status: 'success',
    match
  })
})

export default {
  testSocket,
  connect,
  createMatch,
  getMatch,
  joinMatch
}
