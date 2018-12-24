<template>
    <div class="tip" v-show="!hideTip">{{tipInfo}}</div>
</template>

<script>
  export default {
    name: 'tip',
    props: {
      hideTip: {
        type: Boolean,
        default: true,
      },
      tipInfo: {
        type: String
      }
    },
    data() {
      return {}
    },
    mounted() {
    }
  }
</script>

<style scoped>
    .tip {
        position: fixed;
        top: 50px;
        right: 50px;
        color: #d3fafd;
        font: 18px/30px "华文新魏";
        background-color: #ec4a3e;
        padding: 0 10px;
        border-radius: 2px;
    }
</style>