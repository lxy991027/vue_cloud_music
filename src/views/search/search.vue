<template>
  <div class="search-continer">
    <div class="w">
      <div class="search">
        <div id="shows" @keydown.enter="search">
          <el-input placeholder="请输入歌名、歌词、歌手或专辑" clearable ref="input" v-model="keyVal" class="input-with-select" @focus="showRank" @input="getSerachSuggest">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <div class="rank" v-if="Rank && suggestInfo.order">
            <ul class="search-rank">
              <li v-for="(item, index) in suggestInfo.order" :key="index">
                <h6>{{ listType[item] }}</h6>
                <ul>
                  <li v-for="(val, k) in suggestInfo[item]" :key="k">
                    <a href="javascript:;" class="text" @click="jumpPage(val, item)">
                      {{ val.name }}
                      <template v-if="item === 'songs'">
                        -<span v-for="(a, i) in val.artists" :key="i">{{ a.name + (i !== 0 ? ' / ' : '') }}</span>
                      </template>
                      <template v-else-if="item === 'albums'">
                        -<span>{{ val.artist.name }}</span>
                      </template>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
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
      <template v-if="list.length">
        <div class="count">
          <span>搜索结果</span>
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
      </template>
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
      top: 0,
      suggestInfo: {},
      Rank: false
    }
  },

  created() {
    this.type = this.$route.query.type ? this.$route.query.type : '1'
    this.keyVal = this.$route.query.key ? this.$route.query.key : ''
    if (this.keyVal !== '') {
      this.getSerachMatch()
    }
    console.log(this.list, this.list === [])
    // console.log(this.type, '???')
  },
  mounted() {
    window.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
    document.onclick = (e) => {
      e = e || window.event // 浏览器兼容性
      var elem = e.target || e.srcElement
      while (elem) {
        // 循环判断至跟节点，防止点击的是div子元素
        if (elem.id && elem.id === 'shows') {
          // console.log(elem)
          return
        }
        elem = elem.parentNode
      }
      this.Rank = false
    }
  },
  methods: {
    a() {
      console.log('a')
    },
    search() {
      if (this.keyVal === this.$route.query.key) return
      this.Rank = false
      this.$refs.input.blur()
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
    },
    async getSerachSuggest() {
      console.log('123')
      if (this.keyVal === '') return
      const { data: res } = await this.$http.serachSuggest({ keywords: this.keyVal })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }
      this.suggestInfo = res.result
    },
    showRank() {
      this.Rank = true
      // setTimeout(() => {
      //   document.onclick = () => {
      //     this.Rank = false
      //     document.onclick = null
      //   }
      // }, 100)
      // if (this.Rank) {
      //   this.Rank = false
      // } else {
      //   this.Rank = true
      // }
      if (this.keyVal === '') {
        return
      }
      this.getSerachSuggest()
      // if (this.serachHot.length === 0) {
      //   console.log('123')
      //   this.getSearchHot()
      // }
    },
    // 搜索建议列表，点击后跳转到相对应的落地页
    jumpPage(item, type) {
      console.log('调用了')
      this.input3 = item.name
      switch (type) {
        case 'songs':
          this.$router.push({ path: '/song', query: { id: item.id } })
          break
        case 'artists':
          this.$router.push({ path: '/singer', query: { id: item.id } })
          break
        case 'albums':
          this.$router.push({ path: '/album', query: { id: item.id } })
          break
        case 'playlists':
          this.$router.push({ path: '/detail', query: { id: item.id } })
          break
      }
      // this.isShowSearch = false
      this.Rank = false
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
      // console.log(this.leyVal);
      if (this.keyVal === '') return
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
  },
  beforeDestroy() {
    window.onscroll = null
    document.onclick = null
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.search-continer {
  padding: 15px 0;
}
#shows {
  width: 60%;
}
.search {
  position: relative;
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
  .rank {
    position: absolute;

    left: 0;
    width: 60%;
    // height: 500px;
    z-index: 10;
  }
  .rank {
    .text {
      overflow: hidden !important;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .search {
      margin-top: 0;
    }
    // display: block;
    color: #606266;
    // -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    // backdrop-filter: saturate(1.2) blur(24px) !important;
    h6 {
      font-size: 18px;
    }
    width: 60%;
    background-color: #fff;
    position: absolute;
    flex-direction: column;
    top: 45px;
    left: 0;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // box-shadow: ;
    border-radius: 10px;
    border: 1px solid #ebeef5;
    ul {
      margin-top: 10px;
      li {
        color: #606266;
        padding: 4px 0;
        font-size: 14px;
        a {
          color: #606266;
          display: block;
          width: 100%;
        }
        i {
          font-style: normal;
        }
      }
    }
  }
}
.el-input {
  width: 100%;
  height: 20px !important;

  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

/deep/.el-input__inner {
  border-radius: 16px 0 0 16px !important;
  border: 0;
  padding-left: 10px !important;
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
@supports (-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px)) {
  .rank {
    background-color: rgba(255, 255, 255, 0.6) !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
    border: 0 !important;
  }
}
</style>
