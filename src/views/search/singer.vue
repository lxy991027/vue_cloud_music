<template>
  <ul class="singer-continer" ref="main">
    <li v-for="(item, index) in list" :key="item.id + '' + index" ref="item">
      <hotsingerlist :list="item"></hotsingerlist>
    </li>
    <li class="symbolic" v-for="(item, index) in symbolic" :key="index"></li>
  </ul>
</template>

<script>
import hotsingerlist from '@/components/HotSingList/hotsinger.vue'
export default {
  props: ['list'],
  components: {
    hotsingerlist
  },
  data() {
    return {
      symbolic: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.sizeChenge()
    })
    window.addEventListener('resize', this.sizeChenge)
    // this.sizeChenge()
  },
  methods: {
    sizeChenge() {
      // this.top = document.body.scrollTop + document.documentElement.scrollTop
      // this.show(this.top)
      // this.bodyWidth = document.body.clientWidth
      const row = parseInt(this.$refs.main.offsetWidth / (this.$refs.item[0].offsetWidth + 30))
      const countSymbolic = row - (this.list.length % row)
      console.log(countSymbolic)
      this.symbolic = []
      for (let i = 0; i < countSymbolic; i++) {
        this.symbolic.push({})
      }
      console.log(this.symbolic)
      // console.log(this.bodyWidth)
      // this.showCd()
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    // document.onscroll = null
    // console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.singer-continer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    margin: 0 15px 5px 15px;
  }
  .symbolic {
    width: 120px;
    margin: 0 15px;
  }
}
</style>
