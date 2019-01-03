import io from 'socket.io-client'

const socketIo = io.connect("http://localhost:3000");

const socket = {
  userName: "",
  inviteData: null, // 邀请他人的传输对象{inviter, to}
  socketIo: socketIo,

  // 触发用户加入事件
  userJoin() {
    return new Promise((resolve, reject) => {
      if (!this.userName) {
        this.userName = sessionStorage.userName;
      }
      if (this.userName) {
        socketIo.emit("userJoin", this.userName, (bool) => {
          resolve(bool)
        })
      } else {
        reject()
      }
    })
  },

  // 触发得到用户数组的事件
  getUserArr() {
    return new Promise((resolve, reject) => {
      this.socketIo.emit("getUserArr",null, (userArr) => {
        resolve(userArr)
      })
    })
  },

  // 触发邀请某人游戏的事件
  inviteUser(inviteData) {
    this.socketIo.emit("inviteUser", inviteData)
  },

  // 发出取消
  cancelInvite(inviteData) {
    this.socketIo.emit("cancelInvite", inviteData)
  },

  // 触发返回邀请结果的事件
  backInvite(inviteData) {
    this.socketIo.emit("backInvite", inviteData)
  },

  // 加入房间事件
  joinRoom(room) {
    this.socketIo.emit("joinRoom", room)
  },

  // 退出游戏
  outGame(userName) {
    this.socketIo.emit("outGame", userName)
  }
}

export { socket }
