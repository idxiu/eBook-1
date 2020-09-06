<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item, index) of data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem, subIndex) of item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from '../../utils/utils'

export default {
  name: 'EbookLoading',
  data () {
    return {
      data: [
        [{}, {}, {}],
        [{}, {}, {}]
      ],
      maskWidth: [
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 }
      ],
      lineWidth: [
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 }
      ],
      add: true
    }
  },
  mounted () {
    this.task = setInterval(() => {
      this.$refs.mask.forEach((item, index) => {
        const mask = item
        const line = this.$refs.line[index]
        const maskWidth = this.maskWidth[index]
        const lineWidth = this.lineWidth[index]
        if (index === 0) {
          if (this.add && lineWidth.value < 16) {
            maskWidth.value--
            lineWidth.value++
          } else if (!this.add && lineWidth.value > 0) {
            maskWidth.value++
            lineWidth.value--
          }
        } else {
          const preLineWidth = this.lineWidth[index - 1]
          if (this.add && preLineWidth.value >= 8 && lineWidth.value < 16) {
            maskWidth.value--
            lineWidth.value++
          } else if (!this.add && preLineWidth.value <= 8 && lineWidth.value > 0) {
            maskWidth.value++
            lineWidth.value--
          }
        }
        mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`
        mask.style.width = `${px2rem(maskWidth.value)}rem`
        line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`
        line.style.width = `${px2rem(lineWidth.value)}rem`
        if (index === this.maskWidth.length - 1) {
          if ((this.add && lineWidth.value === 16) || (!this.add && lineWidth.value === 0)) {
            this.add = !this.add
          }
        }
      })
    }, 20)
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";

  .ebook-loading {
    position: relative;
    z-index: 400;
    height: px2rem(40);
    width: px2rem(63);
    background: transparent;
    border: px2rem(1.5) solid #d7d7d7;
    border-radius: px2rem(3);

    .ebook-loading-wrapper {
      display: flex;
      width: 100%;
      height: 100%;

      .ebook-loading-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: px2rem(7) 0;
        box-sizing: border-box;

        .ebook-loading-line-wrapper {
          flex: 1;
          @include center;

          .ebook-loading-line {
            flex: 0 0 px2rem(0);
            width: px2rem(0);
            height: px2rem(2);
            background: #d7d7d7;
          }

          .ebook-loading-mask {
            flex: 0 0 px2rem(16);
            width: px2rem(16);
            height: px2rem(2);
          }
        }
      }

      .ebook-loading-center {
        position: absolute;
        left: 50%;
        top: 0;
        height: 100%;
        width: px2rem(2);
        background: #d7d7d7;
      }
    }
  }
</style>
