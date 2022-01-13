<template>
  <div class="albumSunlist-continer">
    <div class="title">
      <h1>我收藏的专辑({{ count }})</h1>
    </div>
    <div class="main" ref="main" :class="{ 'grid-template-columns3': NewCdCount === 3, 'grid-template-columns4': NewCdCount === 4, 'grid-template-columns5': NewCdCount === 5 }">
      <NewCd v-for="(item, index) in list" :key="item.id + index" :NewCdList="item"></NewCd>
    </div>
    <div class="msg" ref="msg">{{ msg }}</div>
  </div>
</template>

<script>
import NewCd from '@/components/NewCdList/NewCd.vue'
export default {
  components: {
    NewCd
  },
  data() {
    return {
      limit: 25,
      offset: 0,
      count: 0,
      NewCdCount: 0,
      list: [],
      msg: '下拉加载',
      load: false,
      top: 0
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
    window.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
  },
  methods: {
    sizeChenge() {
      // this.bodyWidth = document.body.clientWidth
      this.divBox = this.$refs.main.offsetWidth
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
    },
    async getList(cb) {
      const { data: res } = await this.$http.getAlbumSublist({ limit: this.limit, offset: this.offset })
      if (res.code !== 200) return this.$messgae.error('获取数据失败')
      this.count = res.count
      this.list = [...this.list, ...res.data]
      this.load = true
      if (cb) cb()
      console.log(res.data)
      console.log(res, '专辑')
    },
    // 计算子元素距离浏览器最上边距离
    getAbsTop(_) {
      let Top = _.offsetTop
      while (_.offsetParent != null) {
        _ = _.offsetParent
        Top += _.offsetTop
      }
      return Top
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
      this.getList(() => {
        this.load = true
        this.msg = '加载更多'
      })
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
    window.removeEventListener('resize', this.sizeChenge)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.albumSunlist-continer {
  padding-bottom: 15px;
}
.title {
  h1 {
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;
  }
}
.main {
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  margin-top: 15px;
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
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
}
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
.grid-template-columns3 {
  grid-template-columns: repeat(3, 1fr);
}
</style>
