import { socket } from './app'

let serverHasConnected = false

export default (io) => {
  io.on('connection', async (socket) => {
    if (!socket.handshake.query.isServer) {
      if (socket.request.session.user) {
        socket.request.session.user.socketId = socket.id
        socket.request.session.save()
      }

      //
    } else if (!serverHasConnected) {
      serverHasConnected = true
    } else if (
      socket.handshake.query.isServer &&
      !socket.handshake.address.includes('127.0.0.1')
    ) {
      socket.disconnect()
    }

    // socket.on('disconnect', () => {
    //   console.log('user disconnected')
    // })

    socket.on('server:match-joined', (data: { socketId: string }) => {
      io.to(data.socketId).emit('client:match-joined')
    })

    socket.on('server:flip', (data: { coins: number; socketId: string }) => {
      io.to(data.socketId).emit('client:flip', {
        coins: data.coins
      })
    })

    socket.on(
      'server:turn-changed',
      (data: {
        socketIds: string[]
        turn: string
        winner: string
        toAnimation: string
        fromAnimation: string
        toAnimationSteps: string[]
        color: string
        homeTotal: number
      }) => {
        data.socketIds.forEach((socketId, i) => {
          if (i === 0 && data.turn === 'host') {
            io.to(socketId).emit('client:turn-changed', {
              toAnimation: data.toAnimation,
              fromAnimation: data.fromAnimation,
              toAnimationSteps: data.toAnimationSteps,
              color: data.color,
              winner: data.winner,
              homeTotal: data.homeTotal
            })
            return
          }

          if (i === 1 && data.turn === 'guest') {
            io.to(socketId).emit('client:turn-changed', {
              toAnimation: data.toAnimation,
              fromAnimation: data.fromAnimation,
              toAnimationSteps: data.toAnimationSteps,
              color: data.color,
              winner: data.winner,
              homeTotal: data.homeTotal
            })
            return
          }

          io.to(socketId).emit('client:turn-changed', {
            winner: data.winner
          })
        })
      }
    )

    socket.on('server:reroll', (data: { socketId: string }) => {
      io.to(data.socketId).emit('client:reroll')
    })

    socket.on(
      'server:winner',
      (data: { socketIds: string[]; winner: string }) => {
        data.socketIds.forEach((socketId) => {
          io.to(socketId).emit('client:winner', data.winner)
        })
      }
    )

    socket.on('server:reset', (data: { socketIds: string[] }) => {
      data.socketIds.forEach((socketId) => {
        io.to(socketId).emit('client:reset')
      })
    })
  })

  return io
}
