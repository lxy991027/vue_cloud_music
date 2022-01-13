<template>
  <div>
    <div class="TopBox">
      <RanKing v-for="(item, index) in TopList" :key="item.id + index" v-show="index < count" :TopListslice="item"></RanKing>
    </div>
  </div>
</template>

<script>
import RanKing from '@/components/Ranking/ranking.vue'
export default {
  props: ['count'],
  data() {
    return {
      // 排行榜
      TopList: []
    }
  },
  created() {
    this.getTopList()
  },
  methods: {
    // 获取排行榜列表
    async getTopList() {
      const { data: res } = await this.$http.toplist()

      if (res.code !== 200) return this.$message.error('排行榜列表获取失败')
      this.TopList = res.list.splice(0, 6)

      this.TopList.forEach(this.getTopListValue)
      console.log(this.TopList, '排行榜列表')
    },
    // 获取排行榜内容
    async getTopListValue(item) {
      const { data: res } = await this.$http.listDetail({ id: item.id })
      if (res.code !== 200) return this.$message.error('排行榜列表获取失败')
      // 将获取到的内容添加到原数组
      item.value = res.playlist.tracks.splice(0, 10)
      // console.log(res)
      this.$set(item, 'value ', res.playlist.tracks.splice(0, 10))
    }
  },
  components: {
    RanKing
  }
}
</script>

<style lang="less" scoped>
.TopBox {
  display: flex;
  // grid-template-columns: repeat(5, 1fr);
  // align-items: center;
  justify-content: space-between;
}
</style>
