<template>
  <div class="cd-continer" ref="main" :class="{ 'grid-template-columns3': NewCdCount === 3, 'grid-template-columns4': NewCdCount === 4, 'grid-template-columns5': NewCdCount === 5 }">
    <NewCd v-for="(item, index) in list" :key="item.id + '' + index" :NewCdList="item"></NewCd>
  </div>
</template>

<script>
import NewCd from '@/components/NewCdList/NewCd.vue'
export default {
  data() {
    return {
      NewCdCount: 0
    }
  },
  mounted() {
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
  },
  methods: {
    sizeChenge() {
      // this.top = document.body.scrollTop + document.documentElement.scrollTop
      // this.show(this.top)
      // this.bodyWidth = document.body.clientWidth
      this.divBox = this.$refs.main.offsetWidth
      console.log(this.$refs.main.offsetWidth)
      // console.log(this.bodyWidth)
      this.showCd()
    },
    showCd() {
      if (this.divBox >= 1577) {
        this.NewCdCount = 5
      } else if (this.divBox >= 1041) {
        this.NewCdCount = 4
      } else {
        this.NewCdCount = 3
      }
    }
  },
  props: ['list'],
  components: {
    NewCd
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    // document.onscroll = null
    // console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.cd-continer {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
}
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
.grid-template-columns3 {
  grid-template-columns: repeat(3, 1fr);
}
</style>
