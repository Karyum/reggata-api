import { socket } from './app'

export default (io) => {
  io.on('connection', async (socket) => {
    if (socket.request.session.user) {
      socket.request.session.user.socketId = socket.id
      socket.request.session.save()
    } else {
      socket.disconnect()
    }

    // socket.on('disconnect', () => {
    //   console.log('user disconnected')
    // })
  })

  return io
}
