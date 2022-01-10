<template>
  <div>
    <div class="title">
      <h1>云盘列表({{ count }})</h1>
    </div>
    <div class="songTable">
      <song-list :list="list"></song-list>
    </div>
  </div>
</template>

<script>
import songList from '@/components/songList/song-list.vue'
export default {
  data() {
    return {
      count: 0,
      list: []
    }
  },
  components: {
    songList
  },
  created() {
    this.cloud()
  },
  methods: {
    async cloud() {
      const { data: res } = await this.$http.cloud({})
      // console.log(res, '云盘数据')
      if (res.code !== 200) return this.$message.error('数据获取失败')
      this.count = res.count
      const list = res.data.map((item) => {
        return {
          ...item.simpleSong,
          pc: 1
        }
      })
      this.list = this.$format._format(list)
      console.log(this.list)
    }
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
.songTable {
  margin-top: 15px;
}
</style>
