<template>
  <div class="shelf-item" :class="{'shelf-item-shadow': data.type!==3}" @click="onItemClick(data.type)">
    <component :is="item" :data="data" class="shelf-item-comp" :class="{'is-edit': data.type === 2 && isEditMode}"></component>
    <div class="icon-selected" v-show="isEditMode && data.type === 1" :class="{'is-selected': data.selected}"></div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItemAdd from './ShelfItemAdd'
  import ShelfItemCategory from './ShelfItemCategory'
  import ShelfItemBook from './ShelfItemBook'
  import { gotoStoreHome } from '../../utils/store'

  export default {
    props: {
      data: Object
    },
    mixins: [storeShelfMixin],
    computed: {
      item () {
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      }
    },
    data () {
      return {
        book: ShelfItemBook,
        category: ShelfItemCategory,
        add: ShelfItemAdd
      }
    },
    methods: {
      onItemClick (type) {
        if (this.isEditMode) {
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            this.shelfSelected.pushWithoutDuplicate(this.data)
          } else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          if (type === 1) {
            this.showBookDetail(this.data)
          } else if (type === 2) {
            this.$router.push({
              path: '/store/category',
              query: {
                title: this.data.title
              }
            })
          } else {
            gotoStoreHome(this)
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
  .shelf-item {
    height: 100%;
    width: 100%;
    position: relative;
    .shelf-item-comp {
      opacity: 1;
      &.is-edit {
        opacity: .5;
      }
    }
    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
    }
    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, .4);
      &.is-selected {
        color: $color-blue;
      }
    }
  }
</style>
