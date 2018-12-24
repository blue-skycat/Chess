import io from 'socket.io-client'

const socketIo = io.connect("http://localhost:3000");

const socket = {
  userName: "",
  // 用户加入
  userJoin() {
    return new Promise((resolve, reject) => {
      let that = this;
      socketIo.emit("userJoin", {userName: that.userName}, (bool) => {
        resolve(bool)
      })
    })
  }
}

export { socket }
