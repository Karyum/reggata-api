import db from '@db'

let serverHasConnected = false

export default (io) => {
  io.on('connection', async (socket) => {
    if (!socket.handshake.query.isServer) {
      socket.request.session.user.socketId = socket.id
      socket.request.session.save()

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
  })

  return io
}
