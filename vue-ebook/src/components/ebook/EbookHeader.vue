<template>
  <div class="ebook-header">
    <div class="ebook-header-text">{{ getSectionName }}</div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'

export default {
  name: 'EbookHeader',
  mixins: [ebookMixin]
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
  .ebook-header {
    position: absolute;
    top: 0;
    left: 0;
    height: px2rem(48);
    width: 100%;
    z-index: 100;
    @include left;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    overflow: hidden;
    .ebook-header-text {
      font-size: px2rem(12);
      line-height: px2rem(14);
      color: #6d7178;
    }
  }
</style>
