<template>
  <div class="MV-continer">
    <div class="box" :class="{ 'grid-template-columns5': MvListCount === 5, 'grid-template-columns4': MvListCount === 4 }">
      <MvList v-for="item in hotMvs" :key="item.id" :list="item"></MvList>
    </div>
    <div class="msg" ref="msg">{{ msg }}</div>
  </div>
</template>

<script>
import MvList from '@/components/Mv-List/mv-list.vue'
export default {
  created() {
    this.getArtistMv()
  },
  mounted() {
    // window.onscroll = () => {
    //   this.top = document.body.scrollTop + document.documentElement.scrollTop
    //   // console.log(this.top)
    // }
    this.$bus.$on('scrollTop', (v) => {
      console.log('触发了')
      this.top = v
    })
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
  },
  components: {
    MvList
  },
  data() {
    return {
      hotMvs: [],
      hotMvsa: [],
      offset: 0,
      TopSize: 0,
      hotAlbums: [],
      limit: 20,

      total: 0,
      msg: '下拉加载',
      top: 0,
      load: false,
      page: 1,
      hasMoreMvs: true,
      MvListCount: 0,
      bodyWidth: 0
    }
  },
  methods: {
    sizeChenge() {
      this.bodyWidth = document.body.clientWidth

      this.showCd()
    },
    showCd() {
      // 实现数组深拷贝
      // const playMusicLists = HotMusicList
      // this.playMusicListSplice = playMusicLists
      // console.log(this.playMusicListSplice, '123456', playMusicLists)
      if (this.bodyWidth >= 1970) {
        this.MvListCount = 6
      } else if (this.bodyWidth >= 1300) {
        this.MvListCount = 5
      } else {
        this.MvListCount = 4
      }
    },
    async getArtistMv(cb) {
      // console.log(this.isLoadMv)
      // if (!this.hasMoreMvs || !this.isLoadMv) return
      // this.isLoading = true
      // this.isLoadMv = false
      const { data: res } = await this.$http.artistMv({ id: this.$route.query.id, limit: this.limit, offset: this.offset })
      console.log(res)
      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      this.hasMoreMvs = res.hasMore

      this.hotMvsa = [...this.hotMvsa, ...res.mvs]
      this.hotMvs = this.hotMvsa.map((item) => {
        return {
          id: item.id,
          name: item.name,
          cover: item.imgurl,
          playCount: item.playCount
          // id: String(item.id),
          // name: item.name,
          // mvId: item.mv,
          // singer: item.ar,
          // album: item.al,
          // alia: item.alia,
          // vip: item.fee === 1,
          // license: item.st === -1,
          // duration: item.dt,
          // url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
          // publishTime: item.publishTime
        }
      })
      // this.isLoading = res.hasMore
      // this.isLoadMv = true
      this.offset += 20
      console.log(this.hotMvs, '12345646876')
      this.load = true
      if (cb) cb()
    },
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
      this.msg = '加载中...'
      // this.offset++
      // setTimeout(() => {
      //   console.log('被调用了')
      //   this.load = true
      //   this.msg = '加载更多'
      // }, 2000)

      if (!this.hasMoreMvs) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      // console.log(this.hotAlbums.length)
      // console.log(this.hotAlbums.length >= this.total)
      this.getArtistMv(() => {
        this.load = true
        this.msg = '加载更多'
      })
    }
  },
  watch: {
    top(newVal, oldVal) {
      // console.log('触发快乐')
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
.box {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 1%;
}
.msg {
  width: 100%;
  height: 20px;
  text-align: center;
  background-color: #d9d9d9;
  margin-top: 15px;
  border-radius: 10px;
  // margin-bottom: 15px;
}
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
}
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
</style>
