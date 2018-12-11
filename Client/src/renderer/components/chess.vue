<template>
    <div id="chessWrap">
        <canvas id="canvas" ref="canvas">不支持Canvas</canvas>
    </div>
</template>

<script>
    import { chessboardInit } from '@/assets/js/chess'

    export default {
    name: 'try1',
    props: {},
    data () {
      return {}
    },
    mounted () {
      let that = this;
      chessboardInit({
        elem: that.$refs.canvas,
        SWidth: 70,
        LWidth: 4,
      })
    }
  }
</script>

<style scoped lang="less">
    #chessWrap {
        margin: 0 auto;
        width: fit-content;

        canvas {
        }
    }
</style>