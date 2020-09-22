<template>
  <div class="shelf-search-wrapper" :class="{'search-top': isInputClicked, 'hide-shadow': ifHideShadow}">
    <div class="shelf-search" :class="{'search-top': isInputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input type="text"
                 class="search-input"
                 :placeholder="$t('shelf.search')"
                 @click="onSearchClick"
                 v-model="searchText"
          >
        </div>
        <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="clearSearchText">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div class="icon-locale-wrapper" v-if="!isInputClicked" @click="switchLocale">
        <span class="icon-cn icon" v-if="lang === 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-text">{{ $t('shelf.cancel') }}</span>
      </div>
    </div>
    <transition name="shelf-tab-slide-up">
      <div class="shelf-search-tab-wrapper" v-show="isInputClicked">
        <div class="shelf-search-tab-item"
             v-for="item of tabs"
             :key="item.id"
             @click="onTabClick(item.id)"
        >
          <span class="shelf-search-tab-text" :class="{'is-selected': selectedTab === item.id}">{{ item.text }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { setLocalStorage } from '../../utils/localStorage'
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: 'ShelfSearch',
    mixins: [storeShelfMixin],
    computed: {
      lang () {
        return this.$i18n.locale
      },
      tabs () {
        return [
          {
            id: 1,
            text: this.$t('shelf.default')
          },
          {
            id: 2,
            text: this.$t('shelf.progress')
          },
          {
            id: 3,
            text: this.$t('shelf.purchase')
          }
        ]
      }
    },
    watch: {
      offsetY (offsetY) {
        if (offsetY > 0) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    methods: {
      onTabClick (id) {
        this.selectedTab = id
      },
      clearSearchText () {
        this.searchText = ''
      },
      switchLocale () {
        if (this.$i18n.locale === 'cn') {
          this.$i18n.locale = 'en'
        } else {
          this.$i18n.locale = 'cn'
        }
        setLocalStorage('locale', this.$i18n.locale)
      },
      onSearchClick () {
        this.isInputClicked = true
        this.setShelfTitleVisible(false)
      },
      onCancelClick () {
        this.isInputClicked = false
        this.setShelfTitleVisible(true)
      }
    },
    data () {
      return {
        isInputClicked: false,
        searchText: '',
        selectedTab: 1,
        ifHideShadow: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";
  .shelf-search-wrapper {
    position: relative;
    width: 100%;
    height: px2rem(94);
    font-size: px2rem(16);
    z-index: 105;
    background-color: #fff;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }
    &.search-top {
      position: fixed;
      left: 0;
      top: 0;
    }
    .shelf-search {
      position: absolute;
      width: 100%;
      top: px2rem(42);
      left: 0;
      height: px2rem(52);
      display: flex;
      transition: top $animationTime linear;
      &.search-top {
        top: 0;
      }
      .search-wrapper {
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right;
          .icon-search {
            font-size: px2rem(12);
          }
        }
        .search-input-wrapper {
          flex: 1;
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include center;
          .search-input {
            width: 100%;
            border: none;
            font-size: px2rem(14);
            color: #333;
            &:focus {
              outline: none;
            }
            &::-webkit-input-placeholder {
              color: #ccc;
              font-size: px2rem(14);
            }
          }
        }
        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;
          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-locale-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .icon-cn, .icon-en {
          font-size: px2rem(22);
          color: #666;
        }
      }
      .cancel-btn-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .cancel-text {
          color: $color-blue;
          font-size: px2rem(14);
        }
      }
    }
    .shelf-search-tab-wrapper {
      position: absolute;
      width: 100%;
      top: px2rem(52);
      left: 0;
      height: px2rem(42);
      display: flex;
      .shelf-search-tab-item {
        flex: 1;
        @include center;
        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
