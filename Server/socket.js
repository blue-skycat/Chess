function socket (server) {
  const io = require('socket.io')(server);
  const userList = new Map(); // 用户队列(顺序，查找), 用户名 =》 用户对象
  
  io.on("connection", (socket) => {
    console.log("connection")
    // 用户加入
    socket.on("userJoin", function (userInfo, fn) {
      console.log("userJoin")
      if (!userList.has(userInfo.userName)) {
        userList.set(userInfo.userName, userInfo);
        fn(true);
      } else {
        fn(false);
      }
    })

    // 用户断开链接
    socket.on("disconnect", () => {
      console.log("disconnect")
    })
  })
}

module.exports = socket;