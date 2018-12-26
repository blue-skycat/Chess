<template>
    <div class="main">
        <div class="header">
            <h3>象棋</h3>
            <p>你好！{{userName}}</p>
        </div>
        <div class="body">
            <div v-for="item of userArr" v-if="item[0] !== userName" class="user-item">
                <p class="userName">{{item[0]}}</p>
                <template v-if="item[1].canInvite === 1">
                    <p>等待中...&nbsp;&nbsp;&nbsp;&nbsp;可邀请</p>
                    <el-button
                            type = "primary"
                            class="can-invite"
                            :userId=item[1].userId
                            @click="invite(item[0])"
                            v-if="canClick"
                    >邀请</el-button>
                    <el-button type="primary" v-else class="ban-invite">邀请</el-button>
                </template>
                <template v-else>
                    <p>游戏中...&nbsp;&nbsp;&nbsp;&nbsp;不可邀请</p>
                    <el-button type="primary" class="ban-invite">不可邀请</el-button>
                </template>
            </div>
        </div>
        <el-dialog
                :visible.sync="invitedDialogVisible"
                width="30%"
                center>
            <span>{{invitedData.from}}邀请你加入游戏</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false">加入</el-button>
                <el-button type="primary" @click="centerDialogVisible = false">拒绝</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
            <span>{{invitedSureContent}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
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
        inviteData: null, // 邀请他人的传输对象{from, to}
        invitedData: null, // 被邀请时的接受对象{from, to, bool}
        transData: null, // 开启棋局传入的对象 move: {x: 0, y: 0,},form: "", to: "",}
        canClick: true, // 点击邀请后不允许在点击
        centerDialogVisible: false,
        invitedSureContent: "",
        invitedDialogVisible: false,
      }
    },
    methods: {
      // 邀请他人 - form方
      invite(to) {
        console.log(this.userName +" invite " + to);
        this.inviteData = {
          from: this.userName,
          to: to
        }
        this.canClick = false;
        // 邀请
        this.$socket.inviteUser(this.inviteData)

      },
      // 监听对方对请求的应答
      getInvited() {
        // 获取邀请结果
        this.$socket.getInvite(this.userName, (bool) => {
          this.canClick = true;
          this.centerDialogVisible = true;
          if (bool) { // 邀请成功
            // 对方已经拒绝邀请，点击退出
            this.invitedSureContent = "对方已经接受邀请，点击进入"
          }else {
            // 对方已经接受邀请，点击进入
            this.invitedSureContent = "对方已经拒绝邀请，点击退出"
          }
        })
      },
      // 被邀请 - to方
      invited() {
        // 监听是否被邀请
        this.$socket.invited(this.userName, (invitedData) => {
          let inviData = this.invitedData;
          inviData = invitedData;
          if (confirm('是否接受邀请？')) {
            console.log("confirm")
            inviData.bool = true
          }else {
            inviData.bool = false
          }
          // 返回应答结果
          this.$socket.backInvite(inviData)
        })
      }
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
      document.title = this.userName;
      // 获取所有用户
      socket.getUserArr().then((userArr) => {
        this.userArr = userArr
      })

      // 监听服务端用户列表是否改变
      socket.listenUserArrChange((userArr) => {
        this.userArr = userArr;
      })

      // 监听是否被邀请
      this.invited();
      //监听应答
      this.getInvited();
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