<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="0" @onScroll="onScroll"
      :bottom="scrollBottom"
      ref="scroll"
    >
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import Scroll from '../../components/common/Scroll'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
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
      ShelfSearch,
      ShelfFooter
    },
    data () {
      return {
        scrollBottom: 0
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
      this.getShelfList()
      this.setCurrentType(1)
      this.setShelfCategory([])
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
  }
</style>
