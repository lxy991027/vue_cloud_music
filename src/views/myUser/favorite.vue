<template>
  <div>
    <div class="title">
      <h1>我收藏的歌手({{ total }})</h1>
    </div>
    <ul class="mainBox">
      <li v-for="(item, index) in list" :key="item.id + index">
        <hotsingerlist :list="item"></hotsingerlist>
      </li>
    </ul>
  </div>
</template>

<script>
import hotsingerlist from '@/components/HotSingList/hotsinger.vue'
export default {
  data() {
    return {
      list: [],
      total: 0
    }
  },
  created() {
    this.getArtist()
  },
  methods: {
    async getArtist() {
      const { data: res } = await this.$http.subArtist()
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }
      this.list = res.data
      this.total = this.list.length
      // this.isLoading = false
    }
  },
  components: {
    hotsingerlist
  }
}
</script>

<style lang="less" scoped>
.title {
  h1 {
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;
  }
}
.mainBox {
  margin-top: 15px;
  // background-color: pink;
  display: flex;
  flex-wrap: wrap;
  li {
    padding: 0 5px;
  }
}
</style>
