<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}">
      <div class="flap-card" v-for="(item, index) of flapCardList" :key="index" :style="{zIndex: item.zIndex}">
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item, 'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item, 'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point"
             v-for="item of pointList"
             :key="item"
             :class="{'animation': runPointAnimation}"
        ></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <div class="icon-close"></div>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import { flapCardList, categoryText } from '../../utils/store'
export default {
  name: 'FlapCard',
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data () {
    return {
      flapCardList,
      front: 0,
      back: 1,
      runFlapCardAnimation: false,
      runPointAnimation: false,
      runBookCardAnimation: false
    }
  },
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation()
      }
    }
  },
  methods: {
    runAnimation () {
      this.runFlapCardAnimation = true
      this.timeout = setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300)
      this.timeout2 = setTimeout(() => {
        this.stopFlapCardAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    close () {
      this.stopFlapCardAnimation()
      this.setFlapCardVisible(false)
    },
    semiCircleStyle (item, dir) {
      return {
        backgroundColor: `rgba(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    startFlapCardAnimation () {
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, 25)
    },
    rotate (index, type) {
      // 第index个圆 前面还是后面的
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      // 旋转到自己对应样式的样子
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgba(${item.r}, ${item._g}, ${item.b})`
    },
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    flapCardRotate () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      if (backFlapCard.rotateDegree <= 90) {
        backFlapCard._g += 5
      }
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    next () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item._g = item.g
        item.rotateDegree = 0
        item.zIndex = 100 - index
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runFlapCardAnimation = false
      this.runBookCardAnimation = false
      this.runPointAnimation = false
    },
    stopFlapCardAnimation () {
      this.reset()
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (this.timeout2) {
        clearTimeout(this.timeout2)
      }
    },
    startPointAnimation () {
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    categoryText () {
      if (this.data && this.data.category) {
        return categoryText(this.data.category, this)
      } else {
        return ''
      }
    }
  },
  created () {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
@import "../../assets/styles/flapCard";
  .flap-card-wrapper {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .6);
    z-index: 1000;
    @include center;
    @include absCenter;
    .flap-card-bg {
      position: absolute;
      height: px2rem(64);
      width: px2rem(64);
      border-radius: px2rem(5);
      background-color: #fff;
      transform: scale(0);
      opacity: 0;
      &.animation {
        animation: flap-card-move .3s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        75% {
          transform: scale(0.9);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card {
        height: px2rem(48);
        width: px2rem(48);
        @include absCenter;
        .flap-card-circle {
          height: 100%;
          width: 100%;
          display: flex;
          .flap-card-semi-circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            backface-visibility: hidden;
          }
          .flap-card-semi-circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24);
            background-position: center right;
            transform-origin: right;
          }
          .flap-card-semi-circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        z-index: 1100;
        @include absCenter;
        .point {
          border-radius: 50%;
          @include absCenter;
          &.animation {
            @for $i from 1 to length($moves) {
              &:nth-child(#{$i}) {
                @include move($i)
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .content-title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .content-author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .content-category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      width: 100%;
      @include center;
      .icon-close {
        height: px2rem(45);
        width: px2rem(45);
        font-size: px2rem(25);
        background-color: #333;
        border-radius: 50%;
        color: #fff;
        @include center;
      }
    }
  }
</style>
