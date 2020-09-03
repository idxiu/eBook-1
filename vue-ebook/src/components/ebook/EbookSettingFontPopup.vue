<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon">
          <span class="icon-down2" @click="hide"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div
          class="ebook-popup-list-item"
          v-for="(item, index) of fontFamilyList"
          :key="index"
          :class="{'selected': isSelected(item)}"
          @click="setFontFamily(item.font)"
        >
          <div class="ebook-popup-list-text">{{ item.font }}</div>
          <div class="ebook-popup-list-check">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { FONT_FAMILY } from '../../utils/book'
import { saveFontFamily } from '../../utils/localStorage'
export default {
  name: 'EbookSettingFontPopup',
  mixins: [ebookMixin],
  data () {
    return {
      fontFamilyList: FONT_FAMILY
    }
  },
  methods: {
    hide () {
      this.setFontFamilyVisible(false)
    },
    isSelected (item) {
      return this.defaultFontFamily === item.font
    },
    setFontFamily (font) {
      this.setDefaultFontFamily(font)
      if (font === 'Default') {
        this.currentBook.rendition.themes.font('Times New Roman')
      } else {
        this.currentBook.rendition.themes.font(font)
      }
      saveFontFamily(this.fileName, font)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 300;
  background-color: #fff;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.1);
  .ebook-popup-title {
    position: relative;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: px2rem(1) solid #b8b9bb;
    text-align: center;
    @include center;
    .ebook-popup-title-icon {
      font-size: px2rem(16);
      font-weight: 700;
      position: absolute;
      top: 0;
      left: px2rem(15);
      height: 100%;
      @include center;
    }
    .ebook-popup-title-text {
      font-size: px2rem(16);
      font-weight: 700;
    }
  }
  .ebook-popup-list-wrapper {
    .ebook-popup-list-item {
      display: flex;
      padding: px2rem(15);
      font-size: px2rem(14);
      .ebook-popup-list-text {
        flex: 1;
        text-align: left;
      }
      &.selected {
        color: #346cb9;
        font-weight: 700;
      }
      .ebook-popup-list-check {
        flex: 1;
        text-align: right;
        font-weight: 700;
      }
    }
  }
}
</style>
