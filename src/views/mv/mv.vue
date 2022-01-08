<template>
  <div class="mv-continer w" ref="mvContiner">
    <div class="left" ref="left">
      <div class="videoBox" ref="videoBox">
        <div class="video">
          <!-- 时间通过prop传过去 -->
          <!-- @loadstart="onplay" -->

          <video-Play :resolutionRatio="resolutionRatio" ref="videoPlay" :options="videoOptions" v-if="videoOptions.sources[0].src" @qualityChange="qualityChange" @play="onPlay" @pause="onPause" :chengeWindow.sync="chengeWindow" @ended="onended"></video-Play>
          <!-- <video-Play></video-Play> -->
        </div>
      </div>
      <span class="title">
        <h1>{{ MvDetail.name }}</h1>
        <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in MvDetail.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
        <p>
          <em>播放量:{{ MvDetail.playCount | setCount }}</em>
          <em class="time">发布时期：{{ MvDetail.publishTime }}</em>
        </p>
      </span>
      <Comments :id="Uid" :type="type"></Comments>
    </div>
    <div class="right" ref="right">
      <div class="title">
        <h3>相似MV</h3>
      </div>
      <div class="MVbox">
        <div class="mv" v-for="item in MvList" :key="item.id">
          <MvList :list="item"></MvList>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videoPlay from '@/components/video/video.vue'
import MvList from '@/components/Mv-List/mv-list.vue'
import Comments from '@/components/comments/comments.vue'
export default {
  created() {
    this.init()
  },
  mounted() {
    this.$refs.left.style.width = `${this.$refs.mvContiner.offsetWidth - 300 - 15}px`
    if (this.chengeWindow) {
      this.$refs.videoBox.style.height = `${(this.$refs.videoBox.offsetWidth / 100) * 56.25}px`
    } else {
      this.$refs.videoBox.style.height = `${(this.$refs.videoBox.offsetWidth / 100) * 68}px`
    }

    window.addEventListener('resize', this.resize)
  },
  data() {
    return {
      Uid: this.$route.query.id,
      MvDetail: {},
      videoOptions: {
        sources: [
          {
            type: '',
            src: '' // url地址
          }
        ],
        qualityList: [],
        quality: {}
      },
      currentTime: 0,
      chengeWindow: false,
      resolutionRatio: 0,
      MvList: [],
      type: 1 // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    }
  },

  methods: {
    resize() {
      this.$refs.left.style.width = `${this.$refs.mvContiner.offsetWidth - 300 - 15}px`
      if (this.chengeWindow) {
        console.log('触发了')
        this.$refs.videoBox.style.width = this.$refs.mvContiner.offsetWidth + 'px'
      }
      if (this.chengeWindow) {
        console.log('jinlail')
        this.$refs.videoBox.style.height = `${(this.$refs.videoBox.offsetWidth / 100) * 56.25}px`
      } else {
        console.log('进来了')
        this.$refs.videoBox.style.height = `${(this.$refs.videoBox.offsetWidth / 100) * 68}px`
      }
      if (this.chengeWindow) {
        this.$refs.right.style.paddingTop = this.$refs.videoBox.offsetHeight + 30 + 'px'
      }
    },
    init(cb) {
      this.getMvUrl(1080)
      this.getMvDetail()
      this.getSimiMv()
      if (cb) cb()
      // const a = this.$http.mvDetail({ id: this.Uid })
      // const b = this.$http.mvUrl({ id: this.Uid })
      // console.log(a, b, '你好')
      // this.currentTime = 0
      // Promise.all([a, b]).then((val) => {
      //   console.log(val, '里面')
      //   val.forEach((item, index) => {
      //     const res = item.data
      //     if (index === 0) {
      //       if (res.code !== 200) {
      //         return this.$msg.error('数据请求失败')
      //       }
      //       this.mvDetail = res.data
      //       this.videoOptions.qualityList = res.data.brs
      //       this.videoOptions.quality = { br: res.mp.dl }
      //     } else {
      //       if (res.code !== 200) {
      //         return this.$msg.error('数据请求失败')
      //       }
      //       this.$set(this.videoOptions.sources, 0, {
      //         type: 'video/mp4',
      //         src: res.data.url
      //       })
      //     }
      //   })
      // })
    },
    async getMvDetail() {
      const { data: res } = await this.$http.mvDetail({ id: this.Uid })
      console.log(res)
      if (res.code !== 200) return this.$message.error('数据请求失败')
      this.MvDetail = res.data
      this.videoOptions.qualityList = res.data.brs
      console.log(res.mp.dl, '清晰度')
      // this.videoOptions.quality = { br: res.mp.dl }-
      // { br: res.mp.dl }
    },
    async getMvUrl(r, callback) {
      const { data: res } = await this.$http.mvUrl({ id: this.Uid, r })
      console.log(res)
      if (res.code !== 200) return this.$message.error('数据请求失败')

      console.log(res.data.r, '清晰度')
      this.resolutionRatio = { br: res.data.r }
      this.$set(this.videoOptions.sources, 0, {
        type: 'video/mp4',
        src: res.data.url
      })
      if (callback) callback()
    },
    async getSimiMv() {
      const { data: res } = await this.$http.simiMv({ id: this.Uid })
      // console.log(res, '相似MV')
      if (res.code !== 200) return this.$message.error('数据请求失败')
      this.MvList = res.mvs
      console.log(this.MvList, '相似MV')
    },
    qualityChange(value, player) {
      console.log(player)
      this.getMvUrl(value, () => {
        // 当切换清晰度时，先把当前时间保存
        this.currentTime = player.currentTime()

        // 调用函数销毁当前video对象
        this.$refs.videoPlay.change()
      })
    },
    onPlay(player) {
      player.currentTime(this.currentTime)
      this.currentTime = 0
    },
    onPause(player) {
      this.currentTime = player.currentTime()
    },
    chengeWin(b) {
      if (b) {
        this.$refs.videoBox.style.width = this.$refs.mvContiner.offsetWidth + 'px'
        this.$refs.videoBox.style.height = `${(this.$refs.videoBox.offsetWidth / 100) * 56.25}px`
        this.$refs.right.style.paddingTop = this.$refs.videoBox.offsetHeight + 30 + 'px'
      } else {
        this.$refs.videoBox.style.width = ''
        this.$refs.videoBox.style.height = `${(this.$refs.videoBox.offsetWidth / 100) * 68}px`
        this.$refs.right.style.paddingTop = ''
      }
    },
    onended() {
      this.currentTime = 0
    }
  },
  watch: {
    $route: {
      handler() {
        this.Uid = this.$route.query.id
        // this.$refs.videoPlay.change()
        this.currentTime = 0
        this.videoOptions = {
          sources: [
            {
              type: '',
              src: '' // url地址
            }
          ],
          qualityList: [],
          quality: {}
        }
        this.init()
        this.chengeWindow = false
      },
      deep: true
    },
    chengeWindow(newVal, oldVal) {
      console.log(newVal)
      this.chengeWin(newVal)
    }
  },
  components: {
    videoPlay,
    MvList,
    Comments
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.w {
  width: 75%;
}
.mv-continer {
  padding-top: 15px;
  display: flex;
  justify-content: space-between;
  // flex-direction: column;
  .left {
    position: relative;
    width: 400px;
    // height: 500px;
    flex-shrink: 0;
    margin-top: 30px;
    // background-color: red;
    .videoBox {
      position: relative;
      background-color: #000;
      width: 100%;
      // padding-top: 68%;
      .video {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
    .title {
      display: block;
      width: 100%;
      // background-color: black;
      margin-top: 10px;
      margin-left: 15px;
      h1 {
        font-size: 20px;
        font-weight: normal;
      }
      a {
        display: inline-block;
        margin-top: 10px;
        color: #333;
        font-size: 13px;
      }
      p {
        margin-top: 5px;
        em {
          font-style: normal;
          color: #999;
          font-size: 10px;
        }
        .time {
          margin-left: 30px;
        }
      }
    }
  }
  .right {
    width: 300px;
    // background-color: royalblue;
    flex-shrink: 0;
    // margin-left: 25px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .title {
      display: flex;
      justify-content: center;
      height: 30px;
      width: 80%;
      h3 {
        font-weight: normal;
        font-size: 15px;
        line-height: 30px;
        // display: inline;
        // border-left: 10px solid #e60026;
        // border-right: 10px solid #e60026;
      }
    }
    .MVbox {
      display: flex;
      flex-direction: column;
      // justify-content: center;
      align-items: flex-end;
      width: 100%;
      // margin-top: 10px;
      .mv {
        width: 80%;
        height: 300px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
