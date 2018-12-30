<template>
    <div class="chess-body">
        <div class="main">
            <div class="competitor1">{{room.otherSide.userName}} <i v-show="room.turnSide=='otherSide'"  class="el-icon-circle-check"></i></div>
            <div class="competitor2">{{room.ownSide.userName}} <i v-show="room.turnSide=='ownSide'" class="el-icon-circle-check"></i></div>
            <div class="chess" ref="chess">
                <div id="chessWrap" ref="chessWrap"><canvas id="canvas" ref="canvas">不支持Canvas</canvas></div>
            </div>
        </div>
        <div class="util">
            <el-button type="warning" :class="{'canClick': utilBtnCanClick}" @click="outGameVisible = true">退出</el-button>
            <el-button type="warning" :class="{'canClick': utilBtnCanClick}" @click="defeatVisible = true">认输</el-button>
        </div>
        <!-- 加入房间的提示口 -->
        <!--:before-close="handleClose"-->
        <el-dialog
                :visible.sync="outGameVisible"
                width="30%"
                center>
            <span>是否确认退出</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="defeatVisible = false">取消</el-button>
                <el-button type="primary" @click="outGame('你已经认输， 3s后进入游戏大厅')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                :visible.sync="defeatVisible"
                width="30%"
                center>
            <span>是否确认认输</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="defeatVisible = false">取消</el-button>
                <el-button type="primary" @click="defeat">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import chess from '../assets/js/chess'

  export default {
    name: 'try1',
    props: {},
    data () {
      return {
        competitor1: 'nzq',
        competitor2: 'wx',
        joinRoomTipVisible: true,
        isOtherJoin: "",//另一方加入
        utilBtnCanClick: false,
        defeatVisible: false,
        outGameVisible: false,
        room: {
          name: "",
          turnSide: "ownSide", // 该走棋的一方
          ownSide: {
            userName: "",
            belong: "",
          },
          otherSide: {
            userName: "",
            belong: ""
          }
        }
      }
    },
    methods: {
      // 触发用户加入事件
      userJoin(room) {
        this.$socket.joinRoom(room)
      },

      // 监听用户加入
      listenJoinRoom() {
        this.$socket.socketIo.on("listenJoinRoom", (userName) => {
          this.$notify({
            title: '用户加入提示',
            message: this.$createElement('i', { style: 'color: teal'}, `${userName !== this.room.ownSide.userName ? userName : "你"}已加入房间`)
          });
        })
      },

      // 系统随机选取当前用户属于哪一方（红/黑）
      listenMakeBelong() {
        return new Promise((resolve, reject) => {
          let room = this.room;
          this.$socket.socketIo.on("makeBelong", (obj) => {
            room.ownSide.belong = obj[room.ownSide.userName];
            room.otherSide.belong = obj[room.otherSide.userName];
            room.turnSide = room.ownSide.belong === "red" ? "ownSide" : "otherSide";
            this.$notify({
              title: '用户加入提示',
              message: this.$createElement('i', { style: 'color: teal'}, `系统随机分配${room.ownSide.userName}（你）为${room.ownSide.belong == "red" ? "红色" : "黑色"}方，${room.otherSide.userName}为${room.otherSide.belong == "red" ? "红色" : "黑色"}方，红色方先走棋子`)
            });
            resolve(room.ownSide.belong)
          })
        })
      },

      // 退出游戏
      outGame(message) {
        this.outGameVisible = false;
        this.$socket.outGame(this.room.otherSide.userName);
        this.$notify({
          title: '用户提示',
          message: this.$createElement('i', { style: 'color: teal'}, message)
        });
        setTimeout(() => {
          this.$router.push("/hall");
        }, 3000)
      },
      lisTenOutGame() {
        this.$socket.socketIo.on("outGame", () => {
          this.$notify({
            title: '用户认输提示',
            message: this.$createElement('i', { style: 'color: teal'}, "对方已经认输， 3s后进入游戏大厅")
          });
          setTimeout(() => {
            this.$router.push("/hall");
          }, 3000)
        })
      }
      ,
      // 认输
      defeat() {
        this.defeatVisible = false;
        this.outGame("你已经认输， 3s后进入游戏大厅");
        setTimeout(() => {
          this.$router.push("/hall");
        }, 3000)
      }
    },
    mounted () {
      let socket = this.$socket
        ,room = this.room;
      // 初始化room数据
      room.name = socket.inviteData.inviter + "vs" + socket.inviteData.accepter;
      room.ownSide.userName = socket.userName;
      if (socket.userName === socket.inviteData.inviter) {
        room.otherSide.userName = socket.inviteData.accepter
      }else {
        room.otherSide.userName = socket.inviteData.inviter
      }
      // 修改标题
      document.title = `${room.name}（${room.ownSide.userName}）`; // 便于观察
      this.userJoin(room);
      this.listenJoinRoom();
      this.lisTenOutGame();
      chess({
        vue: this,
        SWidth: 50,
        LWidth: 4,
      })
    }
  }
</script>

<style lang="less">
    .chess-body {
        color: white;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .main {
            margin: 50px auto;
            position: relative;
            width: fit-content;
            padding: 0 120px;

            // 竞争者开始
            .competitor1
            ,.competitor2{
                position: absolute;
                font: 30px "华文新魏";
            }
            .competitor1 {
                text-align: right;
                top: 50px;
                left: 0;
            }
            .competitor2 {
                text-align: left;
                bottom: 50px;
                right: 0;
            }
            // 竞争者结束

            .chess {
                overflow: hidden;
                width: fit-content;
                margin: 0 auto;
                background: url(~@/assets/img/chessBk.jpg) repeat ;
                border-radius: 6px;
                box-shadow: 1px 1px 0 1px #760d0d;
                #chessWrap {
                    width: fit-content;
                    position: relative;
                    margin: 40px;

                    div {
                        position: absolute;
                        border-radius: 50%;
                        background-size: cover;
                    }
                    div.red:hover
                    ,div.black:hover{
                        transform: scale(1.1);
                    }
                    div.ban:hover
                    ,div.ban:hover{
                        cursor: not-allowed;
                    }
                }
            }
        }
        .util{
            .canClick {
                cursor: not-allowed;
            }
        }
    }
</style>