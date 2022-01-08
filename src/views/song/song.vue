<template>
  <div class="song-continer">
    <div class="w continer">
      <div class="left">
        <div class="cover">
          <div class="zhenImg" :style="{ transform: `rotate(${deg}deg)` }">
            <img src="@/assets/zhen.png" alt="" />
          </div>
          <div class="imgContiner">
            <div class="coverImg" v-for="item in info" :key="item.id" :style="{ transform: `rotate(${rotate}deg)` }">
              <img :src="item.album.picUrl + '?param=150y150'" alt="" />
            </div>
          </div>
        </div>
        <similarSong :list="simiSong"></similarSong>
      </div>
      <div class="right" ref="right">
        <div class="info" v-for="item in info" :key="item.id">
          <h3 class="title">
            {{ item.name }}
            <router-link class="mv-name" :to="{ path: '/mv', query: { id: item.mvId } }" v-if="item.mvId">
              <i class="iconfont icon-video"></i>
            </router-link>
            <i v-if="item.vip" class="iconfont icon-vip"></i>
            <div class="audio-icon" v-if="isPlay">
              <div class="column" style="animation-delay: -1.2s"></div>
              <div class="column"></div>
              <div class="column" style="animation-delay: -1.5s"></div>
              <div class="column" style="animation-delay: -0.9s"></div>
              <div class="column" style="animation-delay: -0.6s"></div>
            </div>
          </h3>
          <p>
            <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song-author" v-for="(author, k) in item.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
          </p>
          <p class="song-info">
            <span>
              专辑：<router-link class="song-album" :to="{ path: '/album', query: { id: item.album.id } }">
                {{ item.album.name }}
              </router-link>
            </span>
            <span>
              发行时间：<em>{{ item.publishTime | formats }}</em>
            </span>
          </p>
          <div class="song-oper">
            <!-- @click="plyaing(info)"> -->
            <span :class="['play-btn', 'play-all', songDisable(item)]" @click="plyaing(item)"><i :class="['iconfont', playFontIcon]"></i> {{ item.vip ? 'VIP尊享' : isPlay ? '暂停播放' : '立即播放' }}</span>
            <!-- <template v-if="!isLogin">
              <span class="play-btn play-collect" @click="showAddList"><i class="iconfont icon-collect"></i> 收藏</span>
            </template>
            <el-popover placement="bottom" trigger="click" ref="popAddList" v-else>
              <span class="play-btn play-collect" slot="reference"><i class="iconfont icon-collect"></i> 收藏</span>
              <add-list :tracks="info.id" @closeAddListPop="closeAddListPop"></add-list>
            </el-popover>
            <span class="play-btn play-comment" @click="jumpComment"><i class="iconfont icon-comment"></i> 评论</span> -->
          </div>
          <div class="lyric">
            <lyric :lyric="Lyric" :nowTime="cunSongTime" :width="lyrictWidth" ref="Lyric"></lyric>
          </div>
          <Comments :id="sId" :type="type"></Comments>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import similarSong from '@/components/similarSong/similarSong.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import lyric from '@/components/lyric/lyric.vue'
import Comments from '@/components/comments/comments.vue'
export default {
  data() {
    return {
      sId: this.$route.query.id,
      info: [],
      deg: -20,
      rotate: 0,
      imgRotateTime: 0,
      simiSong: [],
      Lyric: '',
      lyrictWidth: 0,
      cunSongTime: 0,
      type: 0 // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    }
  },
  created() {
    this.init()
    // this.imgRotate()
  },
  mounted() {
    this.changeIsPlay(this.isPlay)
    this.resize()
    window.addEventListener('resize', this.resize)
    this.$bus.$on('clearLyric', (data) => {
      console.log('我是School组件，收到了数据', data)
      this.clearLyric()
    })
  },
  methods: {
    ...mapActions(['addSong', 'onlyAddSong']),
    ...mapMutations(['zanting']),
    init() {
      this.getSongDetail()
      this.getSimiSong()
      this.getLyric()
    },
    async getSongDetail() {
      const { data: res } = await this.$http.songDetail({ ids: this.sId, timestamp: new Date().valueOf() })
      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      console.log(res)
      // 是否有版权播放
      res.songs[0].license = !res.privileges[0].cp
      this.info = res.songs.map((item) => {
        console.log(item)
        return {
          id: String(item.id),
          name: item.name,
          mvId: item.mv,
          singer: item.ar,
          album: item.al,
          alia: item.alia,
          vip: item.fee === 1,
          license: item.license,
          duration: item.dt,
          url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
          publishTime: item.publishTime
        }
      })
      console.log(this.info)
    },
    // 获取相似音乐
    async getSimiSong() {
      const { data: res } = await this.$http.simiSong({ id: this.sId })

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }

      this.simiSong = res.songs.map((item) => {
        return {
          id: String(item.id),
          name: item.name,
          mvId: item.mvid,
          singer: item.artists,
          album: item.album,
          alia: item.alias,
          duration: item.duration,
          url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
          vip: item.fee === 1,
          license: item.license,
          publishTime: item.publishTime
        }
      })
      console.log(this.simiSong)
    },
    async getLyric() {
      const { data: res } = await this.$http.getLyric({ id: this.sId })
      // console.log(res)
      // console.log(res.code)
      if (res.code !== 200) return this.$message.error('歌词获取失败')
      this.Lyric = res.lrc.lyric
      // this.Lyric = this.parseLyric(res.lrc.lyric)
      // console.log(this.Lyric)
    },
    imgRotateSetInterval() {
      // console.log('123')
      if (this.rotate >= 360) this.rotate = 0
      this.rotate += 1
      // this.$refs.img.style.transform = `rotate(${this.rotate}deg)`
      // if (this.rotate >= 360) {
      //   this.rotate = 0
      // }
    },
    imgRotate() {
      // let rotate = 0
      clearTimeout(this.imgRotateTime)
      this.imgRotateTime = setInterval(this.imgRotateSetInterval)
    },
    changeIsPlay(b) {
      b ? this.imgRotate() : clearTimeout(this.imgRotateTime)
      b ? (this.deg = 0) : (this.deg = -20)
    },
    plyaing(params) {
      // 若当前唔歌曲 或者 当前播放歌曲不是本页显示的歌曲  立即播放当前页面歌曲
      if (!this.isPlayed || this.playId !== params.id) {
        // 无版权及vip不可播放
        if (params.license) {
          this.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
          return
        }

        if (params.vip) {
          this.$msg.error('付费歌曲，请在网易云音乐播放')
          return
        }

        this.addSong(params)
      } else {
        // this.setPlayStatus(!this.isPlayed)
        // this.addSong(params)
        this.zanting()
      }
    },
    resize() {
      // console.log()
      this.lyrictWidth = this.$refs.right.offsetWidth
    },
    clearLyric() {
      this.$refs.Lyric[0].clearCurrenIndex()
    }
  },
  computed: {
    ...mapState(['playId', 'isPlayed', 'playList', 'songTime']),
    isPlay() {
      console.log(this.playId === this.sId && this.isPlayed)
      return this.playId === this.sId && this.isPlayed
    },
    // 当前播放状态
    playFontIcon() {
      return this.isPlay ? 'icon-audio-pause' : 'icon-audio-play'
    },
    // 若是无版权获取vip歌曲 播放按钮置灰
    songDisable() {
      return (item) => {
        return item.license || item.vip ? 'disable' : ''
      }
    }
  },
  watch: {
    $route() {
      this.sId = this.$route.query.id
      // console.log('触发了')
      this.init()
      this.rotate = 0
    },
    isPlay(newVal, oldVal) {
      console.log(newVal, '监听')
      this.changeIsPlay(newVal)
    },
    songTime(newVal, oldVal) {
      if (this.isPlay) this.cunSongTime = newVal
    }
  },
  components: {
    similarSong,
    lyric,
    Comments
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.continer {
  display: flex;
  // height: 100px;
  margin-top: 15px;
  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 310px;
    // height: 100vh;
    // background-color: pink;
    flex-shrink: 0;
    .cover {
      position: relative;
      width: 242px;
      height: 242px;
      // background-color: rosybrown;
      .imgContiner {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-image: url('../../assets/disc.png');
        background-repeat: no-repeat;
        .coverImg {
          width: 65%;
          height: 65%;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .zhenImg {
        // background-color: saddlebrown;
        position: absolute;
        top: 0;
        right: 0;
        transform-origin: 23px 5px;
        transition: 0.2s all;
      }
    }
  }
  .right {
    width: 100%;
    // height: 100vh;
    // background-color: red;
    margin-left: 15px;
    min-width: 0;
    .info {
      .title {
        display: flex;
        align-items: center;
        font-size: 30px;
        line-height: 60px;
        padding-bottom: 10px;
        vertical-align: middle;
        a {
          vertical-align: middle;

          margin-left: 15px;
          i {
            font-size: 24px;
            color: #e60026;
            vertical-align: middle;
          }
        }
        .icon-vip {
          font-size: 30px;
          margin-left: 15px;
          color: #e60026;
        }
        .audio-icon {
          margin: 0;
          margin-left: 15px;
        }
      }
    }
    .song-author {
      display: inline-block;
      font-size: 18px;
      color: #666;
      line-height: 18px;
    }

    .song-info {
      padding: 20px 0;
      font-size: 0;
      color: #999;

      span {
        display: inline-block;
        padding-right: 30px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }

      a,
      em {
        color: #333;
        font-style: normal;
      }
    }
    .lyric {
      height: 600px;
      width: 100%;
      // background-color: pink;
    }
  }
}
.play-btn {
  display: inline-block;
  line-height: 16px;
  align-items: center;
  border-radius: 50px;
  padding: 7px 15px;
  cursor: pointer;
  margin: 5px 15px 5px 0;
  background: #f0f0f0;
  color: #333;
}
.play-all {
  color: #fff;
  background: #e60026;
  i {
    color: #fff;
  }
}
.disable {
  background: #ccc;
  cursor: not-allowed;
}
</style>
