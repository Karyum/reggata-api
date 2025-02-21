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
      console.log('flip 2', data.socketId)
      io.to(data.socketId).emit('client:flip', {
        coins: data.coins
      })
    })

    socket.on('server:turn-changed', (data: { socketIds: string[] }) => {
      data.socketIds.forEach((socketId) => {
        io.to(socketId).emit('client:turn-changed')
      })
    })

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
      console.log(1)
      data.socketIds.forEach((socketId) => {
        io.to(socketId).emit('client:reset')
      })
    })
  })

  return io
}
