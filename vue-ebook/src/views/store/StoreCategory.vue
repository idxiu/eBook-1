<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title" :isShowBack="true"></shelf-title>
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="0" @onScroll="onScroll"
      :bottom="scrollBottom"
      ref="scroll"
      v-if="ifShowList"
    >
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>
      {{ $t('shelf.groupNone') }}
    </div>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import Scroll from '../../components/common/Scroll'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: 'StoreShelf',
    mixins: [storeShelfMixin],
    components: {
      ShelfList,
      ShelfTitle,
      Scroll,
      ShelfFooter
    },
    data () {
      return {
        scrollBottom: 0
      }
    },
    computed: {
      ifShowList () {
        return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      }
    },
    watch: {
      isEditMode (isEditMode) {
        this.scrollBottom = this.isEditMode ? 48 : 0
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    methods: {
      onScroll (offsetY) {
        this.setOffsetY(offsetY)
      }
    },
    mounted () {
      this.setCurrentType(2)
      this.getCategoryList(this.$route.query.title)
    }
  }
</script>

<style scoped lang="scss">
@import '../../assets/styles/global';
  .store-shelf {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 100;
    background-color: #fff;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
      width: 100%;
      height: 100%;
    }
    .store-shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      color: #333;
      @include center;
    }
  }
</style>
