<template>
  <div>
    <div class="search-bar" :class="{hideTitle: !titleVisible, 'hide-shadow': !shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <div class="title-text title">{{ $t('home.title') }}</div>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <div class="icon-shake icon"></div>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper"
           :class="{'hide-title': !titleVisible}"
           @click="back"
      >
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text"
                 class="input"
                 :placeholder="$t('home.hint')"
                 v-model="searchText"
                 @click="showHotSearch"
                 @keyup.13.exact="search"
          >
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import HotSearchList from './HotSearchList'

export default {
  name: 'SearchBar',
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data () {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    offsetY (offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY (hotSearchOffsetY) {
      if (hotSearchOffsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    search () {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showFlapCard () {
      this.setFlapCardVisible(true)
    },
    back () {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      if (!this.hotSearchVisible) {
        this.$router.push({
          path: '/store/shelf'
        })
      } else {
        this.hideHotSearch()
      }
    },
    hideHotSearch () {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    showHotSearch () {
      this.hotSearchVisible = true
      this.hideTitle()
      this.hideShadow()
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    hideTitle () {
      this.titleVisible = false
    },
    showTitle () {
      this.titleVisible = true
    },
    hideShadow () {
      this.shadowVisible = false
    },
    showShadow () {
      this.shadowVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";
  .search-bar {
    width: 100%;
    position: relative;
    height: px2rem(94);
    z-index: 150;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hideTitle {
      height: px2rem(52);
    }
    &.hide-shadow {
      box-shadow: none;
    }
    .search-bar-title-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      height: px2rem(42);
      width: 100%;
      .title-text-wrapper {
        width: 100%;
        height: px2rem(42);
        @include center;
      }
      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(15);
        top: 0;
        height: px2rem(42);
        @include center;
      }
    }
    .title-icon-back-wrapper {
      z-index: 200;
      position: absolute;
      height: px2rem(42);
      left: px2rem(15);
      transition: height $animationTime $animationType;
      @include center;
      &.hide-title {
        height: px2rem(52);
      }
    }
    .search-bar-input-wrapper {
      position: absolute;
      left: 0;
      top: px2rem(42);
      width: 100%;
      height: px2rem(52);
      padding: px2rem(10);
      box-sizing: border-box;
      transition: top $animationTime $animationType;
      display: flex;
      &.hide-title {
        top: 0;
      }
      .search-bar-blank {
        flex: 0 0 px2rem(0);
        width: px2rem(0);
        transition: all $animationTime $animationType;
        &.hide-title {
          flex: 0 0 px2rem(31);
          width: px2rem(31);
        }
      }
      .search-bar-input {
        flex: 1;
        width: 100%;
        background-color: #f4f4f4;
        border-radius: px2rem(20);
        padding: px2rem(5) px2rem(15);
        box-sizing: border-box;
        border: px2rem(1) solid #eee;
        @include left;
        .icon-search {
          color: #999;
        }
        .input {
          width: 100%;
          height: px2rem(22);
          background-color: transparent;
          border: none;
          font-size: px2rem(12);
          margin-left: px2rem(10);
          color: #666;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            color: #ccc;
          }
        }
      }
    }
  }
</style>
