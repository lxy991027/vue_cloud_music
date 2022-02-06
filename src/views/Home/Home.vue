<template>
  <div class="max-home-container">
    <div class="home-container w" ref="homeContainer">
      <!-- 走马灯区域 -->
      <el-carousel :interval="4000" type="card" :height="height">
        <el-carousel-item v-for="item in banners" :key="item.imageUrl">
          <div class="medium" @click="pathHandler(item)">
            <img :src="item.imageUrl" :alt="item.typeTitle" />
          </div>
        </el-carousel-item>
      </el-carousel>
      <!-- 热门歌曲 -->
      <div class="hotMusicList">
        <h3>热门歌单</h3>
        <!-- tag栏区域 -->
        <div class="continer" ref="hotMusicList">
          <HotMusicList :showHotMusicList="showHotMusicList" :count="PlayCdCount"></HotMusicList>
        </div>
      </div>
      <!-- 新碟上架 -->
      <div class="newCdList">
        <h3>新碟上架</h3>
        <div class="continer" ref="newCdList">
          <div class="main">
            <NewCdList v-if="showNewCdList" :count="NewCdCount"></NewCdList>
          </div>
        </div>
        <!-- tag栏区域  -->
      </div>
      <!-- 排行榜 -->
      <div class="rankingList">
        <h3>排行榜</h3>
        <div class="continer" ref="rankingList">
          <RankingList v-if="showRankingList" :count="RanKingCount"></RankingList>
        </div>
      </div>
      <div class="MvBox">
        <h3>最新MV</h3>
        <div class="continer" ref="MvBox">
          <MvBox :count="MvListCount" :showMvBox="showMvBox"></MvBox>
        </div>
      </div>
      <div class="hotSinger">
        <h3>热门歌手</h3>
        <div class="continer" ref="hotSinger">
          <hotSinger v-if="showHotSinger" :count="hotsingerlistCount"></hotSinger>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HotMusicList from './hotMusicList.vue'
import NewCdList from './NewCdList.vue'
import RankingList from './RankingList.vue'
import MvBox from './MvBox.vue'
import hotSinger from './hotSinger.vue'
export default {
  name: 'Home',
  data() {
    return {
      // 首页轮播图
      banners: [],
      // 轮播图高度计算
      bodyWidth: 0,
      // 盒子宽度
      divBox: 0,
      //  切割后的排行榜列表
      // TopListslice: [],
      // artists_listSlice: [],
      PlayCdCount: 0,
      NewCdCount: 0,
      RanKingCount: 0,
      MvListCount: 0,
      hotsingerlistCount: 0,
      top: 0,
      showHotMusicList: false,
      showNewCdList: false,
      showRankingList: false,
      showMvBox: false,
      showHotSinger: false
    }
  },
  created() {
    // setTimeout(() => {
    //   window.scrollTo(0, 0)
    // // }, 1)
    // this.$nextTick(() => {
    //   window.scrollTo(0, 0)
    // })
    this.getBanner()
  },
  mounted() {
    this.bodyWidth = document.body.clientWidth
    this.divBox = this.$refs.homeContainer.offsetWidth
    // this.showCd()
    // this.showCd(this.playMusicList)
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
    // this.getHotMusicValue()
    this.show(this.top)
    // document.onscroll = () => {
    //   this.top = document.body.scrollTop + document.documentElement.scrollTop
    //   console.log(document.body.scrollLeft + document.documentElement.scrollLeft)
    // }
    this.$bus.$on('scrollTop', (v) => {
      this.top = v
    })
  },
  methods: {
    // 窗口变动事件
    sizeChenge() {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
      this.show(this.top)
      // this.bodyWidth = document.body.clientWidth
      this.divBox = this.$refs.homeContainer.offsetWidth

      // console.log(this.bodyWidth)
      this.showCd()
    },
    // 获取轮播图列表
    async getBanner() {
      try {
        const { data: res } = await this.$http.getBanner()
        if (res.code !== 200) return this.$message.error('获取失败')
        this.banners = res.banners
        console.log(this.banners)
      } catch (error) {
        console.log(error)
      }
    },
    showCd() {
      // 实现数组深拷贝
      // const playMusicLists = HotMusicList
      // this.playMusicListSplice = playMusicLists
      // console.log(this.playMusicListSplice, '123456', playMusicLists)
      if (this.divBox >= 1577) {
        // console.log(this.bodyWidth, 1970, this.divBox)

        // this.daxiao = 8
        // this.playMusicListSplice = this.playMusicList.slice(0, 8)
        this.PlayCdCount = 8
        // this.NewCdListSplice = this.NewCdList.slice(0, 25)
        this.NewCdCount = 25
        // this.TopListslice = this.TopList.slice(0, 6)
        this.RanKingCount = 6
        // this.mv_listSplist = this.mv_list.slice(0, 12)
        this.MvListCount = 12
        // this.artists_listSlice = this.artists_list
        this.hotsingerlistCount = 11
      } else if (this.divBox >= 1041) {
        // console.log(this.bodyWidth, 1300, this.divBox)

        // this.daxiao = 6
        // this.playMusicListSplice = this.playMusicList.slice(0, 6)
        this.PlayCdCount = 6
        // this.NewCdListSplice = this.NewCdList.slice(0, 16)
        this.NewCdCount = 16
        // this.TopListslice = this.TopList.slice(0, 4)
        this.RanKingCount = 4
        // this.mv_listSplist = this.mv_list.slice(0, 10)
        this.MvListCount = 10
        // this.artists_listSlice = this.artists_list.slice(0, 9)
        this.hotsingerlistCount = 9
        // if (this.bodyWidth >= 1000)
      } else {
        // console.log(this.bodyWidth, '无', this.divBox)

        // this.daxiao = 5
        // this.playMusicListSplice = this.playMusicList.slice(0, 5)
        this.PlayCdCount = 5
        // this.NewCdListSplice = this.NewCdList.slice(0, 9)
        this.NewCdCount = 9
        // this.TopListslice = this.TopList.slice(0, 3)
        this.RanKingCount = 3
        // this.mv_listSplist = this.mv_list.slice(0, 8)
        this.MvListCount = 8
        // this.artists_listSlice = this.artists_list.slice(0, 7)
        this.hotsingerlistCount = 7
      }
    },

    pathHandler(params) {
      switch (params.targetType) {
        case 1: // 单曲
          this.$router.push({ path: '/song', query: { id: params.targetId + '' } })
          break
        case 10: // 专辑
          this.$router.push({ path: '/album', query: { id: params.targetId + '' } })
          break
        case 1000: // 歌单
          this.$router.push({ path: '/detail', query: { id: params.targetId + '' } })
          break
        case 1004: // MV
          this.$router.push({ path: '/mv', query: { id: params.targetId + '' } })
          break
        case 3000: // 外链
          window.open(params.url, '_blank')
          break
      }
    },
    getAbsTop(_) {
      let Top = _.offsetTop
      while (_.offsetParent != null) {
        _ = _.offsetParent
        Top += _.offsetTop
      }
      return Top
    },
    show(Top) {
      console.log('被调用了')
      if (this.$refs.hotMusicList.offsetTop - Top < document.documentElement.clientHeight) this.showHotMusicList = true

      if (this.$refs.newCdList.offsetTop - Top < document.documentElement.clientHeight) this.showNewCdList = true
      // hotMusicList
      if (this.$refs.rankingList.offsetTop - Top < document.documentElement.clientHeight) this.showRankingList = true

      if (this.$refs.MvBox.offsetTop - Top < document.documentElement.clientHeight) this.showMvBox = true

      if (this.$refs.hotSinger.offsetTop - Top < document.documentElement.clientHeight) this.showHotSinger = true
    }
  },
  computed: {
    height() {
      return (this.divBox / 100) * 18.52 + 'px'
    }
  },
  components: {
    HotMusicList,
    NewCdList,
    RankingList,
    MvBox,
    hotSinger
  },
  watch: {
    top(newVal, oldVal) {
      this.show(newVal)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    // document.onscroll = null
    this.$bus.$off('scrollTop')
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.max-home-container {
  width: 100%;
}
.home-container {
  padding-top: 15px;
}
.medium {
  height: 100%;

  img {
    width: 100%;
    border-radius: 2vw;
  }
}
h3 {
  text-align: center;
  font-size: 28px;
  padding: 20px 0;
}
.newCdList {
  .continer {
    // background-color: pink;
    position: relative;
    width: 100%;
    padding-top: calc(35% + 79px);
    .main {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
.rankingList {
  .continer {
    width: 100%;
    height: 623px;
    // background-color: pink;
  }
}
.MvBox {
  .continer {
    position: relative;
    width: 100%;

    // padding-top: calc(50% + 64px);
  }
}
.hotSinger {
  .continer {
    width: 100%;
    height: 173px;
    // background: pink;
  }
}
// @media screen and (max-width: 2002px) {
//   .CD {
//     grid-template-columns: repeat(8, 1fr);
//   }
//   .newCd {
//     grid-template-columns: repeat(5, 1fr);
//   }
// }
// @media screen and (max-width: 2000px) {
//   // .CD {
//   //   grid-template-columns: repeat(6, 1fr);
//   // }
//   // .newCd {
//   //   grid-template-columns: repeat(4, 1fr);
//   // }
//   // .mvBoxList {
//   //   grid-template-columns: repeat(5, 1fr);
//   // }
// }
// @media screen and (max-width: 1520px) {
//   // .CD {
//   //   grid-template-columns: repeat(5, 1fr);
//   // }
//   // .newCd {
//   //   grid-template-columns: repeat(3, 1fr);
//   // }
//   // .mvBoxList {
//   //   grid-template-columns: repeat(4, 1fr);
//   // }
// }
</style>
