<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div
      class="shelf-footer-tab-wrapper"
      v-for="item of tabs"
      :key="item.index"
      @click="onTabClick(item)"
    >
      <div class="shelf-footer-tab" :class="{'is-selected': isSelected}">
        <div class="tab-icon icon-private" v-if="item.index === 1 && !isPrivate"></div>
        <div class="tab-icon icon-private-see" v-if="item.index === 1 && isPrivate"></div>
        <div class="tab-icon icon-download" v-if="item.index === 2 && isDownload"></div>
        <div class="tab-icon icon-download-remove" v-if="item.index === 2 && !isDownload"></div>
        <div class="tab-icon icon-move" v-if="item.index === 3"></div>
        <div class="tab-icon icon-shelf" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-shelf': item.index === 4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { removeLocalStorage, saveBookShelf } from '../../utils/localStorage'
  import { download } from '../../api/store'
  import { removeLocalForage } from '../../utils/localForage'

  export default {
    name: 'ShelfFooter',
    mixins: [storeShelfMixin],
    computed: {
      tabs () {
        return [
          {
            label: this.$t('shelf.private'),
            label2: this.$t('shelf.noPrivate'),
            index: 1
          },
          {
            label: this.$t('shelf.download'),
            label2: this.$t('shelf.delete'),
            index: 2
          },
          {
            label: this.$t('shelf.move'),
            index: 3
          },
          {
            label: this.$t('shelf.remove'),
            index: 4
          }
        ]
      },
      isSelected () {
        return this.shelfSelected && this.shelfSelected.length > 0
      },
      isPrivate () {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.private)
        }
      },
      isDownload () {
        if (!this.isSelected) {
          return false
        } else {
          return this.shelfSelected.every(item => item.cache)
        }
      }
    },
    data () {
      return {
        popupMenu: {}
      }
    },
    methods: {
      onComplete () {
        this.hidePopup()
        this.setIsEditMode(false)
        saveBookShelf(this.shelfList)
      },
      hidePopup () {
        this.popupMenu.hide()
      },
      setPrivate () {
        const isPrivate = !this.isPrivate
        this.shelfSelected.forEach(item => {
          item.private = isPrivate
        })
        this.onComplete()
        if (isPrivate) {
          this.simpleToast(this.$t('shelf.setPrivateSuccess'))
        } else {
          this.simpleToast(this.$t('shelf.closePrivateSuccess'))
        }
      },
      showPrivate () {
        this.popupMenu = this.popup({
          title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
          btn: [
            {
              text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
              click: () => {
                this.setPrivate()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        })
        this.popupMenu.show()
      },
      removeSelectedBook () {
        Promise.all(this.shelfSelected.map(book => {
          return this.removeBook(book)
        })).then(books => {
          books.map(book => {
            book.cache = false
          })
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
          this.setShelfSelected([])
        })
      },
      removeBook (book) {
        return new Promise((resolve, reject) => {
          removeLocalStorage(`${book.cotegoryText}/${book.fileName}-info`)
          removeLocalForage(`${book.fileName}`)
          resolve(book)
        })
      },
      async downloadSelectedBook () {
        for (let i = 0; i < this.shelfSelected.length; i++) {
          await this.downloadBook(this.shelfSelected[i]).then(book => {
            book.cache = true
          })
        }
      },
      downloadBook (book) {
        let text = ''
        const toast = this.toast({
          text: text
        })
        toast.continueShow()
        return new Promise((resolve, reject) => {
          download(book, () => {
            toast.remove()
            resolve(book)
          }, reject, progressEvent => {
            const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
            text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
            toast.updateText(text)
          })
        })
      },
      async setDownload () {
        this.onComplete()
        if (this.isDownload) {
          this.removeSelectedBook()
        } else {
          await this.downloadSelectedBook()
          saveBookShelf(this.shelfList)
          this.simpleToast(this.$t('shelf.setDownloadSuccess'))
        }
      },
      showDownload () {
        this.popupMenu = this.popup({
          title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
          btn: [
            {
              text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
              click: () => {
                this.setDownload()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        })
        this.popupMenu.show()
      },
      removeSelected () {
        this.shelfSelected.forEach(selected => {
          this.setShelfList(this.shelfList.filter(book => book !== selected))
        })
        this.setShelfSelected([])
        this.onComplete()
      },
      showRemove () {
        let title
        if (this.shelfSelected.length === 1) {
          title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
        } else {
          title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
        }
        this.popupMenu = this.popup({
          title: title,
          btn: [
            {
              text: this.$t('shelf.removeBook'),
              type: 'danger',
              click: () => {
                this.removeSelected()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopup()
              }
            }
          ]
        })
        this.popupMenu.show()
      },
      onTabClick (item) {
        if (!this.isSelected) {
          return
        }
        switch (item.index) {
          case 1:
            this.showPrivate()
            break
          case 2:
            this.showDownload()
            break
          case 3:
            this.dialog().show()
            break
          case 4:
            this.showRemove()
            break
          default:
            break
        }
      },
      label (item) {
        switch (item.index) {
          case 1:
            return this.isPrivate ? item.label2 : item.label
          case 2:
            return this.isDownload ? item.label2 : item.label
          default:
            return item.label
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";

  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    z-index: 120;
    background-color: #fff;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    display: flex;

    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;

      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        @include columnCenter;
        opacity: .5;

        &.is-selected {
          opacity: 1;
        }

        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }

        .tab-text {
          font-size: px2rem(12);
          color: #666;
          margin-top: px2rem(5);

          &.remove-shelf {
            color: $color-pink;
          }
        }

        .icon-shelf {
          color: $color-pink;
        }
      }
    }
  }
</style>
