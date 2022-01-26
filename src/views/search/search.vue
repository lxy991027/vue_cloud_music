<template>
  <div class="search-continer">
    <div class="w">
      <div class="search">
        <el-input placeholder="请输入歌名、歌词、歌手或专辑" v-model="keyVal" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <div class="type">
          <a href="javascript:;" :class="type === '1' ? 'active' : ''" @click="selectType('1')">单曲</a>
          <a href="javascript:;" :class="type === '10' ? 'active' : ''" @click="selectType('10')">专辑</a>
          <a href="javascript:;" :class="type === '100' ? 'active' : ''" @click="selectType('100')">歌手</a>
          <a href="javascript:;" :class="type === '1000' ? 'active' : ''" @click="selectType('1000')">歌单</a>
          <!-- <span :class="type === '1002' ? 'active' : ''" @click="selectType('1002')">用户</span> -->
          <a href="javascript:;" :class="type === '1004' ? 'active' : ''" @click="selectType('1004')">MV</a>
          <a href="javascript:;" :class="type === '1014' ? 'active' : ''" @click="selectType('1014')">视频</a>
          <!-- <span :class="type === '1018' ? 'active' : ''" @click="selectType('1018')">综合</span> -->
        </div>
      </div>
      <div class="count">
        <span>包含歌曲列表</span>
        <em>{{ total + txt[this.type] }}</em>
      </div>
      <div class="main">
        <Songlist :list="list" v-if="type === '1'"></Songlist>
        <Cd :list="list" v-if="type === '10'"></Cd>
        <Singer :list="list" v-if="type === '100'"></Singer>
        <Playlist :list="list" v-if="type === '1000'"></Playlist>
        <Mv :list="list" v-if="type === '1004'"></Mv>
        <Mv :list="list" v-if="type === '1014'"></Mv>
      </div>
      <div class="msg" ref="msg">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
import Songlist from './songlist.vue'
import Cd from './cd.vue'
import Singer from './singer.vue'
import Playlist from './playlist.vue'
import Mv from './mv.vue'
export default {
  data() {
    return {
      keyVal: '',
      listType: {
        songs: '单曲',
        artists: '歌手',
        albums: '专辑',
        playlists: '歌单'
      },
      total: 0,
      type: '1',
      list: [],
      txt: {
        1: '首单曲',
        10: '张专辑',
        100: '个歌手',
        1000: '个歌单',
        1002: '个用户',
        1004: '个MV',
        1014: '个视频',
        1018: '个'
      },
      limit: 30,
      offset: 0,
      msg: '下拉加载',
      load: false,
      top: 0
    }
  },

  created() {
    this.type = this.$route.query.type ? this.$route.query.type : '1'
    this.keyVal = this.$route.query.key ? this.$route.query.key : ''
    if (this.keyVal !== '') {
      this.getSerachMatch()
    }
    // console.log(this.type, '???')
  },
  mounted() {
    window.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
  },
  methods: {
    a() {
      console.log('a')
    },
    search() {
      if (this.keyVal === this.$route.query.key) return
      this.list = []
      this.$router.push({ path: '/search', query: { key: this.keyVal, type: this.type } })
    },
    async getSerachMatch(cb) {
      const { data: res } = await this.$http.cloudsearch({ keywords: this.keyVal, type: this.type, limit: this.limit, offset: this.offset })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }

      if (this.type === '1') {
        this.list = this.offset !== 0 ? [...this.list, ...this.$format._format(res.result.songs)] : this.$format._format(res.result.songs)
        // this.list = this.$format._format(res.result.songs)
        // this.list = res.result.songs.map((item) => {
        //   return {
        //     id: String(item.id),
        //     name: item.name,
        //     mvId: item.mv,
        //     singer: item.ar,
        //     album: item.al,
        //     alia: item.alia,
        //     vip: item.fee === 1,
        //     license: item.license,
        //     duration: this.$utils.formatSongTime(item.dt),
        //     url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        //     publishTime: this.$utils.formatMsgTime(item.publishTime)
        //   }
        // })
        this.total = res.result.songCount
      } else if (this.type === '10') {
        this.list = this.offset !== 0 ? [...this.list, ...res.result.albums] : res.result.albums
        // this.list = res.result.albums
        this.total = res.result.albumCount
      } else if (this.type === '100') {
        this.list = this.offset !== 0 ? [...this.list, ...res.result.artists] : res.result.artists
        // this.list = res.result.artists
        this.total = res.result.artistCount
      } else if (this.type === '1000') {
        this.list = this.offset !== 0 ? [...this.list, ...res.result.playlists] : res.result.playlists
        // this.list = res.result.playlists
        this.total = res.result.playlistCount
      } else if (this.type === '1004') {
        // this.list = res.result.mvs
        this.list = this.offset !== 0 ? [...this.list, ...res.result.mvs] : res.result.mvs
        this.total = res.result.mvCount
      } else if (this.type === '1014') {
        const value = res.result.videos.map((item) => {
          return {
            cover: item.coverUrl,
            id: item.vid,
            name: item.title,
            playCount: item.playTime,
            artists: item.creator.map((item) => {
              return {
                id: item.userId,
                name: item.userName
              }
            })
          }
        })
        this.list = this.offset !== 0 ? [...this.list, ...value] : value
        // this.list = res.result.videos.map((item) => {
        //   return {
        //     cover: item.coverUrl,
        //     id: item.vid,
        //     name: item.title,
        //     playCount: item.playTime,
        //     artists: item.creator.map((item) => {
        //       return {
        //         id: item.userId,
        //         name: item.userName
        //       }
        //     })
        //   }
        // })
        this.total = res.result.videoCount
      }
      this.load = true
      if (cb) cb()
    },
    selectType(type) {
      this.list = []
      this.type = type
      this.offset = 0
      // this.currentpage = 0
      this.$router.push({ path: '/search', query: { key: this.keyVal, type: this.type } })
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

      if (this.list.length >= this.total) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      // console.log(this.hotAlbums.length)
      // console.log(this.hotAlbums.length >= this.total)
      this.getSerachMatch(() => {
        this.load = true
        this.msg = '加载更多'
      })
    }
  },
  components: {
    Songlist,
    Cd,
    Singer,
    Playlist,
    Mv
  },
  watch: {
    '$route.query'(newVal) {
      this.keyVal = newVal.key
      // this.type=newVal.type
      this.getSerachMatch()
    },
    top(newVal, oldVal) {
      console.log('触发了', this.load)
      if (!this.load) return
      if (this.getAbsTop(this.$refs.msg) - newVal < document.documentElement.clientHeight) {
        this.load = false
        this.cb()
        console.log('触发了')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-continer {
  padding: 15px 0;
}
.search {
  margin: 50px 0 30px 0;
  .type {
    margin-top: 10px;
    // background-color: red;
    width: 60%;
    display: flex;
    // justify-content: space-between;
    a {
      margin: 0 15px;
      padding: 0 5px;
      font-size: 14px;
      height: 23px;
      color: #606266;
    }
  }
}
.el-input {
  width: 60%;
  height: 20px !important;

  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
/deep/.el-input__inner {
  border-radius: 16px 0 0 16px !important;
  border: 0;
  padding: 0;
  line-height: 32px;
  padding-left: 30px;
  // padding-top: 8px;
  height: 40px;
}
/deep/.el-input-group__append {
  background-color: #e60026;
  border-radius: 0 16px 16px 0;
  border: 0;
  // width: 20px;
  .el-icon-search {
    font-size: 20px;
    color: #fff;
  }
}
.active {
  border-bottom: 2px solid red;
}
.count {
  margin-bottom: 15px;
  span {
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;
  }
  em {
    font-style: normal;
    margin-left: 40px;
    font-size: 13px;
    color: #999;
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
</style>
