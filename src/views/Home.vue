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
        <Tag :list="HotMusicList" :settingList="HotMusicListTagSetting" :tagValue.sync="hotMusicListTagValue" @cilckTag="getHotMusicValue"></Tag>
        <div class="CD" ref="CD" :class="{ 'grid-template-columns6': PlayCdCount === 6, 'grid-template-columns5': PlayCdCount === 5 }">
          <PlayCd v-for="(item, index) in playMusicList" :key="item.coverImgId" :playCdList="item" v-show="index < PlayCdCount"></PlayCd>
        </div>
      </div>
      <!-- 新碟上架 -->
      <div class="newCdList">
        <h3>新碟上架</h3>
        <!-- tag栏区域  -->
        <Tag :list="NewCdListTag" :settingList="NewCdListTagSetting" :tagValue.sync="NewCdListListTagValue" @cilckTag="newCdListValue"></Tag>
        <div class="newCd" :class="{ 'grid-template-columns4 ': NewCdCount === 16, 'grid-template-columns3 ': NewCdCount === 9 }">
          <NewCd v-for="(item, index) in NewCdList" :key="item.id" :NewCdList="item" v-show="index < NewCdCount"></NewCd>
        </div>
      </div>
      <!-- 排行榜 -->
      <div class="rankingList">
        <h3>排行榜</h3>
        <div class="TopBox">
          <RanKing v-for="(item, index) in TopList" :key="item.id" v-show="index < RanKingCount" :TopListslice="item"></RanKing>
        </div>
      </div>
      <div class="MvBox">
        <h3>最新MV</h3>
        <Tag :list="mv_area" :settingList="mvListTagSetting" :tagValue.sync="mvListListTagValue" @cilckTag="mvListValue"></Tag>
        <div class="mvBoxList" :class="{ 'grid-template-columns5': MvListCount === 10, 'grid-template-columns4': MvListCount === 8 }">
          <MvList v-for="(item, index) in mv_list" :key="item.id" :list="item" v-show="index < MvListCount"></MvList>
        </div>
      </div>
      <div class="hotSinger">
        <h3>热门歌手</h3>
        <div class="hotSingerBox">
          <hotsingerlist v-for="(item, index) in artists_list" :key="item.name" :list="item" v-show="index < hotsingerlistCount"></hotsingerlist>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from '@/components/Tag/tag.vue'
import PlayCd from '@/components/PlayCd/playcd.vue'
import NewCd from '@/components/NewCdList/NewCd.vue'
import MvList from '@/components/Mv-List/mv-list.vue'
import RanKing from '@/components/Ranking/ranking.vue'
import hotsingerlist from '@/components/HotSingList/hotsinger.vue'
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
      // 热歌tag列表
      HotMusicList: [],
      // Tag栏的属性设置
      HotMusicListTagSetting: {
        // 设置标题
        label: 'name',
        // 设置key
        keys: 'createTime',
        type: 'name'
      },
      // TAG切换
      hotMusicListTagValue: '',
      playlist_params: {
        limit: 8,
        offset: 0,
        cat: ''
      },
      playMusicList: [],
      // playMusicListSplice: [],
      // 新碟上架tag
      NewCdListTag: [
        {
          name: '全部',
          code: 'all'
        },
        {
          name: '华语',
          code: 'zh'
        },
        {
          name: '欧美',
          code: 'ea'
        },
        {
          name: '韩国',
          code: 'kr'
        },
        {
          name: '日本',
          code: 'jp'
        }
      ],
      NewCdListTagSetting: {
        // 设置标题
        label: 'name',
        // 设置key
        keys: 'name',

        type: 'code'
      },
      // 新碟推荐Tag栏切换
      NewCdListListTagValue: '',
      // 新碟上架请求数据
      NewCdParams: {
        limit: 9
      },
      // 新碟列表
      NewCdList: [],
      // 切割后的新碟列表
      // NewCdListSplice: [],
      // 排行榜
      TopList: [],
      //  切割后的排行榜列表
      // TopListslice: [],
      // 最新MV的TAG列表
      mv_area: [{ name: '全部' }, { name: '内地' }, { name: '港台' }, { name: '欧美' }, { name: '日本' }, { name: '韩国' }],
      mvListTagSetting: {
        // 设置MV的tag栏
        label: 'name',
        keys: 'name',
        type: 'name'
      },
      // MVTag栏切换状态
      mvListListTagValue: '',
      // 最新MV列表
      mv_list: [],
      // mv_listSplist: [],
      mv_params: { limit: 12 },
      artists_list: [],
      artists_params: { limit: 11 },
      // artists_listSlice: [],
      PlayCdCount: 0,
      NewCdCount: 0,
      RanKingCount: 0,
      MvListCount: 0,
      hotsingerlistCount: 0
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
    this.getHotMusicList()
    this.newCdListValue()
    this.getTopList()
    this.mvListValue()
    this.getArtists()
  },
  mounted() {
    this.bodyWidth = document.body.clientWidth
    this.divBox = this.$refs.homeContainer.offsetWidth
    // this.showCd()
    // this.showCd(this.playMusicList)
    window.addEventListener('resize', this.sizeChenge)
    this.getHotMusicValue()
  },
  methods: {
    // 窗口变动事件
    sizeChenge() {
      this.bodyWidth = document.body.clientWidth
      this.divBox = this.$refs.homeContainer.offsetWidth
      console.log(this.bodyWidth)
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
    // 获取热歌列表
    async getHotMusicList() {
      try {
        const { data: res } = await this.$http.getHotMusicList()
        if (res.code !== 200) return this.$message.error('获取失败')
        res.tags.unshift({ name: '为您推荐' })
        this.HotMusicList = res.tags.splice(0, 6)
        console.log(this.HotMusicList)
      } catch (error) {
        console.log(error)
      }
    },
    async getHotMusicValue() {
      console.log(this.hotMusicListTagValue)
      if (this.hotMusicListTagValue === '为您推荐') {
        this.playlist_params.cat = ''
      } else {
        this.playlist_params.cat = this.hotMusicListTagValue
      }
      const { data: res } = await this.$http.playlist(this.playlist_params)
      if (res.code !== 200) return this.$message.error('推荐列表获取失败')
      this.playMusicList = res.playlists.slice(0, 8)

      this.showCd()
      console.log(res.playlists)
    },
    showCd() {
      // 实现数组深拷贝
      // const playMusicLists = HotMusicList
      // this.playMusicListSplice = playMusicLists
      // console.log(this.playMusicListSplice, '123456', playMusicLists)
      if (this.bodyWidth >= 1970) {
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
      } else if (this.bodyWidth >= 1300) {
        // this.daxiao = 6
        // this.playMusicListSplice = this.playMusicList.slice(0, 6)
        this.PlayCdCount = 6
        // this.NewCdListSplice = this.NewCdList.slice(0, 16)
        this.NewCdCount = 16
        // this.TopListslice = this.TopList.slice(0, 4)
        this.RanKingCount = 4
        // this.mv_listSplist = this.mv_list.slice(0, 10)
        this.MvListCount = 10
        this.artists_listSlice = this.artists_list.slice(0, 9)
        this.hotsingerlistCount = 9
        // if (this.bodyWidth >= 1000)
      } else {
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
      // console.log(this.mv_listSplist)

      // else {
      //   this.playMusicListSplice = playMusicLists
      //   console.log(this.playMusicListSplice, '123456')
      // }
      // console.log(this.playMusicListSplice, '123456', this.playMusicList.slice(0))
    },
    async newCdListValue() {
      // 新碟推荐Tag栏点击事件
      this.NewCdParams.area = this.NewCdListListTagValue
      console.log(this.NewCdListListTagValue, '哈哈')
      const { data: res } = await this.$http.topAlbum(this.NewCdParams)
      console.log(res, '新碟', this.NewCdParams)
      if (res.code !== 200) return this.$message.error('数据请求失败')
      // if (this.NewCdParams.area === 'all' || this.NewCdParams.area === '') {
      // this.NewCdList = res.weekData.slice(0, 25)
      // } else {
      this.NewCdList = res.monthData.slice(0, 25)
      // }

      this.showCd()
      console.log(this.NewCdList)
      // console.log(this.NewCdListListTagValue)
    },
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
    },
    // MV的TAG栏点击事件
    async mvListValue() {
      if (this.mvListListTagValue !== '全部') {
        this.mv_params.area = this.mvListListTagValue
      } else {
        this.mv_params.area = ''
      }

      const { data: res } = await this.$http.getNewMv(this.mv_params)
      if (res.code !== 200) return this.$message.error('MV列表获取失败')

      // 将获取到的MV列表保存到data中
      this.mv_list = res.data.slice(0, 12)
      this.showCd()
      console.log(this.mvListListTagValue)
      console.log(this.mv_list)
    },
    // 热门歌手
    async getArtists() {
      const { data: res } = await this.$http.topArtists(this.artists_params)

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }

      this.artists_list = res.artists
      this.showCd()
      console.log(this.artists_list, '热门歌手')
    },
    pathHandler(params) {
      switch (params.targetType) {
        case 1: // 单曲
          this.$router.push({ path: '/song', query: { id: params.targetId } })
          break
        case 10: // 专辑
          this.$router.push({ path: '/album', query: { id: params.targetId } })
          break
        case 1000: // 歌单
          this.$router.push({ path: '/detail', query: { id: params.targetId } })
          break
        case 1004: // MV
          this.$router.push({ path: '/mv', query: { id: params.targetId } })
          break
        case 3000: // 外链
          window.open(params.url, '_blank')
          break
      }
    }
  },
  computed: {
    height() {
      return (this.divBox / 100) * 18.52 + 'px'
    }
  },
  components: {
    Tag,
    PlayCd,
    NewCd,
    MvList,
    RanKing,
    hotsingerlist
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.max-home-container {
  width: 100%;
  // background-color: blue;
}
.home-container {
  // background-color: red;
  padding-top: 15px;
}
.medium {
  // background-color: pink;
  height: 100%;

  img {
    width: 100%;
    border-radius: 2vw;
  }
}
// .el-carousel {
//   margin-top: 15px;
// }

h3 {
  text-align: center;
  font-size: 28px;
  padding: 20px 0;
}

.CD {
  margin-top: 15px;
  display: grid;
  // justify-content: space-around;
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 3%;
}
.newCd {
  margin-top: 15px;
  display: grid;
  // justify-content: space-around;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 15px;
  // grid-row-gap: 7%;
  grid-row-gap: 15px;
}
.TopBox {
  display: flex;
  // grid-template-columns: repeat(5, 1fr);
  // align-items: center;
  justify-content: space-between;
}
.mvBoxList {
  margin-top: 15px;
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(6, 1fr);
}
.hotSingerBox {
  display: flex;
  justify-content: space-between;
}
.grid-template-columns6 {
  grid-template-columns: repeat(6, 1fr);
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
