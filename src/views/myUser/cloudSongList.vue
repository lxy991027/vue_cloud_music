<template>
  <div class="cloudSongList-continer">
    <div class="title">
      <h1>我的音乐云盘({{ count }})</h1>
    </div>
    <div class="songTable">
      <song-list :list="list"></song-list>
    </div>
    <div class="msg" ref="msg">{{ msg }}</div>
  </div>
</template>

<script>
import songList from '@/components/songList/song-list.vue'
export default {
  data() {
    return {
      count: 0,
      list: [],
      limit: 200,
      offset: 0,
      msg: '下拉加载',
      load: false,
      top: 0
    }
  },
  mounted() {
    window.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
  },
  components: {
    songList
  },
  created() {
    this.cloud()
  },
  methods: {
    async cloud(cb) {
      const { data: res } = await this.$http.cloud({ limit: this.limit, offset: this.offset })
      // console.log(res, '云盘数据')
      if (res.code !== 200) return this.$message.error('数据获取失败')
      this.count = res.count
      const list = res.data.map((item) => {
        return {
          ...item.simpleSong,
          pc: 1
        }
      })
      this.list = [...this.list, ...this.$format._format(list)]
      this.load = true
      if (cb) cb()
      console.log(this.list)
    },
    cb() {
      // this.page++
      // this.currentChange(this.page)
      this.offset += this.limit
      this.msg = '加载中...'
      // this.offset++
      // setTimeout(() => {
      //   console.log('被调用了')
      //   this.load = true
      //   this.msg = '加载更多'
      // }, 2000)

      if (this.list.length >= this.count) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      // console.log(this.hotAlbums.length)
      // console.log(this.hotAlbums.length >= this.total)
      this.cloud(() => {
        this.load = true
        this.msg = '加载更多'
      })
    },
    // 计算子元素距离浏览器最上边距离
    getAbsTop(_) {
      let Top = _.offsetTop
      while (_.offsetParent != null) {
        _ = _.offsetParent
        Top += _.offsetTop
      }
      return Top
    }
  },
  watch: {
    top(newVal, oldVal) {
      if (!this.load) return
      if (this.getAbsTop(this.$refs.msg) - newVal < document.documentElement.clientHeight) {
        this.load = false
        this.cb()
        console.log('触发了')
      }
    }
  },
  beforeDestroy() {
    window.onscroll = null
    // window.removeEventListener('resize', this.sizeChenge)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.cloudSongList-continer {
  padding-bottom: 15px;
}
.title {
  h1 {
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;
  }
}
.msg {
  width: 100%;
  height: 20px;
  text-align: center;
  background-color: #d9d9d9;
  margin-top: 15px;
  // margin-bottom: 15px;
  border-radius: 10px;
}
.songTable {
  margin-top: 15px;
}
</style>
