<template>
    <div class="chess-body">
        <div class="competitor1">{{competitor1}}(对方)</div>
        <div class="competitor2">{{competitor2}}(我)</div>
        <div id="chessWrap"><canvas id="canvas" ref="canvas">不支持Canvas</canvas></div>
    </div>
</template>

<script>
    import { chessboardInit, chess } from '../assets/js/chess'

    export default {
    name: 'try1',
    props: {},
    data () {
      return {
        competitor1: 'nzq',
        competitor2: 'wx'
      }
    },
    mounted () {
      let that = this;
      chessboardInit({
        elem: that.$refs.canvas,
        SWidth: 70,
        LWidth: 6,
      })
      chess();
    }
  }
</script>

<style scoped lang="less">
    .chess-body {
        width: fit-content;
        height: fit-content;
        padding: 10px 250px;
        margin: 0 auto;
        position: relative;

        .competitor1
        ,.competitor2{
            box-sizing: border-box;
            width: 250px;
            position: absolute;
            font: 30px "华文新魏";
        }
        .competitor1 {
            text-align: right;
            padding-right: 20px;
            top: 50px;
            left: 0;
        }
        .competitor2 {
            text-align: left;
            padding-left: 20px;
            bottom: 50px;
            right: 0;
        }
        #chessWrap {
            width: fit-content;
            canvas {
                background: url("../assets/img/chessBk.jpg") repeat ;
            }
        }
    }
</style>