function socket (server) {
  const io = require('socket.io')(server);
  const userList = {}; // 用户队列(顺序，查找), 用户名 =》 用户对象
  const roomList ={};

  io.on("connection", (socket) => {
    let curUser = "";
    // 监听用户加入游戏大厅
    socket.on("userJoin", (userName, fn) => {
      curUser = userName;
      if (!(userName in userList)) {
        userList[userName] = {
          canInvite: true,
          socket: socket
        }
        userListChange()
        fn(true);
      } else {
        fn(false);
      }
    })

    // 监听获取用户的列表
    socket.on("getUserArr", (data,fn) => {
      fn(getUserNameList())
    })

    // 监听用户断开链接
    socket.on("disconnect", () => {
      let arr = Object.keys(userList);
      for (let i = 0, length = arr.length; i < length; i++) {
        if (arr[i] === curUser) {
          delete userList[curUser];
          userListChange()
          break;
        }
      }
      console.log("disconnect");
    })

    socket.on("cancelInvite", (inviteData) => {
      console.log(inviteData.accepter + "cancel")
      userList[inviteData.accepter].socket.emit("cancelInvite");
    })

    // 监听邀请用户游戏
    socket.on("inviteUser", (inviteData) => {
      console.log("invite")
      // 触发邀请对应用户的事件
      userList[inviteData.accepter].socket.emit("listenInvite", inviteData);
    })

    // 监听用户对邀请的应答事件
    socket.on("backInvite", (inviteData) => {
      // 触发返回给对应用户的事件
      userList[inviteData.inviter].socket.emit("listenInviteRel", inviteData)
    })

    // 监听用户加入
    socket.on("joinRoom", (obj) => {
      console.log("joinRoom")
      let name1 = obj.ownSide.userName
        ,name2 = obj.otherSide.userName
        ,roomName = obj.name
        ,ownName = obj.ownSide.userName
        ,sideData = {}

      if (!(roomName in roomList)) {
        roomList[roomName] = 1;
      } else {
        // 等于1，说明现在是第二个加入的人，此时随机生成他们属于哪一方
        if (roomList[roomName] === 1) {
          roomList[roomName]  = 2

          if (Math.random() * 10 > 5) {
            sideData[name1] = "red";
            sideData[name2] = "black";
          }else {
            sideData[name2] = "red";
            sideData[name1] = "black";
          }
        }
      }
      userList[name1].socket.emit("listenJoinRoom", ownName);
      userList[name2].socket.emit("listenJoinRoom", ownName);

      if (roomList[roomName] === 2){
        delete roomList[roomName];
        console.log(sideData);
        userList[name1].socket.emit("makeBelong", sideData)
        userList[name2].socket.emit("makeBelong",sideData)
      }
    })

    // 监听用户是否走棋
    socket.on("goChess", (goChessData) => {
      // 下棋双方的棋子在对方的棋盘上和在自己的棋盘上的位置不一样，是相互对称的（为了用户看，不管是那一方的用户的棋子初始化都在下半棋盘）
      goChessData.po = {x: 8 - goChessData.po.x, y: 9 - goChessData.po.y}
      goChessData.nextPo = {x: 8 - goChessData.nextPo.x, y: 9 - goChessData.nextPo.y}
      userList[goChessData.to].socket.emit("goChess", goChessData);
    })

    // 退出游戏
    socket.on("outGame", (userName) => {
      userList[userName].socket.emit("outGame");
    })

    // 触发用户Map改变事件
    function userListChange() {
      // 广播
      socket.broadcast.emit("userListChange", getUserNameList())
    }

    // 得到用户的Arr
    function getUserNameList () {
      return Object.keys(userList).map((userName) => {
        return [userName, userList[userName].canInvite]
      })
    }
  })
}

module.exports = socket;