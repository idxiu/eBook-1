<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveEnd"
         @mousemove.left="onMouseMove"
         @mousedown.left="onMouseEnter"
         @mouseup.left="onMouseEnd"
    ></div>
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
import { getLocalForage } from '../../utils/localForage'
global.epub = Epub
export default {
  name: 'EbookReader',
  mixins: [ebookMixin],
  methods: {
    // 1. 鼠标进入
    // 2. 鼠标进入后的移动
    // 3. 鼠标按下后松开
    // 4. 鼠标松开后的移动
    onMouseMove (e) {
      if (this.bookAvailable && !this.menuVisible) {
        if (this.mouseState) {
          if (this.mouseState === 1) {
            this.mouseState = 2
          } else if (this.mouseState === 2) {
            let offsetY = 0
            if (this.firstOffsetY) {
              offsetY = e.clientY - this.firstOffsetY
              this.setOffsetY(offsetY)
            } else {
              this.firstOffsetY = e.clientY
            }
          }
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnter (e) {
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd (e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 100) {
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMaskClick (e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return
      }
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX < width && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    },
    move (e) {
      if (!this.menuVisible && this.bookAvailable) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.changedTouches[0].clientY
        }
        e.preventDefault()
        e.stopPropagation()
      }
    },
    moveEnd () {
      this.firstOffsetY = null
      this.setOffsetY(0)
    },
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
        height: window.innerHeight,
        method: 'default'
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
    initEpub (url) {
      // 解析电子书
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGesture()
      this.parseBook()
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (16 / getFontSize(this.fileName))).then(locations => {
          this.navigation.forEach(nav => {
            nav.pageList = []
          })
          locations.forEach(item => {
            const loc = item.match(/\[(.*)\]!/)[1]
            this.navigation.forEach(nav => {
              if (nav.href) {
                const href = nav.href.match(/^(.*)\.html/)[1]
                if (href === loc) {
                  nav.pageList.push(item)
                }
              }
            })
          })
          let currentPage = 1
          this.navigation.forEach((nav, index) => {
            if (index === 0) {
              nav.page = 1
            } else {
              nav.page = currentPage
            }
            currentPage += nav.pageList.length + 1
          })
          this.setPagelist(locations)
          this.setBookAvailable(true)
          this.refreshLocation()
        })
      })
    }
  },
  mounted () {
    const books = this.$route.params.filename.split('|')
    const fileName = books[1]
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        // 解析输入的地址 转换
        this.setFileName(this.$route.params.filename.split('|').join('/')).then(() => {
          const url = process.env.VUE_APP_RES_URL + '/epub/' + this.fileName + '.epub'
          this.initEpub(url)
        })
      }
    })
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";
  .ebook-reader {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      height: 100%;
      width: 100%;
      z-index: 150;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>
