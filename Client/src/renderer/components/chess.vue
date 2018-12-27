<template>
    <div class="chess-body">
        <h1>{{room.name}}</h1>
        <div class="main">
            <div class="competitor1" v-if="">{{room.otherSide.userName}} <i v-show="room.turnSide=='otherSide'"  class="el-icon-circle-check"></i></div>
            <div class="competitor2">{{room.ownSide.userName}} <i v-show="room.turnSide=='ownSide'" class="el-icon-circle-check"></i></div>
            <div class="chess" ref="chess">
                <div id="chessWrap" ref="chessWrap"><canvas id="canvas" ref="canvas">不支持Canvas</canvas></div>
            </div>
        </div>
        <!-- 加入房间的提示口 -->
        <!--:before-close="handleClose"-->
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
        this.$socket.listenJoinRoom((userName) => {
          console.log(userName);
          this.$notify({
            title: '用户加入提示',
            message: this.$createElement('i', { style: 'color: teal'}, `${userName !== this.room.ownSide.userName ? userName : "你"}已加入房间`)
          });
        })

      },
      // 监听分配两个用户“属于方”分配
      listenMakeBelong() {
        let room = this.room;
        this.$socket.listenMakeBelong((obj) => {
          room.ownSide.belong = obj[room.ownSide.userName];
          room.otherSide.belong = obj[room.otherSide.userName];
          room.turnSide = room.ownSide.belong === "red" ? "ownSide" : "otherSide"
          this.$notify({
            title: '用户加入提示',
            message: this.$createElement('i', { style: 'color: teal'}, `系统随机分配${room.ownSide.userName}为${room.ownSide.belong == "red" ? "红色" : "黑色"}方，${room.otherSide.userName}为${room.otherSide.belong == "red" ? "红色" : "黑色"}方`)
          });
        })
      }
    },
    mounted () {
      let socket = this.$socket
        ,room = this.room;
      room.name = socket.inviteData.inviter + "vs" + socket.inviteData.accepter;
      room.ownSide.userName = socket.userName;
      if (socket.userName === socket.inviteData.inviter) {
        room.otherSide.userName = socket.inviteData.accepter
      }else {
        room.otherSide.userName = socket.inviteData.inviter
      }

      document.title = `${room.name}（${room.ownSide.userName}）`; // 便于观察
      this.listenMakeBelong();
      this.listenJoinRoom();
      this.userJoin(room);
      chess({
        vue: this,
        side: room.ownSide.belong,
        SWidth: 50,
        LWidth: 4,
      });
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
            width: 1100px;

            // 竞争者开始
            .competitor1
            ,.competitor2{
                box-sizing: border-box;
                width: 200px;
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
                padding: 40px;
                width: fit-content;
                margin: 0 auto;
                background: url(~@/assets/img/chessBk.jpg) repeat ;
                border-radius: 6px;
                box-shadow: 1px 1px 0 1px #760d0d;
                #chessWrap {
                    width: fit-content;
                    position: relative;

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
    }
</style>