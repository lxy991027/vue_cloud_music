<template>
  <div class="mv-continer" ref="main" :class="{ 'grid-template-columns5': MvListCount === 5, 'grid-template-columns4': MvListCount === 4 }">
    <MvList v-for="(item, index) in list" :key="item.id ? item.id + index : index" :list="item"></MvList>
  </div>
</template>

<script>
import MvList from '@/components/Mv-List/mv-list.vue'
export default {
  props: ['list'],
  mounted() {
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
  },
  data() {
    return {
      MvListCount: 0
    }
  },
  methods: {
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
        this.MvListCount = 6
      } else if (this.divBox >= 1041) {
        this.MvListCount = 5
      } else {
        this.MvListCount = 4
      }
    }
  },
  components: {
    MvList
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    // document.onscroll = null
    // console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.mv-continer {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
}
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
}
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
</style>
