<template>
    <div class="hello">
        <div class="join-wrap">
            <input type="text" autocomplete="off" placeholder="请输入任意用户名已进入" name="userName" maxlength="20" v-model="userName">
            <button @click="login">进入</button>
        </div>
        <tip :hideTip="hideTip" :tipInfo="tipInfo"></tip>
    </div>
</template>

<script>
  import tip from './tip'

  export default {
    name: 'hello',
    props: {},
    data () {
      return {
        userName: "",
        hideTip: true, // 是否加入成功
        tipInfo: '',
      }
    },
    methods: {
      login(){
        if (this.userName) {
          this.$socket.userName = this.userName;
          this.$socket.userJoin().then((bool) => {
            if (!bool) {
              this.hideTip = bool;
              this.tipInfo = "当前用户名已存在";
            } else {
              this.$router.push("./hall");
            }
          });
        } else {
          this.hideTip = false;
          this.tipInfo = "未输入用户";
        }
      }
    },
    mounted () {
     // this.$socket.userJoin()
    },
    components: {
      tip: tip
    }
  }
</script>

<style scoped lang="less">
    .hello {
        background-color:  #304059;
        height: 100%;

        .join-wrap {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            input,button {
                border: none;
                background-color: transparent;
                outline: none;
                height: 50px;
                width: 400px;
                text-align: center;
            }

            input {
                border-bottom: 2px solid #a0acbd;
                color: white;

                &:focus::placeholder {
                    color: transparent;
                }
                &::placeholder {
                    color: #a0acbd;
                    font-size: 14px;
                }
            }

            button {
                background-color: #3ad9f7;
                color: white;
                border-radius: 5px;
                margin-top: 35px;
                height: 40px;
                font-size: 16px;

                &:hover {
                    background-color: #37ceeb;
                    cursor: pointer;
                }
            }
        }
    }
</style>
