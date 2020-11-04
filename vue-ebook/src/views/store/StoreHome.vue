<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage: `url(${banner})`}"></div>
      </div>
      <guess-you-like :data="guessYouLike" class="guess-you-like"></guess-you-like>
      <recommend :data="recommend" class="recommend"></recommend>
      <featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')" class="featured"></featured>
      <div class="category-list-wrapper" v-for="(item, index) of categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category :data="categories" class="categories"></category>
    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import Scroll from '../../components/common/Scroll'
import FlapCard from '../../components/home/FlapCard'
import { storeHomeMixin } from '../../utils/mixin'
import { home } from '../../api/store'
import GuessYouLike from '../../components/home/GuessYouLike'
import Recommend from '../../components/home/Recommend'
import Featured from '../../components/home/Featured'
import CategoryBook from '../../components/home/CategoryBook'
import Category from '../../components/home/Category'

export default {
  name: 'StoreHome',
  mixins: [storeHomeMixin],
  components: {
    Category,
    CategoryBook,
    Featured,
    Recommend,
    GuessYouLike,
    SearchBar,
    Scroll,
    FlapCard
  },
  data () {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    }
  },
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh()
    }
  },
  mounted () {
    home().then(response => {
      if (response && response.status === 200) {
        const data = response.data
        const radomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[radomIndex]
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categories = data.categories
      }
    })
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/global";
  .store-home {
    height: 100%;
    width: 100%;
    .banner-wrapper {
      width: 100%;
      height: px2rem(150);
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-img {
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .guess-you-like {
      margin-top: px2rem(20);
    }
    .recommend {
      margin-top: px2rem(20);
    }
    .featured {
      margin-top: px2rem(20);
    }
    .category-list-wrapper {
      margin-top: px2rem(20);
    }
    .categories {
      margin-top: px2rem(20);
    }
  }
</style>
