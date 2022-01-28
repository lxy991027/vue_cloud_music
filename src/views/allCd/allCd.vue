<template>
  <div class="cd-continer">
    <!-- :class="{ 'grid-template-columns4 ': NewCdCount === 16, 'grid-template-columns3 ': NewCdCount === 9 }" -->
    <div class="cdBox" :class="{ 'grid-template-columns4 ': NewCdCount === 4, 'grid-template-columns3 ': NewCdCount === 3 }">
      <NewCd v-for="item in hotAlbums" :key="item.id" :NewCdList="item"></NewCd>
    </div>
    <div class="msg" ref="msg" @click="an">{{ msg }}</div>
  </div>
</template>

<script>
import NewCd from '@/components/NewCdList/NewCd.vue'
export default {
  data() {
    return {
      TopSize: 0,
      hotAlbums: [],
      limit: 24,
      offset: 0,
      total: 0,
      msg: '下拉加载',
      top: 0,
      load: false,
      page: 1,
      bodyWidth: 0,
      NewCdCount: 0
    }
  },
  created() {
    this.offset = 0
    this.init()
  },
  mounted() {
    this.offset = 0
    // window.onscroll = () => {
    //   this.top = document.body.scrollTop + document.documentElement.scrollTop
    // }
    this.$bus.$on('scrollTop', (v) => {
      console.log('触发了')
      this.top = v
    })
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
  },
  components: {
    NewCd
  },
  methods: {
    init() {
      this.getArtistAlbum()
    },
    sizeChenge() {
      this.bodyWidth = document.body.clientWidth

      this.showCd()
    },
    async getArtistAlbum(cb) {
      // this.isLoading = true
      console.log(this.offset, '请求')
      const { data: res } = await this.$http.artistAlbum({ id: this.$route.query.id, limit: this.limit, offset: this.offset })
      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      this.total = res.artist.albumSize
      console.log(this.total)
      // this.hotAlbums = res.hotAlbums
      this.hotAlbums = [...this.hotAlbums, ...res.hotAlbums]
      console.log(this.hotAlbums, '7684354354')
      // this.isLoading = false
      this.load = true
      if (cb) cb()
    },
    currentChange(page) {
      this.offset = (page - 1) * this.limit
      console.log(this.offset)
      // this.getComment()
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
    an() {
      console.log(this.getAbsTop(this.$refs.msg))
    },
    cb() {
      this.page++
      this.currentChange(this.page)
      this.msg = '加载中...'
      // this.offset++
      // setTimeout(() => {
      //   console.log('被调用了')
      //   this.load = true
      //   this.msg = '加载更多'
      // }, 2000)

      if (this.hotAlbums.length >= this.total) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      console.log(this.hotAlbums.length)
      console.log(this.hotAlbums.length >= this.total)
      this.getArtistAlbum(() => {
        this.load = true
        this.msg = '加载更多'
      })
    },
    showCd() {
      // 实现数组深拷贝
      // const playMusicLists = HotMusicList
      // this.playMusicListSplice = playMusicLists
      // console.log(this.playMusicListSplice, '123456', playMusicLists)
      if (this.bodyWidth >= 1970) {
        this.NewCdCount = 5
      } else if (this.bodyWidth >= 1300) {
        this.NewCdCount = 4
      } else {
        this.NewCdCount = 3
      }
    }
  },
  watch: {
    $route: {
      handler() {
        this.offset = 0
        this.hotAlbums = []
        this.init()
      },
      deep: true
    },
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
    // window.onscroll = null
    this.$bus.$off('scrollTop')
    window.removeEventListener('resize', this.sizeChenge)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.cdBox {
  // height: 2000px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 1%;
  grid-row-gap: 15px;
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
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
.grid-template-columns3 {
  grid-template-columns: repeat(3, 1fr);
}
</style>
