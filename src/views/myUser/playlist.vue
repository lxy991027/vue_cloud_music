<template>
  <div class="playlist-continer">
    <div class="TopText">
      <div class="box">
        <div class="img">
          <img :src="details.coverImgUrl" alt="" />
        </div>
        <div class="info">
          <div class="cover-title" v-if="JSON.stringify(details) !== '{}'">
            <span v-if="details.creator.userId === this.userInfo.userId"> {{ details.name }}</span>
            <router-link :to="{ path: '/detail', query: { id: details.id } }" class="name" v-else>
              {{ details.name }}
            </router-link>
          </div>
          <div class="cover-author" v-if="details.creator">
            <!-- <img :src="details.creator.avatarUrl" class="cover-avatar"></img> -->
            <router-link :to="{ path: '/user', query: { id: details.creator.userId } }">
              <!-- <span>{{}}</span> -->
              <img :src="details.creator.avatarUrl" alt="" />
              <div class="cover-name">{{ details.creator.nickname }}</div>
            </router-link>
            <div class="cover-date">{{ details.createTime | formats }}</div>
            <div class="cover-digital">
              <span class="cover-playCount"><i class="iconfont icon-playnum"></i> {{ details.playCount | setCount }}次</span>
              <span class="cover-collect"><i class="iconfont icon-collect"></i> {{ details.subscribedCount | setCount }}</span>
              <span class="cover-comment"><i class="iconfont icon-comment"></i> {{ details.commentCount | setCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="count">
      <span>包含歌曲列表({{ total }})</span>
      <!-- <em>{{ songList.length + '首歌' }}</em> -->
      <div class="list" v-if="JSON.stringify(details) !== '{}'">
        <song-list :list="songList" :myDetail="details.creator.userId === this.userInfo.userId" :detailId="id"></song-list>
      </div>
    </div>
    <div class="msg" ref="msg">{{ msg }}</div>
  </div>
</template>

<script>
import songList from '@/components/songList/song-list.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      id: '',
      details: {},
      songList: [],
      total: 0,
      page: 1,
      sliceArr: [],
      msg: '下拉加载',
      load: false,
      top: 0
    }
  },
  mounted() {
    this.id = this.$route.query.id
    // 歌单详情
    this.getDetail({ id: this.id, s: 8 })

    window.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
  },
  components: {
    songList
  },
  methods: {
    // 登录及未登录下获取歌单中歌曲的列表
    async getDetail(params) {
      params.timestamp = Date.now()
      this.isLoading = true
      const { data: res } = await this.$http.playlistdetail(params)
      console.log(res, '列表')
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }
      this.details = res.playlist

      const ids = res.playlist.trackIds
      this.total = ids.length
      this.getAllSongs(ids)
    },
    // 登录后根据ids获取所有歌曲列表
    getAllSongs(ids) {
      const num = 100

      // 数组过长 每100份一组
      for (let index = 0; index < ids.length; index += num) {
        this.sliceArr.push(ids.slice(index, index + num))
      }
      this.getList({ slice: this.sliceArr, page: this.page })
    },
    async getList({ slice, page, cb }) {
      const pages = page - 1
      const arrs = []
      slice[pages].map((item) => {
        arrs.push(item.id)
      })
      // console.log(arrs)
      const { data: res } = await this.$http.songDetail({ ids: arrs.join(','), timestamp: new Date().valueOf() + pages })
      // console.log(res, '数据')
      if (res.code !== 200) return this.$message.error('数据获取失败')
      // 格式化方法
      this.songList = [...this.songList, ...this.$format._format(res.songs)]
      this.load = true
      if (cb) cb()
    },
    _formatSongs(list) {
      const ret = []
      list.songs.map((item, index) => {
        if (item.id) {
          // 是否有版权播放
          console.log(item.license)
          if ((item.license = !list.privileges[index].cp) && !item.fee) {
            item.st = -1
          }
          // item.license = !list.privileges[index].cp
          ret.push(item)
        }
      })
      return ret
    },
    cb() {
      // this.page++
      // this.currentChange(this.page)
      this.page++
      const pages = this.page - 1
      this.msg = '加载中...'
      // this.offset++
      // setTimeout(() => {
      //   console.log('被调用了')
      //   this.load = true
      //   this.msg = '加载更多'
      // }, 2000)

      if (pages >= this.sliceArr.length) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      // console.log(this.hotAlbums.length)
      // console.log(this.hotAlbums.length >= this.total)
      this.getList({
        cb: () => {
          this.load = true
          this.msg = '加载更多'
        },
        page: this.page,
        slice: this.sliceArr
      })
    },
    getAbsTop(_) {
      let Top = _.offsetTop
      while (_.offsetParent != null) {
        _ = _.offsetParent
        Top += _.offsetTop
      }
      return Top
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {
    '$route.query.id': {
      handler() {
        this.details = {}
        this.songList = []
        this.sliceArr = []
        this.page = 1
        this.id = this.$route.query.id
        // this.chengePach()
        // this.showTag = false
        // this.optionSetting.nowStatus = this.$route.path
        // this.showTag = true
        this.getDetail({ id: this.id, s: 8 })
      }
      // deep: true
    },
    top(newVal, oldVal) {
      if (!this.load) return
      if (this.getAbsTop(this.$refs.msg) - newVal < document.documentElement.clientHeight) {
        this.load = false
        this.cb()
        // console.log('触发了')
      }
    }
  },
  beforeDestroy() {
    window.onscroll = null
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.playlist-continer {
  padding-bottom: 15px;
}
.TopText {
  position: relative;
  width: 100%;
  padding-top: 25%;
  // background-color: rosybrown;
  .box {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: orange;
    .img {
      display: flex;
      // justify-content: center;
      align-items: center;
      height: 100%;
      width: 25%;
      // background-color: orchid;
      img {
        width: 90%;
        height: 90%;
      }
    }
    .info {
      width: 75%;
      height: 100%;
      // background-color: orangered;
      overflow-y: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 50px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 2px;
        // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #e60026;
      }
      &::-webkit-scrollbar-track {
        display: block;
        /*滚动条里面轨道*/
        /* box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2); */
        /* border-radius: 10px; */
        background: transparent;
      }
      .cover-title {
        font-size: 24px;
        font-weight: bold;
        .name {
          color: #000;
        }
      }
      .cover-tags {
        padding-bottom: 5px;
        line-height: 16px;

        .tag {
          display: inline-block;
          margin-right: 5px;
          font-size: 12px;
          color: #e60026;
        }
      }

      .cover-author {
        padding: 15px 0 10px;
        a {
          color: #333;
        }
        img {
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 100%;
          vertical-align: top;
        }

        .cover-name,
        .cover-date {
          display: inline-block;
          padding: 0 10px;
          line-height: 32px;
        }

        .cover-date {
          color: #999;
        }
      }
      .jianjie {
        width: 100%;
      }
      .cover-desc {
        position: relative;

        h5 {
          padding: 30px 0 5px;
          line-height: 20px;
          font-size: 14px;
          color: #333;
        }

        div {
          line-height: 22px;
          font-size: 14px;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          word-break: break-all;
          cursor: pointer;
        }
      }
      .cover-digital {
        color: #999;
        width: 100%;
        display: flex;
        // justify-content: space-between;
        margin-top: 5px;
        span {
          margin-right: 20px;
        }
      }
    }
  }
}
.count {
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
.list {
  margin-top: 15px;
  width: 100%;
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
