<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{ title }}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{ selectedText }}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" @click="clearCache" v-if="showClear">
        <span class="shelf-title-btn-text">{{ $t('shelf.clearCache') }}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" @click="onEditClick" v-if="showEdit">
        <span class="shelf-title-btn-text">{{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit') }}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" @click="back" v-if="showBack">
        <span class="icon-back"></span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}"
        @click="changeGroup"
        v-show="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{ $t('shelf.editGroup') }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import { clearLocalStorage, saveBookShelf } from '../../utils/localStorage'
  import { clearLocalForage } from '../../utils/localForage'

  export default {
    name: 'ShelfTitle',
    mixins: [storeShelfMixin],
    data () {
      return {
        ifHideShadow: true
      }
    },
    props: {
      title: {
        type: String
      }
    },
    watch: {
      offsetY (offsetY) {
        if (offsetY > 0 && this.isInputClicked) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    computed: {
      emptyCategory () {
        return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
      },
      showEdit () {
        return this.currentType === 1 || !this.emptyCategory
      },
      changeGroupLeft () {
        return !this.emptyCategory
      },
      changeGroupRight () {
        return this.emptyCategory
      },
      showChangeGroup () {
        return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
      },
      showClear () {
        return this.currentType === 1
      },
      showBack () {
        return this.currentType === 2 && !this.isEditMode
      },
      selectedText () {
        const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
        return selectedNumber === 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', '1') : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
      },
      popupCancelBtn () {
        return this.createPopupBtn(this.$t('shelf.cancel'), () => {
          this.hidePopup()
        })
      }
    },
    methods: {
      changeGroupName () {
        this.hidePopup()
        this.dialog({
          showNewGroup: true,
          groupName: this.shelfCategory.title
        }).show()
      },
      hidePopup () {
        this.popupMenu.hide()
      },
      onComplete () {
        this.hidePopup()
        this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id))
        .then(() => {
          saveBookShelf(this.shelfList)
          this.$router.go(-1)
          this.setIsEditMode(false)
        })
      },
      createPopupBtn (text, onClick, type = 'normal') {
        return {
          text: text,
          type: type,
          click: onClick
        }
      },
      deleteGroup () {
        if (!this.emptyCategory) {
          this.setShelfSelected(this.shelfCategory.itemList)
          this.moveOutOfGroup(this.onComplete)
        } else {
          this.onComplete()
        }
      },
      showDeleteGroup () {
        this.hidePopup()
        setTimeout(() => {
          this.popupMenu = this.popup({
            title: this.$t('shelf.deleteGroupTitle'),
            btn: [
              this.createPopupBtn(this.$t('shelf.confirm'), () => {
                this.deleteGroup()
              }, 'danger'),
              this.popupCancelBtn
            ]
          })
          this.popupMenu.show()
        }, 200)
      },
      changeGroup () {
        this.popupMenu = this.popup({
          btn: [
            this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
              this.changeGroupName()
            }),
            this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
              this.showDeleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        }).show()
      },
      back () {
        this.$router.go(-1)
        this.setIsEditMode(false)
      },
      onEditClick () {
        if (!this.isEditMode) {
          this.setShelfSelected([])
          this.shelfList.forEach(book => {
            book.selected = false
            if (book.itemList) {
              book.itemList.forEach(item => {
                item.selected = false
              })
            }
          })
        }
        this.setIsEditMode(!this.isEditMode)
      },
      clearCache () {
        clearLocalStorage()
        clearLocalForage()
        this.setShelfList([])
        this.setShelfSelected([])
        this.getShelfList()
        this.simpleToast(this.$t('shelf.clearCacheSuccess'))
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";

  .shelf-title {
    position: relative;
    width: 100%;
    height: px2rem(42);
    z-index: 130;
    background-color: #fff;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

    &.hide-shadow {
      box-shadow: none;
    }

    .shelf-title-text-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;

      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        color: #333;
        font-weight: 700;
      }

      .shelf-title-sub-text {
        font-size: px2rem(12);
        color: #333;
      }
    }

    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      height: 100%;
      box-sizing: border-box;
      @include center;

      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }

      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }

      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }

      .icon-back {
        font-size: px2rem(20);
        color: #666;
      }
    }
  }
</style>
