<template>
  <div class="popup" v-if="popupVisible">
    <transition name="fade" v-show="visible">
      <div class="popup-bg" @click.stop.prevent="hide"></div>
    </transition>
    <transition name="popup-slide-up">
      <div class="popup-wrapper" v-show="visible">
        <div class="popup-title" v-if="title && title.length > 0" >{{ title }}</div>
        <div class="popup-btn"
             v-for="(item, index) of btn"
             :class="{'danger': item.type === 'danger'}"
             @click="item.click"
             :key="index"
        >{{ item.text }}</div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'Popup',
    props: {
      title: String,
      btn: Array
    },
    data () {
      return {
        popupVisible: false,
        visible: false
      }
    },
    methods: {
      show () {
        this.popupVisible = true
        setTimeout(() => {
          this.visible = true
        })
      },
      hide () {
        this.visible = false
        setTimeout(() => {
          this.popupVisible = false
        }, 200)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .4);
    z-index: 2000;
    .popup-bg {
      height: 100%;
      width: 100%;
    }
    .popup-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      z-index: 2000;
      .popup-title {
        width: 100%;
        height: px2rem(44);
        border-bottom: px2rem(1) solid #eee;
        color: #999;
        font-size: px2rem(12);
        box-sizing: border-box;
        @include center;
      }
      .popup-btn {
        width: 100%;
        height: px2rem(60);
        font-size: px2rem(16);
        font-weight: 700;
        color: #666;
        border-bottom: px2rem(1) solid #eee;
        @include center;
        &.danger {
          color: $color-pink;
        }
      }
    }
  }
</style>
