import io from 'socket.io-client'

const socketIo = io.connect("http://localhost:3000");

const socket = {
  userName: "",

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
      socketIo.emit("getUserArr",null, (userArr) => {
        resolve(userArr)
      })
    })
  },

  // 监听服务器端用户Map改变事件
  listenUserArrChange(cb) {
    socketIo.on("userMapChange", (userArr) => {
      console.log(userArr);
      cb(userArr)
    })
  },

  // 触发邀请某人游戏的事件
  inviteUser(inviteData) {
    console.log("触发邀请某人游戏的事件")
    socketIo.emit("inviteUser", inviteData)
  },

  // 监听是否被某人邀请的事件
  invited(userName, cb) {
    socketIo.on("invite"+userName, (inviteData) => {
      console.log("监听是否被某人邀请的事件")
      cb(inviteData)
    })
  },

  // 触发返回邀请结果的事件
  backInvite(invitedData) {
    console.log("触发返回邀请结果的事件");
    socketIo.emit("backInvite", invitedData)
  },

  // 监听获取邀请结果事件
  getInvite(userName, cb) {
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    socketIo.on("getInvite"+userName, nzq)
    function nzq ( bool) {
      console.log("接收到邀请确认结果")
      cb(bool)
    }
  },

}

export { socket }
