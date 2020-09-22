<template>
  <div class="shelf-item-category">
    <div class="shelf-item-list" v-if="data.itemList.length > 0">
      <div class="shelf-item-category-item" v-for="(item, index) of data.itemList" :key="index">
        <img class="shelf-item-category-item-img" :src="item.cover" alt="">
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ShelfItemCategory',
    props: {
      data: Object
    }
  }
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
  .shelf-item-category {
    height: 100%;
    width: 100%;
    overflow: hidden;
    .shelf-item-list {
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      padding-top: px2rem(5);
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      .shelf-item-category-item {
        box-sizing: border-box;
        flex: 0 0 33.33%;
        width: 33.33%;
        height: 33.33%;
        &:nth-child(3n+1) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
        }
        &:nth-child(3n+2) {
          padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
        }
        &:nth-child(3n) {
          padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
        }
        .shelf-item-category-item-img {
          height: 100%;
          width: 100%;
        }
      }
    }
    .shelf-item-category-bg {
      width: 100%;
      height: 100%;
      @include center;
      .icon-book2 {
        font-size: px2rem(30);
        color: #ccc;
      }
    }
  }
</style>
