<template>
  <div class="playlist-continer" ref="main" :class="{ 'grid-template-columns6': PlayCdCount === 6, 'grid-template-columns5': PlayCdCount === 5 }">
    <PlayCd v-for="(item, index) in list" :key="item.id ? item.id + index : index" :playCdList="item"></PlayCd>
  </div>
</template>

<script>
import PlayCd from '@/components/PlayCd/playcd.vue'
export default {
  data() {
    return {
      PlayCdCount: 0
    }
  },
  mounted() {
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
  },
  methods: {
    // 窗口变动事件
    sizeChenge() {
      // this.top = document.body.scrollTop + document.documentElement.scrollTop
      // this.show(this.top)
      // this.bodyWidth = document.body.clientWidth
      this.divBox = this.$refs.main.offsetWidth

      // console.log(this.bodyWidth)
      this.showCd()
    },
    showCd() {
      if (this.divBox >= 1577) {
        this.PlayCdCount = 8
        this.hotsingerlistCount = 11
      } else if (this.divBox >= 1041) {
        this.PlayCdCount = 6
      } else {
        this.PlayCdCount = 5
      }
    }
  },
  props: ['list'],
  components: {
    PlayCd
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    // document.onscroll = null
    // console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.playlist-continer {
  margin-top: 15px;
  display: grid;
  // justify-content: space-around;
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 3%;
}
.grid-template-columns6 {
  grid-template-columns: repeat(6, 1fr);
}
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
}
</style>
