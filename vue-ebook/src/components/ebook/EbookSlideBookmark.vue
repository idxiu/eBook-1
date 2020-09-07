<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">{{ $t('book.bookmark')}} · {{ bookmark ? bookmark.length : 0 }}</div>
    <scroll class="slide-bookmark-list" :top="48" :width="48">
      <div class="slide-bookmark-item"
           v-for="(item, index) of bookmark"
           @click="displayBookmark(item.cfi)"
           :key="index">
        <div class="slide-bookmark-icon">
          <div class="icon-bookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{ item.text }}</div>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../common/Scroll'
import { ebookMixin } from '../../utils/mixin'
import { getBookmark } from '../../utils/localStorage'
export default {
  name: 'EbookSlideBookmark',
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data () {
    return {
      bookmark: null
    }
  },
  mounted () {
    this.bookmark = getBookmark(this.fileName)
  },
  methods: {
    displayBookmark (cfi) {
      this.display(cfi, () => {
        this.hideTitleAndMenu()
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";
  .ebook-slide-bookmark {
    width: 100%;
    .slide-bookmark-title {
      width: 100%;
      height: px2rem(48);
      font-size: px2rem(14);
      font-weight: 700;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include left;
    }
    .slide-bookmark-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-bookmark-item {
        display: flex;
        padding: px2rem(15) 0;
        box-sizing: border-box;
        .slide-bookmark-icon {
          flex: 0 0 px2rem(29);
          @include left;
          .icon-bookmark {
            font-size: px2rem(12);
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background-color: #bbb;
            @include center;
          }
        }
        .slide-bookmark-item-text {
          font-size: px2rem(14);
          @include ellipsis2(3);
          line-height: px2rem(16);
          max-height: px2rem(48);
        }
      }
    }
  }
</style>
