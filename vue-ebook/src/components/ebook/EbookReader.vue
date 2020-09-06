<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin } from '../../utils/mixin'
import { flatten } from '../../utils/book'
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme, getLocation
} from '../../utils/localStorage'
global.epub = Epub
export default {
  name: 'EbookReader',
  mixins: [ebookMixin],
  methods: {
    nextPage () {
      this.rendition.next().then(() => {
        this.refreshLocation()
      })
      this.hideTitleAndMenu()
    },
    prevPage () {
      this.rendition.prev().then(() => {
        this.refreshLocation()
      })
      this.hideTitleAndMenu()
    },
    toggleTitleAndMenu () {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    initFontFamily () {
      const font = getFontFamily(this.fileName)
      if (font) {
        this.currentBook.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      } else {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      }
    },
    initFontSize () {
      const fontSize = getFontSize(this.fileName)
      if (fontSize) {
        this.currentBook.rendition.themes.fontSize(fontSize + 'px')
        this.setDefaultFontSize(fontSize)
      } else {
        saveFontSize(this.fileName, this.defaultFontSize)
      }
    },
    initTheme () {
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      let theme = getTheme(this.fileName)
      if (!theme) {
        theme = this.themeList[0].name
        saveTheme(this.fileName, theme)
      }
      this.setDefaultTheme(theme)
      this.rendition.themes.select(theme)
    },
    initRendition () {
      this.rendition = this.currentBook.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initTheme()
        this.initFontFamily()
        this.initFontSize()
        this.initGlobalStyle()
      })
      // 将那些css都注册到rendition上 缓存机制
      this.currentBook.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {})
      }, { passive: false })
    },
    initGesture () {
      // 绑定touchstart touchend事件 实现手势操作
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      }, { passive: false })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        if (offsetX > 40 && time < 500) {
          this.prevPage()
        } else if (offsetX < -40 && time < 500) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        // 组织事件默认行为 以及 事件传播
        event.stopPropagation()
      })
    },
    parseBook () {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        function find (item, level) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }
        navItem.forEach(item => {
          item.level = find(item, 0)
        })
        this.setNavigation(navItem)
      })
    },
    initEpub () {
      // 获取真实地址
      const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
      // 解析电子书
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGesture()
      this.parseBook()
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (16 / getFontSize(this.fileName))).then(() => {
          this.setBookAvailable(true)
          this.refreshLocation()
        })
      })
    }
  },
  mounted () {
    // 解析输入的地址 转换
    this.setFileName(this.$route.params.filename.split('|').join('/')).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";

</style>
