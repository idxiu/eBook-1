<template>
  <div>
    <ebook-title></ebook-title>
    <ebook-menu></ebook-menu>
    <ebook-reader></ebook-reader>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookTitle from '../../components/ebook/EbookTitle'
import { ebookMixin } from '../../utils/mixin'
import { saveReadTime, getReadTime } from '../../utils/localStorage'

export default {
  components: {
    EbookReader,
    EbookMenu,
    EbookTitle
  },
  mixins: [ebookMixin],
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  },
  methods: {
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../assets/styles/global";

</style>
