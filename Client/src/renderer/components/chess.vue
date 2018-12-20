<template>
    <div class="chess-body">
        <div class="main">
            <div class="competitor1">{{competitor1}}(黑方)</div>
            <div class="competitor2">{{competitor2}}(红方)</div>
            <div class="chess" ref="chess">
                <div id="chessWrap" ref="chessWrap"><canvas id="canvas" ref="canvas">不支持Canvas</canvas></div>
            </div>
        </div>
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
        competitor2: 'wx'
      }
    },
    mounted () {
      chess({
        vue: this,
        side: "black",
        SWidth: 70,
        LWidth: 4,
      });
    }
  }
</script>

<style lang="less">
    .chess-body {
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