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
      socketIo.emit("getUserArr",null, (userArr) => {
        resolve(userArr)
      })
    })
  },

  // 触发邀请某人游戏的事件
  inviteUser(inviteData) {
    console.log("触发邀请某人游戏的事件")
    socketIo.emit("inviteUser", inviteData)
  },

  // 发出取消
  cancelInvite(inviteData) {
    socketIo.emit("cancelInvite", inviteData)
  },

  // 监听取消
  listenCancelInvite(cb){
    socketIo.on("cancelInvite", cb)
  },

  // 监听是否被某人邀请的事件
  listenInvite(cb) {
    console.log("监听是否被某人邀请的事件")
    socketIo.on("listenInvite", (inviteData) => {

      cb(inviteData)
    })
  },

  // 触发返回邀请结果的事件
  backInvite(inviteData) {
    console.log("触发返回邀请结果的事件");
    socketIo.emit("backInvite", inviteData)
  },

  // 监听获取邀请结果事件
  listenInviteRel(cb) {
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    //////////////////////////////////////////////////////////// 这个回调函数被多次执行
    socketIo.on("listenInviteRel", (inviteData) => {
        console.log("接收到邀请确认结果")
        cb(inviteData)
    })
  },


  // 加入房间事件
  joinRoom(room) {
    socketIo.emit("joinRoom", room)
  },

  // 监听他人键入
  listenJoinRoom(cb) {
    socketIo.on("listenJoinRoom", (userName) => {
      cb(userName)
    })
  },

  // 系统随机选取当前用户属于哪一方（红/黑）
  listenMakeBelong(cb) {
    socketIo.on("makeBelong", (obj) => {
      cb(obj)
    })
  }
}

export { socket }
