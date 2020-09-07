<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          type="text"
          v-model="searchText"
          @keyup.enter.exact="search()"
          class="slide-contents-search-input"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage()"
        >
      </div>
      <div
        class="slide-contents-search-cancel"
        v-show="searchVisible"
        @click="hideSearchPage()"
      >{{ $t('book.cancel') }}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
          <img :src="cover" class="slide-contents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{this.metadata ? metadata.title : ''}}</span>
        </div>
        <div class="slide-contents-book-author">{{this.metadata ? metadata.creator : ''}}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
          <div class="slide-contents-read-time">{{getReadTimeText()}}</div>
        </div>
      </div>
    </div>
    <scroll class="slide-contents-list"
            :top="156"
            :bottom="48"
            v-show="!searchVisible"
            ref="scroll">
      <div class="slide-contents-item"
           v-for="(item, index) of navigation"
           :key="index"
           :style="contentItemStyle(item)"
           @click="displayContent(item.href)"
      >
        <span class="slide-contents-item-label" :class="{'selected': section === index}">{{ item.label }}</span>
        <span class="slide-contents-item-page">{{ item.page }}</span>
      </div>
    </scroll>
    <scroll class="slide-search-list"
            :top="66"
            :bottom="48"
            v-show="bookAvailable">
      <div class="slide-search-item"
           v-for="(item, index) of searchList"
           :key="index"
           v-html="item.excerpt"
           @click="displayContent(item.cfi, true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../common/Scroll'
import { px2rem } from '../../utils/utils'

export default {
  name: 'EbookSlideContents',
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data () {
    return {
      searchVisible: false,
      searchText: '',
      searchList: null
    }
  },
  methods: {
    showSearchPage () {
      this.searchVisible = true
    },
    doSearch (q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(item => item.load(this.currentBook.load.bind(this.currentBook))
          .then(item.find.bind(item, q)).finally(item.unload.bind(item)))
      ).then(results => Promise.resolve([].concat.apply([], results)))
    },
    hideSearchPage () {
      this.searchVisible = false
      this.searchText = ''
      this.searchList = null
    },
    contentItemStyle (item) {
      return {
        'margin-left': `${px2rem(item.level * 15)}rem`
      }
    },
    displayContent (target, highlight = false) {
      this.display(target, () => {
        this.hideTitleAndMenu()
      })
      if (highlight) {
        this.currentBook.rendition.annotations.highlight(target)
      }
    },
    search () {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(results => {
          this.searchList = results
        }).then(() => {
          if (this.searchList.length > 0) {
            this.searchList.map(item => {
              item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
              return item
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
  .ebook-slide-contents {
    width: 100%;
    font-size: 0;
    .slide-contents-search-wrapper {
      width: 100%;
      height: px2rem(36);
      display: flex;
      margin: px2rem(20) 0 px2rem(10) 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-search-input-wrapper {
        flex: 1;
        @include center;
        .slide-contents-search-icon {
          font-size: px2rem(12);
          flex: 0 0 px2rem(28);
          @include center;
        }
        .slide-contents-search-input {
          flex: 1;
          width: 100%;
          height: px2rem(32);
          font-size: px2rem(14);
          background: transparent;
          border: none;
          outline: none;
        }
      }
      .slide-contents-search-cancel {
        flex: 0 0 px2rem(50);
        font-size: px2rem(14);
        @include right;
      }
    }
    .slide-contents-book-wrapper {
      display: flex;
      height: px2rem(90);
      width: 100%;
      padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
      box-sizing: border-box;
      .slide-contents-book-img-wrapper {
        flex: 0 0 px2rem(45);
        .slide-contents-book-img {
          width: px2rem(45);
          height: px2rem(60);
        }
      }
      .slide-contents-book-info-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        .slide-contents-book-title {
          font-size: px2rem(14);
          line-height: px2rem(16);
          /*width: px2rem(153.75);*/
          @include left;
          .slide-contents-book-title-text {
            @include ellipsis2(2);
          }
          // 375*0.85-15*2-10*2-45-70=153.75
        }
        .slide-contents-book-author {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          line-height: px2rem(14);
          /*width: px2rem(153.75);*/
          @include left;
          .slide-contents-book-author-text {
            @include ellipsis2(1);
          }
        }
      }
      .slide-contents-book-progress-wrapper {
        flex: 0 0 px2rem(70);
        @include center;
        .slide-contents-book-progress {
          .progress {
            font-size: px2rem(14);
          }
          .progress-text {
            font-size: px2rem(12);
          }
        }
        .slide-contents-read-time {
          margin-top: px2rem(5);
          font-size: px2rem(12);
        }
      }
    }
    .slide-contents-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-contents-item {
        padding: px2rem(20) 0;
        box-sizing: border-box;
        display: flex;
        .slide-contents-item-label {
          flex: 1;
          font-size: px2rem(14);
          line-height: px2rem(16);
          @include ellipsis;
        }
        .slide-contents-item-page {
          flex: 0 0 px2rem(30);
          @include right;
          line-height: px2rem(16);
          font-size: px2rem(12);
        }
      }
    }
    .slide-search-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      width: 100%;
      .slide-search-item {
        padding: px2rem(20) 0;
        box-sizing: border-box;
        font-size: px2rem(14);
        line-height: px2rem(16);
      }
    }
  }
</style>
