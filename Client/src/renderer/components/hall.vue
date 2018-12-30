<template>
    <div class="main">
        <div class="header">
            <h3>象棋</h3>
            <p>你好！{{userName}}</p>
        </div>
        <div class="body">
            <template v-if="userArr.length>1">
                <div v-for="item of userArr" v-if="item[0] !== userName" class="user-item">
                    <p class="userName">{{item[0]}}</p>
                    <template v-if="item[1]">
                        <p>等待中...&nbsp;&nbsp;&nbsp;&nbsp;可邀请</p>
                        <el-button
                                type = "primary"
                                class="can-invite"
                                @click="inviteUser(item[0])"
                        >邀请</el-button>
                    </template>
                    <template v-else>
                        <p>游戏中...&nbsp;&nbsp;&nbsp;&nbsp;不可邀请</p>
                        <el-button type="primary" class="ban-invite">不可邀请</el-button>
                    </template>
                </div>
            </template>
            <template v-else>
                <el-alert
                        title="当前大厅无其他玩家"
                        type="info"
                        show-icon>
                </el-alert>
            </template>
        </div>
        <el-dialog
                :visible.sync="invitedVisible"
                width="30%"
                center>
            <span>{{getInviter}}邀请你加入游戏</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="backInvite(true)">加入</el-button>
                <el-button type="primary" @click="backInvite(false)">拒绝</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :visible.sync="inviteSucVisible"
                width="30%"
                center>
            <span>{{inviteSucContent}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="comeInChess">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title= "邀请等待"
                :visible.sync="inviteWaitVisible"
                width="30%"
                center>
            <span>正在等待对方的应答 <i class="el-icon-loading"></i></span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancelInvite">取消邀请</el-button>
            </span>
        </el-dialog>
        <!--v-if="inviteWaitVisible"-->
    </div>
</template>

<script>
  export default {
    name: 'hall',
    props: {},
    data () {
      return {
        userName: "",
        userArr: [],
        transData: null, // 开启棋局传入的对象 move: {x: 0, y: 0,},inviter: "", accepter: "",}
        inviteWaitVisible: false, // 点击邀请后不允许在点击
        inviteSucVisible: false, // 邀请成功
        inviteSucContent: "",
        invitedVisible: false, // 被邀请
      }
    },
    computed: {
      getInviter() {
        return this.$socket.inviteData && this.$socket.inviteData.inviter
      }
    },
    methods: {
      // 监听邀请取消
      listenCancelInvite()  {
        this.$socket.socketIo.on("cancelInvite", () => {
          console.log("接受到邀请")
          this.invitedVisible = false;
        })
      },

      // 取消邀请
      cancelInvite() {
        let inviteData = this.$socket.inviteData;
        if (inviteData) {
          this.inviteWaitVisible = false
          this.$socket.cancelInvite(inviteData)
        }
      },

      // 存储 this.$socket
      storageSocket() {
       // sessionStorage.scoket = JSON.stringify(this.$socket);
      },

      // 邀请他人 - inviter方
      inviteUser(accepter) {
        let inviteData = {
          inviter: this.userName,
          accepter: accepter
        }
        this.inviteWaitVisible = true;
        this.$socket.inviteData = inviteData;
        // 邀请
        this.$socket.inviteUser(inviteData);
      },

      // 监听获取邀请结果事件
      listenInviteRel() {
        //////////////////////////////////////////////////////////// 这个回调函数被多次执行
        //////////////////////////////////////////////////////////// 这个回调函数被多次执行
        //////////////////////////////////////////////////////////// 这个回调函数被多次执行
        this.$socket.socketIo.on("listenInviteRel", (inviteData) => {
          console.log("接受到邀请者应答")
          this.inviteWaitVisible = false;
          this.inviteSucVisible = true;

          if (inviteData.isAccept) {// 对方已经接受邀请，点击进入
            this.inviteSucContent = "对方加入房间，点击进入";
            this.$socket.inviteData = inviteData;
          }else {// 对方已经拒绝邀请，点击退出
            this.$socket.inviteData = null;
            this.inviteSucContent = "对方已经拒绝邀请，点击退出"
          }
        })
      },

      // 监听是否被邀请 - accepter方
      listenInvite() {
        this.$socket.socketIo.on("listenInvite", (inviteData) => {
          console.log("接受到有人邀请")
          this.invitedVisible = true;
          this.$socket.inviteData = inviteData;
        })
      },

      // 返回是否接受邀请
      backInvite(isAccpet) {
        let socket = this.$socket
          ,inviteData = socket.inviteData;

        // 先已经接受了邀请
        if (inviteData) {
          this.invitedVisible = false;
          inviteData.isAccept = isAccpet;
          // 返回应答结果
          socket.backInvite(inviteData);
          inviteData.isComeIn = true;
          // 拒绝了将被邀请的数据更新
          if (!isAccpet) {
            inviteData = null;
          }else {
            this.storageSocket()
            this.$router.push("/chess");
          }
        }
      },

      // 监听服务器端用户列表改变事件
      listenUserArrChange() {
        this.$socket.socketIo.on("userListChange", (userArr) => {
          console.log("接受到用户组改变应答")
          this.userArr = userArr;
        })
      },

      // 进入棋局
      comeInChess() {
        let inviteData = this.$socket.inviteData;
        this.inviteSucVisible = false;
        if (inviteData && inviteData.isAccept) {
          inviteData.isComeIn = true;
          this.storageSocket();
          this.$router.push("/chess");
        }
      },
    },
    mounted () {
      let socket = this.$socket;

      // 用户加入
      socket.userJoin().catch(() => {
        this.$router.push('/hello')
      });

      // 设置 userName
      this.userName = socket.userName;

      // 便于观察
      document.title = "welcome " + this.userName + "！";
      // 获取所有用户
      socket.getUserArr().then((userArr) => {
        this.userArr = userArr
      })

      // 监听服务端用户列表是否改变
      this.listenUserArrChange()


      // 监听是否被邀请
      this.listenInvite();

      //监听应答
      this.listenInviteRel();

      // 监听是否被取消
      this.listenCancelInvite();
    },
  }
</script>

<style scoped lang="less">
.main {
    margin: 0 auto;
    width: 80%;
    color: white;

    input {
        border: none;
        background-color: transparent;
        outline: none;
    }
    .header {
        height: 70px;
        line-height: 70px;
        text-align: center;
        &>* {
            display: inline-block;
        }
        h3 {
            font: 36px/70px "微软雅黑 Light";
            margin-right: 30px;
        }
    }
    .body {
        color: blue;
        border-top: 2px solid #a0acbd;
        display: flex;
        justify-content: left;

        .user-item {
            width: 200px;
            height: 100px;
            background-color: #fff;
            margin: 10px;
            border-radius: 5px;

            .ban-invite,.banInvite {
                cursor: not-allowed;
            }
            .can-invite {
                cursor: pointer;
            }
        }
    }
}
</style>