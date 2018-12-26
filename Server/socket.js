function socket (server) {
  const io = require('socket.io')(server);
  const userMap = new Map(); // 用户队列(顺序，查找), 用户名 =》 用户对象

  io.on("connection", (socket) => {
    let userId = socket.id;
    console.log(userId)
    // 监听用户加入游戏大厅
    socket.on("userJoin", (userName, fn) => {
      if (!userMap.has(userName)) {
        userMap.set(userName, {
          userId: userId,
          canInvite: 1, // 自定义1-可邀请加入游戏、0-不可邀请加入游戏
        });
        userMapChange()
        fn(true);
      } else {
        fn(false);
      }
    })

    // 监听获取用户的列表
    socket.on("getUserArr", (data,fn) => {
      fn(getUserArr())
    })

    // 监听用户断开链接
    socket.on("disconnect", () => {
      for (let key of userMap.keys()) {

        if (userMap.get(key).userId === userId) {
          userMap.delete(key)
          console.log("change")
          userMapChange()
          break
        }
      }
      console.log("disconnect")
    })

    // 监听邀请用户游戏
    socket.on("inviteUser", (inviteData) => {
      console.log("inviteUser")
      // 触发邀请对应用户的事件
      socket.broadcast.emit("invite"+inviteData.to, inviteData);
    })

    // 监听用户对邀请的应答事件
      socket.on("backInvite", (invitedData) => {
        console.log("invited", invitedData.from)
      // 触发返回给对应用户的事件
      socket.broadcast.emit("getInvite" + invitedData.from, invitedData.bool)
    })

    // 触发用户Map改变事件
    function userMapChange() {
      // 广播
      socket.broadcast.emit("userMapChange", getUserArr())
    }

    // 得到用户的Arr
    function getUserArr () {
      return [...userMap]
    }
  })
}

module.exports = socket;