import io from 'socket.io-client'

const chess = {
  socket: '',
  init () {
    this.socket = io.connect('localhost:3000', {'force new connection': true})
  }
}

export default chess
