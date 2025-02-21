import { serverSocket } from '@/app'
import { colors, initialBoard } from '@/constants'
import db from '@db'

const createMatch = async (color: string, hostId: string) => {
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
      guest_board_data: JSON.stringify(initialBoard),
      turn: 'host',
      host_tokens_home: 1,
      guest_tokens_home: 1,
      host_tokens_reached: 0,
      guest_tokens_reached: 0
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
      hostTokensHome: 'host_tokens_home',
      guestTokensHome: 'guest_tokens_home',
      hostTokensReached: 'host_tokens_reached',
      guestTokensReached: 'guest_tokens_reached',
      hostId: 'host_id',
      guestId: 'guest_id',
      turn: 'turn'
    })
    .first()

  return match
}

const getBoard = async (id, userId) => {
  const match = await db('matches')
    .where('id', id)
    .columns({
      hostId: 'host_id',
      guestId: 'guest_id',
      hostBoardData: 'board_data',
      guestBoardData: 'guest_board_data'
    })
    .first()

  if (!match) {
    return null
  }

  if (userId === match.hostId) {
    return match.hostBoardData
  } else if (userId === match.guestId) {
    return match.guestBoardData
  }

  return null
}

const joinMatch = async (id, guestId) => {
  const match = await db('matches')
    .where('id', id)
    .andWhere('guest_id', null)
    .columns({
      hostId: 'host_id'
    })
    .first()

  if (!match) {
    return null
  }

  const updatedMatch = await db('matches')
    .where('id', id)
    .update({
      guest_id: guestId
    })
    .returning('*')

  // get host socket
  const hostSocketId = await getSocketId(match.hostId)

  serverSocket.emit('server:match-joined', {
    socketId: hostSocketId
  })

  return id
}

const getSocketId = async (userId) => {
  const session = await db('sessions')
    .whereRaw(`cast(sess -> 'user' ->> 'id' as uuid) = ?`, [userId])
    .first()

  return session.sess.user.socketId
}

const getSockets = async (userIds) => {
  const sessions = await db('sessions')
    .whereRaw(`cast(sess -> 'user' ->> 'id' as uuid) = ANY(?)`, [userIds])
    .select()

  return sessions.map((session) => session.sess.user.socketId)
}

const endTurn = async (
  matchId,
  reroll: boolean = false,
  animationData?: any
) => {
  const match = await db('matches')
    .where('id', matchId)
    .columns({
      hostId: 'host_id',
      guestId: 'guest_id',
      turn: 'turn'
    })
    .first()

  if (!match) {
    return null
  }
  if (!reroll) {
    await db('matches')
      .where('id', matchId)
      .update({
        turn: match.turn === 'host' ? 'guest' : 'host'
      })
      .returning('*')
  }

  // const socketIds = await getSockets([match.hostId, match.guestId])
  const hostSocket = await getSocketId(match.hostId)
  const guestSocket = await getSocketId(match.guestId)

  serverSocket.emit('server:turn-changed', {
    socketIds: [hostSocket, guestSocket],
    turn: match.turn === 'host' ? 'guest' : 'host',
    toAnimation: animationData?.toAnimation,
    fromAnimation: animationData?.fromAnimation,
    toAnimationSteps: animationData?.toAnimationSteps,
    color: animationData?.color
  })

  return true
}

const moveToken = async (matchId, userId, from, steps) => {
  const match = await db('matches')
    .where('id', matchId)
    .columns({
      hostBoardData: 'board_data',
      guestBoardData: 'guest_board_data',
      hostId: 'host_id',
      guestId: 'guest_id',
      hostColor: 'host_color',
      guestColor: 'guest_color',
      hostTokensHome: 'host_tokens_home',
      guestTokensHome: 'guest_tokens_home',
      hostTokensReached: 'host_tokens_reached',
      guestTokensReached: 'guest_tokens_reached',
      turn: 'turn'
    })
    .first()

  if (!match) {
    return null
  }

  const hostBoardData = match.hostBoardData
  const guestBoardData = match.guestBoardData

  let hostTokensHome = match.hostTokensHome
  let guestTokensHome = match.guestTokensHome
  let hostTokensReached = match.hostTokensReached
  let guestTokensReached = match.guestTokensReached
  let toAnimation = from
  let toAnimationSteps = []
  let fromAnimation = from

  let reroll = false

  if (from === 'home') {
    if (match.turn === 'host' && userId === match.hostId) {
      hostBoardData[2][3 - (steps - 1)].token = match.hostColor
      guestBoardData[0][3 - (steps - 1)].token = match.hostColor
      hostTokensHome--
      toAnimation = `0,${3 - (steps - 1)}`

      if (hostBoardData[2][3 - (steps - 1)].tileType === 'shield') {
        reroll = true
      }
    }

    if (match.turn === 'guest' && userId === match.guestId) {
      hostBoardData[0][3 - (steps - 1)].token = match.guestColor
      guestBoardData[2][3 - (steps - 1)].token = match.guestColor
      guestTokensHome--
      toAnimation = `0,${3 - (steps - 1)}`

      if (guestBoardData[2][3 - (steps - 1)].tileType === 'shield') {
        reroll = true
      }
    }
  } else {
    const board = userId === match.hostId ? hostBoardData : guestBoardData

    const [fromRow, fromCol] = from.split(',').map((x) => parseInt(x))

    // find destination through the steps
    let toRow = fromRow
    let toCol = fromCol
    const stepsArray = new Array(steps).fill(1)
    fromAnimation = `${translateBoardRow(fromRow)},${fromCol}`

    stepsArray.forEach((step, i) => {
      if (board[toRow][toCol].nextTile === 'up') {
        toRow = toRow + step
        toAnimationSteps.push(`${translateBoardRow(toRow)},${toCol}`)
        return
      }

      if (board[toRow][toCol].nextTile === 'down') {
        toRow = toRow - step
        toAnimationSteps.push(`${translateBoardRow(toRow)},${toCol}`)
        return
      }

      if (board[toRow][toCol].nextTile === 'left') {
        toCol = toCol - step
        toAnimationSteps.push(`${translateBoardRow(toRow)},${toCol}`)
        return
      }

      if (board[toRow][toCol].nextTile === 'right') {
        toCol = toCol + step
        toAnimationSteps.push(`${translateBoardRow(toRow)},${toCol}`)
        return
      }
    })

    // If there is no token in the destination, move the token
    if (!board[toRow][toCol].token) {
      if (match.turn === 'host' && userId === match.hostId) {
        hostBoardData[fromRow][fromCol].token = null
        guestBoardData[translateBoardRow(fromRow)][fromCol].token = null

        if (hostBoardData[toRow][toCol].tileType === 'finish') {
          hostTokensReached++
        } else {
          hostBoardData[toRow][toCol].token = match.hostColor
          guestBoardData[translateBoardRow(toRow)][toCol].token =
            match.hostColor
          toAnimation = `${translateBoardRow(toRow)},${toCol}`
        }

        if (board[toRow][toCol].tileType === 'shield') {
          reroll = true
        }
      }

      if (match.turn === 'guest' && userId === match.guestId) {
        guestBoardData[fromRow][fromCol].token = null
        hostBoardData[translateBoardRow(fromRow)][fromCol].token = null

        if (guestBoardData[toRow][toCol].tileType === 'finish') {
          guestTokensReached++
        } else {
          guestBoardData[toRow][toCol].token = match.guestColor
          hostBoardData[translateBoardRow(toRow)][toCol].token =
            match.guestColor
          toAnimation = `${translateBoardRow(toRow)},${toCol}`
        }

        if (board[toRow][toCol].tileType === 'shield') {
          reroll = true
        }
      }
    }

    // if there is a friendly token we will assume that the frontend checker would not allow this move
    // so if it reaches the API and there is a token, it must be an enemy token
    // so we will remove the enemy token, and move the token
    if (board[toRow][toCol].token) {
      if (match.turn === 'host' && userId === match.hostId) {
        // if the token is not the same color as the host, then it is the guest's token
        // so return the token to the guest's home
        if (hostBoardData[toRow][toCol].token !== match.hostColor) {
          guestTokensHome++
        }

        hostBoardData[fromRow][fromCol].token = null
        guestBoardData[translateBoardRow(fromRow)][fromCol].token = null
        hostBoardData[toRow][toCol].token = match.hostColor
        guestBoardData[translateBoardRow(toRow)][toCol].token = match.hostColor
        toAnimation = `${translateBoardRow(toRow)},${toCol}`
      }

      if (match.turn === 'guest' && userId === match.guestId) {
        if (guestBoardData[toRow][toCol].token !== match.guestColor) {
          hostTokensHome++
        }

        guestBoardData[fromRow][fromCol].token = null
        hostBoardData[translateBoardRow(fromRow)][fromCol].token = null
        guestBoardData[toRow][toCol].token = match.guestColor
        hostBoardData[translateBoardRow(toRow)][toCol].token = match.guestColor
        toAnimation = `${translateBoardRow(toRow)},${toCol}`
      }
    }
  }

  let winner = null

  await db('matches')
    .where('id', matchId)
    .update({
      board_data: JSON.stringify(hostBoardData),
      guest_board_data: JSON.stringify(guestBoardData),
      host_tokens_home: hostTokensHome,
      guest_tokens_home: guestTokensHome,
      host_tokens_reached: hostTokensReached,
      guest_tokens_reached: guestTokensReached
    })

  if (hostTokensReached === 1) {
    winner = match.hostColor
  } else if (guestTokensReached === 1) {
    winner = match.guestColor
  }

  const hostSocketId = await getSocketId(match.hostId)
  const guestSocketId = await getSocketId(match.guestId)

  if (winner) {
    serverSocket.emit('server:winner', {
      socketIds: [hostSocketId, guestSocketId],
      winner
    })
  } else {
    // end turn
    await endTurn(matchId, reroll, {
      toAnimation,
      fromAnimation,
      toAnimationSteps,
      color: match.turn === 'host' ? match.hostColor : match.guestColor
    })
  }

  return true
}

const reset = async (matchId, userId) => {
  const match = await db('matches')
    .where('id', matchId)
    .columns({
      hostId: 'host_id',
      guestId: 'guest_id'
    })
    .first()

  if (!match) {
    return null
  }

  await db('matches')
    .where('id', matchId)
    .update({
      board_data: JSON.stringify(initialBoard),
      guest_board_data: JSON.stringify(initialBoard),
      turn: 'host',
      host_tokens_home: 1,
      guest_tokens_home: 1,
      host_tokens_reached: 0,
      guest_tokens_reached: 0
    })

  const socketIds = await getSockets(
    [match.hostId, match.guestId].filter((id) => id !== userId)
  )

  serverSocket.emit('server:reset', {
    socketIds
  })

  return true
}

export default {
  createMatch,
  getMatch,
  joinMatch,
  getSocketId,
  endTurn,
  moveToken,
  getBoard,
  reset
}

const translateBoardRow = (row) => {
  if (row === 0) {
    return 2
  }

  if (row === 1) {
    return 1
  }

  if (row === 2) {
    return 0
  }

  return row
}
