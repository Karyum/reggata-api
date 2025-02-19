import { serverSocket } from '@/app'
import { colors, initialBoard } from '@/constants'
import db from '@db'

const createMatch = async (color: string, hostId) => {
  const match = await db('matches')
    .where('host_id', hostId)
    .where('guest_id', null)
    .first()

  if (match) {
    return match
  } else {
    // delete existing matches
    await db('matches').where('host_id', hostId).delete()
  }

  const createdMatch = await db('matches')
    .insert({
      host_color: color,
      guest_color: colors.find((c) => c !== color),
      host_id: hostId,
      board_data: JSON.stringify(initialBoard),
      turn: 'host'
    })
    .returning('*')

  return createdMatch[0]
}

const getMatch = async (id) => {
  const match = await db('matches')
    .where('id', id)
    .columns({
      id: 'id',
      hostColor: 'host_color',
      guestColor: 'guest_color',
      hostId: 'host_id',
      guestId: 'guest_id',
      turn: 'turn'
    })
    .first()

  return match
}

const joinMatch = async (id, guestId) => {
  const match = await db('matches')
    .where('id', id)
    .where('guest_id', null)
    .columns({
      hostId: 'host_id'
    })
    .first()

  if (!match) {
    return null
  }

  //   const updatedMatch = await db('matches')
  //     .where('id', id)
  //     .update({
  //       guest_id: guestId
  //     })
  //     .returning('*')

  // get host socket
  const hostSession = await db('sessions')
    .whereRaw(`cast(session -> 'user' ->> 'id' as uuid) = ?`, [match.hostId])
    .first()

  console.log(hostSession)

  // serverSocket.emit('match-joined', {

  return true
}

export default {
  createMatch,
  getMatch,
  joinMatch
}
