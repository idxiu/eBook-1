<template>
  <div class="ebook-footer">
    <div class="ebook-footer-text">{{ this.paginate }}</div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'

export default {
  name: 'EbookFooter',
  mixins: [ebookMixin]
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
  .ebook-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(48);
    @include right;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .ebook-footer-text {
      font-size: px2rem(12);
    }
  }
</style>
