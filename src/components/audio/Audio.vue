<template>
  <div class="audio-continer" @mouseover="showAudio" @mouseout="noneAudio" ref="audioContiner">
    <div class="filter"></div>
    <div class="hover">
      <span class="lock">
        <a href="javascript:;" class="el-icon-lock" v-if="this.audiolock" @click="audiolock = false" :style="{ color: '#e60026' }"></a>
        <a href="javascript:;" class="el-icon-unlock" v-else @click="audiolock = true"></a>
      </span>
      <div class="Progress" ref="Progress" @mousedown="skipTime" @mouseover="downHover" @mouseout="upHover">
        <div class="cache">
          <!-- this.jindu[i] = { startp, width } -->
          <div v-for="(item, index) in jindu" :key="index" :style="{ left: `${item.startp}%`, width: `${item.width}%` }"></div>
        </div>
        <div class="minProgress" ref="minProgress">
          <div class="btn" @mousedown.stop="down" ref="btn">
            <div class="time" ref="time" :style="{ left: '15px', display: 'none' }">
              <span>
                <a href="javascript:;" @click="ProgressLock = !ProgressLock">{{ ProgressTime | timechenge }}</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div ref="audio"> -->
    <!-- <audio ref="music" @pause="pause" @play="play" @ended="next" @durationchange="getTime" @progress="noFirefox" @timeupdate="Firefox" @canplaythrough="cache"></audio> -->
    <!-- </div> -->
    <!-- 正在播放： {{ nowSong.album.picUrl }} -->

    <div class="box">
      <div class="min-box" :style="{ left: `-${left}px` }">
        <div class="left">
          <!-- 因为要做旋转动画古把两个v-for分开了 -->
          <div class="img" ref="img" :class="{ shadow: isPlayed }">
            <div v-if="nowSong.length === 0" :style="{ backgroundColor: '#f0f0f0', width: '100%', height: '100%' }"></div>
            <!-- 数据驱动页面刷新 -->
            <div v-for="item in nowSong" :key="item.id">
              <router-link :to="{ path: '/song', query: { id: item.id } }">
                <img :src="item.album.picUrl + '?param=60y60'" alt="" />
              </router-link>
            </div>
          </div>
          <div v-if="nowSong.length === 0" class="title">
            <h6>……</h6>
            <span>……</span>
          </div>
          <div v-for="item2 in nowSong" :key="item2.id" class="title">
            <h6>
              <router-link :to="{ path: '/song', query: { id: item2.id } }">{{ item2.name }}</router-link>
            </h6>
            <span>
              <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in item2.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
            </span>
          </div>
        </div>
        <div class="middleTime">
          <!-- <button @click="anc"></button> -->
          <span>
            <em>{{ songTime | timechenge }}</em>
            /
            <em>{{ nowSongTime | timechenge }}</em>
          </span>
        </div>
        <div class="controls">
          <a href="javascript:;" @click="callback" class="iconfont icon-audio-prev chenge"></a>
          <a href="javascript:;" @click="stop" v-if="isPlayed" class="iconfont icon-audio-pause middle"></a>
          <a href="javascript:;" @click="bofang" v-else class="iconfont icon-audio-play middle"></a>
          <a href="javascript:;" @click="next" class="iconfont icon-audio-next chenge"></a>
          <!-- <button @click="del"></button>
        <button @click="an">10秒</button>
        <span>{{ this.playId }}</span> -->
          <!-- {{ playStatus }} -->
          <!-- {{ nowSongTime }} -->
        </div>
        <div class="volume">
          <a href="javascript:;" class="iconfont icon-volume-active volumeIcon" v-if="volumepercent === 0" @click="mute"></a>
          <a href="javascript:;" class="iconfont icon-volume volumeIcon" v-else @click="loudspeake"></a>

          <div class="Progress" ref="volumeProgress">
            <div class="minProgress" ref="volumeMinProgress">
              <div class="btn" ref="volumeBtn" @mousedown.stop="volumeDown">
                <div class="time" ref="volumeTime">
                  <span>{{ parseInt(volumepercent) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <a href="javascript:;" class="iconfont icon-single-cycle" v-if="playStatus === 'loop'" @click="playStatus = 'random'"></a>
          <a href="javascript:;" class="iconfont icon-shuffle" v-else-if="playStatus === 'random'" @click="playStatus = ''"></a>
          <a href="javascript:;" class="iconfont icon-loop" v-else @click="playStatus = 'loop'"></a>

          <a href="javascript:;" @click="showlyric">词</a>
          <a href="javascript:;" class="iconfont icon-playlist btnPlayList" @click="showPlayList">
            <span v-if="this.playList.length !== 0">{{ this.playList.length }}</span>
          </a>
        </div>
      </div>
    </div>
    <!-- <img :src="picUrl" alt="" /> -->
    <!-- {{ this.$store.state.playIndex }}
    <button @click="callback">回去</button>
    <button @click="stop">暂停</button>

    <button @click="next">切歌</button>
    <button @click="del"></button>
    <button @click="an">10秒</button>
    <span>{{ this.playId }}</span>
    <span>//{{ songTime | timechenge }}</span> -->
    <div class="PLAY-LIST" ref="playList">
      <div class="close">
        <a href="javascript:;" class="delAll" @click="delAll">清空列表</a>
        <a href="javascript:;" class="el-icon-close right" @click="showPlayList"> </a>
      </div>

      <div class="playListBox">
        <song-list :list="this.playList" :isPlayList="true" @ondelete="del"></song-list>
      </div>
    </div>
    <div class="lyric" :style="{ top: `${LyricTop}px` }">
      <lyric :lyric="Lyric" :nowTime="songTime" :width="400" ref="lyric" v-if="LyricTop === -513"></lyric>
    </div>
    <audio :loop="playStatus === 'loop'" ref="music" :muted="volumepercent === 0" @pause="pause" @play="play" @ended="next" @durationchange="getTime" @progress="noFirefox" @timeupdate="Firefox" @canplaythrough="cache"></audio>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import songList from '@/components/songList/song-list.vue'
import lyric from '@/components/lyric/lyric.vue'
// let placeholderHeight = 0
export default {
  data() {
    return {
      isDel: false,
      // 当前正在播放歌曲的对象值
      // 为什么要写成数组？因为要利用数据来驱动视图生成
      nowSong: [],
      // 由于获取歌词需要ID不得不单独拿出来
      nowSongId: '',
      // 当前歌曲的索引值保存
      nowSongIndex: -1,
      songTime: '',
      Interval: 0,
      nowSongTime: 0,
      // 进度条动态锁
      isMove: true,
      // 进度条百分比
      percent: 0,
      jindu: [],
      // 是否松开进度条
      isUp: true,
      // 进度条里的时间
      ProgressTime: 0,
      // 强制锁住气泡不消失
      ProgressLock: false,
      // 保存到右边的Right的最大值
      timeBubbleRight: '',
      // 锁住timeBubbleRight只需要取一次就好
      istimeBubbleRight: true,
      hover: true,
      // 音乐播放器锁
      audiolock: false,
      // 旋转图片的定时器
      imgRotateTime: 0,
      // 旋转角度
      rotate: 0,
      // 音量条的百分比
      volumepercent: 0,
      // 静音前的音量值
      oldVolumepercent: 0,
      isShowPlayList: false,
      playStatus: '',
      // 播放过的音乐
      randomSlice: [],
      // 歌词
      Lyric: '',
      showLyric: false,
      // 显示和隐藏歌词动画
      LyricTop: 80,
      left: 0
    }
  },
  mounted() {
    this.$bus.$on('scrollleft', (v) => {
      this.left = v
    })
    // console.log(`${this.$refs.music.volume * 100}%`)
    // this.$refs.volumeMinProgress.style.width = `${this.$refs.music.volume * 100}%`
    this.volumepercent = this.$refs.music.volume * 100
    // this.$refs.audioContiner.removeChild(this.$refs.music)
  },
  methods: {
    // 当获取到歌曲信息后把歌曲时间保存下来
    getTime() {
      this.nowSongTime = this.$refs.music.duration * 1000
    },
    playSong(index) {
      // 解决暂停时播放新歌会播放半秒钟旧歌的BUG
      this.$store.state.isPlayed = false
      // ----------------------------------
      this.jindu = []
      // 切换下一首就清空歌词索引
      // this.$refs.lyric.clearCurrenIndex()

      // this.currenIndex = 0
      // 保存当前播放的音乐对象
      this.nowSong[0] = this.playList[index]
      this.nowSongId = this.nowSong[0].id
      // console.log(this.nowSong)
      // 保存当前播放的音乐的索引值
      this.nowSongIndex = index
      // console.log(this.nowSong, '当前播放的歌曲', this.nowSongIndex)
      // 把当前音乐的url赋值给audio标签
      this.getSongUrl(this.playList[index].id, index)
      // this.clearLyric()
      // if (url) {
      //   console.log(url, 'URL2')
      //   if (url.code !== 200) {
      //     this.$store.state.isPlayed = false
      //     return this.$message.error('播放失败')
      //   }
      //   // this.$store.state.isPlayed = false
      //   // console.log(url)
      //   this.$refs.music.src = url.url
      // }
      // this.$refs.music.src = this.playList[index].url
      // this.$refs.music.play()
      // // 把当前播放的音乐的id赋值给vuex中的变量，方便其他组件检测
      // this.$store.state.playId = this.playList[index].id
      // setInterval((params) => {})
    },
    next() {
      // 如果播放列表为空就没有必要做出动作
      if (this.playList.length !== 0) {
        this.$store.state.isPlayed = true
        // 调用歌词组件的方法清空歌词数量
        // this.$refs.lyric.clearCurrenIndex()
        this.clearLyric()
        // this.currenIndex = 0
        this.jindu = []
        if (this.playStatus === 'random') {
          this.randomPlay()
          return
        }

        this.oldPlaySong()

        // 如果在列表删除过则会改变原来的索引值,则需要重新获取索引值
        if (!this.isDel) {
          this.lastSong()
        } else {
          // 如果删除过列表则会走到此处
          this.isDel = false
          // 调用此函数把新的索引值赋值给vuex中的变量
          this.$store.commit('PlayStatus', { status: true, value: this.nowSong[0] })
          // 如果当前播放的歌曲的索引值+1和播放列表长度相等的话，就能得出播放的是最后一首歌
          // 则将索引值归零再从第一首歌按顺序播放
          this.lastSong()
          // 当删除的是当前播放歌曲的上面的对象时下一首歌的索引就会可当前歌曲之前的索引一样。
          // 如果索引值没有变化的话是无法触发监听属性则需要手动调用播放函数
          // if (this.$store.state.playIndex === this.nowSongIndex) {
          //   // 索引值一样？那么监听属性废了。那么手动调用一次吧
          //   this.playSong(this.nowSongIndex)
          // }
          // 简写
          if (this.$store.state.playIndex === this.nowSongIndex) this.playSong(this.nowSongIndex)
        }
      }
    },
    callback() {
      if (this.playList.length !== 0) {
        // 如果播放列表为空就没有必要做出动作
        this.$store.state.isPlayed = true
        // 如果在列表删除过则会改变原来的索引值,则需要重新获取索引值
        if (!this.isDel) {
          this.firstSong()
        } else {
          // 如果删除过列表则会走到此处
          this.isDel = false
          // 调用此函数把新的索引值赋值给vuex中的变量
          this.$store.commit('PlayStatus', { status: true, value: this.nowSong[0] })
          // 如果当前播放的歌曲的索引值等于0的话，就能得出播放的是第一首歌
          // 则将索引值设置为播放列表长度减一
          this.firstSong()
          // 当删除的是当前播放歌曲的上面的对象时下一首歌的索引就会可当前歌曲之前的索引一样。
          // 如果索引值没有变化的话是无法触发监听属性则需要手动调用播放函数
          // if (this.$store.state.playIndex === this.nowSongIndex) {
          //   // 索引值一样？那么监听属性废了。那么手动调用一次吧
          //   this.playSong(this.nowSongIndex)
          // }
          // 简写
          if (this.$store.state.playIndex === this.nowSongIndex) this.playSong(this.nowSongIndex)
        }
      }
    },
    lastSong() {
      // 如果播放到最后一首歌，播放完毕后播放第一首歌
      // if (this.$store.state.playIndex === this.$store.state.playList.length - 1) {
      //   // 当检测到时最后一首歌时归零索引来回到第一首
      //   this.$store.state.playIndex = 0
      // } else {
      //   // 否则索引值加一来播放下一首
      //   this.$store.state.playIndex = this.$store.state.playIndex + 1
      // }
      this.$store.state.playIndex === this.$store.state.playList.length - 1 ? (this.$store.state.playIndex = 0) : (this.$store.state.playIndex = this.$store.state.playIndex + 1)
    },
    firstSong() {
      // 如果是第一首歌，播按下后退则会播放最后一首。
      // if (this.$store.state.playIndex === 0) {
      //   // 当检测到时最后一首歌时归零索引来回到第一首
      //   this.$store.state.playIndex = this.$store.state.playList.length - 1
      // } else {
      //   // 否则索引值加一来播放下一首
      //   this.$store.state.playIndex = this.$store.state.playIndex - 1
      // }
      this.$store.state.playIndex === 0 ? (this.$store.state.playIndex = this.$store.state.playList.length - 1) : (this.$store.state.playIndex = this.$store.state.playIndex - 1)
    },
    stop() {
      this.$store.commit('zanting')
    },
    bofang() {
      if (this.playList.length === 0) return
      this.$store.commit('bofang')
    },
    pause() {
      this.$store.state.isPlayed = false
      clearTimeout(this.time)
      clearTimeout(this.imgRotateTime)
    },
    play() {
      this.$store.state.isPlayed = true
      // console.log(this.nowSong)
      document.title = `正在播放:${this.nowSong[0].name}`
      // 为什么用定时间？因为audio自带的timeupdate事件更新时间不丝滑，我要丝滑的进度条
      clearTimeout(this.time)
      this.time = setInterval(() => {
        this.setTime()
        // console.log()
      })

      // 播放开始旋转
      this.imgRotate()
    },
    del({ index, id }) {
      this.isDel = true
      // this.$store.state.playList.splice(0, 1)
      console.log('触发了')
      console.log(index, id)
      this.$store.state.playList.splice(index, 1)
      if (this.playList.length === 0) {
        this.nowSong = []
        this.$refs.music.src = ''
        this.$store.state.isPlayed = false
        this.$store.state.playIndex = null
        this.$store.state.playId = ''
        this.nowSongTime = 0
        return
      }
      if (id === this.nowSong[0].id) {
        // 如果删除的正在播放的歌曲是列表最后一个，就索引值减去一播放前一个歌曲
        if (index === this.playList.length) return this.playSong(index - 1)
        this.playSong(this.nowSongIndex)
      }
    },
    setTime() {
      // console.log('123')
      this.songTime = this.$refs.music.currentTime * 1000
    },

    // 当鼠标按下时触发
    down(e) {
      // 开始修改
      this.isMove = false
      this.isUp = false
      console.log(e)
      const x1 = e.clientX
      const width = this.$refs.minProgress.offsetWidth
      this.$refs.time.style.display = 'flex'

      document.onmousemove = (e) => {
        this.timeBubble()
        this.isUp = true
        //  获取按下鼠标后移动的距离
        const x2 = e.clientX
        // 计算出移动的距离
        const x = x2 - x1
        // 当我开始拖动时就清除旋转的定时
        clearTimeout(this.imgRotateTime)
        // if (x < 0) {
        //   if (this.rotate >= 360) this.rotate = 0
        //   this.rotate += 1
        //   this.$refs.img.style.transform = `rotate(${this.rotate}deg)`
        // } else {
        //   if (this.rotate <= -360) this.rotate = 0
        //   this.rotate -= 1
        //   this.$refs.img.style.transform = `rotate(${this.rotate}deg)`
        // }
        // this.$refs.minProgress.style.width = `${width + x}px`
        this.percent = ((width + x) / this.$refs.Progress.offsetWidth) * 100
        if (this.percent <= 0) {
          this.percent = 0
        } else if (this.percent >= 100) {
          this.percent = 100
        }
        // this.percent = percent.toFixed(2)
        this.$refs.minProgress.style.width = `${this.percent}%`
        this.ProgressTime = (this.percent / 100) * this.nowSongTime
        // console.log(this.$refs.minProgress.width)
        // console.log(`${this.percentt}%`)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null

        if (this.isUp) {
          // 当松开滚动条也清空一次歌词索引
          // this.$refs.lyric.clearCurrenIndex()
          this.clearLyric()
          // this.currenIndex = 0
          // 当我不再拖动滚动条时，松开鼠标就开启定时器让歌曲头像继续旋转
          if (this.isPlayed) this.imgRotate()
          const nowTime = (this.percent / 100) * this.nowSongTime
          // 除1000转化为秒
          console.log(nowTime / 1000)
          // 处理兼容性问题
          'fastSeek' in this.$refs.music ? this.$refs.music.fastSeek(nowTime / 1000) : (this.$refs.music.currentTime = nowTime / 1000)
          // if ('fastSeek' in this.$refs.music) {
          //   console.log('支持')
          //   this.$refs.music.fastSeek(nowTime / 1000)
          // } else {
          //   console.log('不支持')
          //   this.$refs.music.currentTime = nowTime / 1000
          // }
          // this.$refs.music.currentTime = nowTime / 1000

          // 将改变后的时间赋值给显示时间区域
          this.songTime = nowTime
          this.isMove = true
          // console.log(this.percent, '长度')
        }
        // 第一个if强制锁住气泡不消失,第二个if判断鼠标是否在进度条上，如果不在就隐藏气泡
        if (!this.ProgressLock) if (this.hover) this.$refs.time.style.display = 'none'

        this.isUp = true
        this.isMove = true
      }
    },
    timeBubble() {
      // 如果时间气泡是被隐藏的，那就没有必要计算边角的位置了
      if (this.$refs.time.style.display === 'flex') this.isTimeBubble()
    },
    isTimeBubble() {
      // const btn = this.$refs.btn
      // console.log(btn.offsetWidth / 2 + btn.offsetRight)
      const offsetRight = this.$refs.Progress.offsetWidth - this.$refs.btn.offsetLeft - this.$refs.btn.offsetWidth
      // console.log(offsetRight)
      // console.log(this.$refs.time.style.display)
      if (offsetRight > this.$refs.btn.offsetLeft) {
        this.leftTimeBubble()
      } else {
        this.rightTimeBubble(offsetRight)
      }

      // 开始修改
    },
    leftTimeBubble() {
      if (this.$refs.btn.offsetWidth / 2 + this.$refs.btn.offsetLeft >= this.$refs.time.offsetWidth / 2) {
        // console.log('这里')
        this.$refs.time.style.left = '-25px'
        this.$refs.time.style.right = ''
        // `-${(this.$refs.time.offsetWidth - this.$refs.btn.offsetWidth) / 2}px`
      } else {
        // console.log(btn.offsetLeft)
        // console.log(`${-btn.offsetLeft}px`)
        this.$refs.time.style.left = `${-this.$refs.btn.offsetLeft}px`
        this.$refs.time.style.right = ''
      }
    },
    rightTimeBubble(offsetRight) {
      if (this.$refs.btn.offsetWidth / 2 + offsetRight <= this.$refs.time.offsetWidth / 2 + 8) {
        if (this.istimeBubbleRight) {
          // this.timeBubbleRight = this.$refs.Progress.offsetWidth - this.$refs.btn.offsetLeft - this.$refs.btn.offsetWidth
          // 如果实时计算的话，直接点击进度条无法获得正确的最大值，所以只有写死
          this.timeBubbleRight = 33
          // 锁住保存到了right的最小值不需要打开了
          this.istimeBubbleRight = false
        }

        console.log(this.timeBubbleRight)
        // console.log('这里2')
        // console.log(`${offsetRight}px`)
        this.$refs.time.style.left = ''
        this.$refs.time.style.right = `${this.timeBubbleRight - offsetRight - this.$refs.btn.offsetWidth - 3}px`
      } else {
        this.$refs.time.style.right = '-25px'
        this.$refs.time.style.left = ''
        // this.istimeBubbleRig = true
      }
    },
    skipTime(e) {
      if (this.isUp) {
        console.log('skipTime触发了')
        // 当点击滚动条位置也清空一次歌词索引
        // this.$refs.lyric.clearCurrenIndex()
        this.clearLyric()
        // this.currenIndex = 0
        const x1 = e.clientX
        const subWidth = x1 - this.$refs.minProgress.offsetWidth
        // this.$refs.minProgress.style.width = this.$refs.minProgress.offsetWidth + subWidth + 'px'
        let percent = ((this.$refs.minProgress.offsetWidth + subWidth) / this.$refs.Progress.offsetWidth) * 100
        if (percent < 0) {
          percent = 0
        } else if (percent > 100) {
          percent = 100
        }
        this.$refs.minProgress.style.width = `${percent}%`
        const nowTime = (percent / 100) * this.nowSongTime
        // 处理兼容问题
        'fastSeek' in this.$refs.music ? this.$refs.music.fastSeek(nowTime / 1000) : (this.$refs.music.currentTime = nowTime / 1000)
        // this.$refs.music.currentTime = nowTime / 1000
        console.log(percent)
        // setTimeout(() => {
        this.timeBubble()
        // }, 1000)
      }
    },
    cache() {
      this.jindu = []
      const myVideo = this.$refs.music
      // console.log(myVideo.buffered.length)
      for (let i = 0; i < myVideo.buffered.length; i++) {
        // 乘1000转化为毫秒
        const start = myVideo.buffered.start(i) * 1000
        // 算出开始的百分比
        const startp = (start / this.nowSongTime) * 100
        const end = myVideo.buffered.end(i) * 1000
        // 算出长度百分比
        const width = ((end - start) / this.nowSongTime) * 100
        this.jindu[i] = { startp, width }
        // console.log(this.jindu, `缓存进度${i}`)
      }

      // console.log(vio.length)
      // if (vio.length !== 0) {
      //   console.log(vio.start(0))
      //   console.log(vio.end(0))
      // }
    },
    Firefox() {
      this.timeBubble()
      if (navigator.userAgent.indexOf('Firefox') > -1) this.cache()
      // if (navigator.userAgent.indexOf('Firefox') > -1) {
      //   console.log('火狐')
      //   this.huancun()
      // }
    },
    noFirefox() {
      if (navigator.userAgent.indexOf('Firefox') === -1) this.cache()
      // if (navigator.userAgent.indexOf('Firefox') === -1) {
      //   console.log('不是火狐')
      //   this.huancun()
      // }
    },
    downHover() {
      // 死锁住气泡
      if (!this.ProgressLock) {
        this.hover = false
        // 是否在移动进度条？如果在移动则不执行
        if (this.isMove) this.$refs.time.style.display = 'flex'
      }
      // if (this.isMove) {
      //   console.log('经过我')
      //   this.$refs.time.style.display = 'flex'
      // }
    },
    upHover() {
      // 死锁住气泡
      if (!this.ProgressLock) {
        // 是否在移动进度条？如果在移动则不执行
        this.hover = true
        if (this.isMove) this.$refs.time.style.display = 'none'
      }
    },
    showAudio() {
      this.$refs.audioContiner.style.bottom = '0px'
    },
    noneAudio() {
      if (!this.audiolock) {
        this.$refs.audioContiner.style.bottom = '-70px'
      }
    },
    imgRotateSetInterval() {
      // console.log('123')
      if (this.rotate >= 360) this.rotate = 0
      this.rotate += 1
      this.$refs.img.style.transform = `rotate(${this.rotate}deg)`
      // if (this.rotate >= 360) {
      //   this.rotate = 0
      // }
    },
    imgRotate() {
      // let rotate = 0
      clearTimeout(this.imgRotateTime)
      this.imgRotateTime = setInterval(this.imgRotateSetInterval)
    },
    volumeDown(e) {
      const x1 = e.clientX
      const width = this.$refs.volumeMinProgress.offsetWidth
      this.$refs.volumeTime.style.display = 'flex'
      document.onmousemove = (e) => {
        // 获取按下鼠标后移动的距离
        const x2 = e.clientX
        // 计算出移动的距离
        const x = x2 - x1
        // 计算出音量条的百分比
        this.volumepercent = ((width + x) / this.$refs.volumeProgress.offsetWidth) * 100
        if (this.volumepercent <= 0) {
          this.volumepercent = 0
        } else if (this.volumepercent >= 100) {
          this.volumepercent = 100
        }
        // this.$refs.volumeMinProgress.style.width = `${this.volumepercent}%`
        // this.$refs.music.volume = this.volumepercent / 100
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
          this.$refs.volumeTime.style.display = ''
        }
      }
    },
    loudspeake() {
      this.oldVolumepercent = this.volumepercent
      this.volumepercent = 0
    },
    mute() {
      this.volumepercent = this.oldVolumepercent
    },
    showPlayList() {
      if (this.isShowPlayList) {
        this.$refs.playList.style.top = ''
        this.isShowPlayList = !this.isShowPlayList
      } else {
        this.$refs.playList.style.top = '-513px'
        this.isShowPlayList = !this.isShowPlayList
      }
    },
    randomPlay() {
      if (this.playList.length === 1) return this.playSong(this.playIndex)
      // console.log('触发了')
      this.oldPlaySong()

      const a = Math.floor(Math.random() * this.playList.length)
      for (let i = 0; i < this.randomSlice.length; i++) {
        if (this.randomSlice[i] === this.playList[a].id) {
          this.randomPlay()
          return
        }
      }
      console.log(this.randomSlice)

      // this.playSong(a)
      this.$store.state.playIndex = a
    },
    oldPlaySong() {
      if (this.randomSlice.length >= this.playList.length) {
        // 如果长度和播放列表一样，说明已经播放了一个轮回，直接清空
        if (this.playList.length <= 2) {
          this.randomSlice.splice(0, 1)
        } else {
          this.randomSlice.splice(0, parseInt(this.playList.length / 2))
        }
        // this.randomSlice.push(this.nowSong[0].id)
      }
      console.log(this.randomSlice.indexOf(this.nowSong[0].id), '随机列表')
      if (this.randomSlice.indexOf(this.nowSong[0].id) === -1) {
        this.randomSlice.push(this.nowSong[0].id)
      }
    },
    async getLyric(id) {
      const { data: res } = await this.$http.getLyric({ id })
      // console.log(res)
      // console.log(res.code)
      if (res.code !== 200) return this.$message.error('歌词获取失败')
      this.Lyric = res.lrc.lyric
      // this.Lyric = this.parseLyric(res.lrc.lyric)
      // console.log(this.Lyric)
    },
    showlyric() {
      if (this.showLyric) {
        this.LyricTop = 80
        this.showLyric = false
      } else {
        this.LyricTop = -513
        this.showLyric = true
      }
    },
    // 清空列表
    delAll() {
      this.nowSong = []
      this.$refs.music.src = ''
      this.$store.state.isPlayed = false
      this.$store.state.playIndex = null
      this.$store.state.playId = ''
      this.$store.state.playList = []
      this.nowSongTime = 0
    },
    clearLyric() {
      if (this.LyricTop === -513) {
        // console.log('触发了0')
        this.$refs.lyric.clearCurrenIndex()
      }
      // this.$refs.lyric.clearCurrenIndex()
      // console.log(this.$refs.lyric)
      // console.log(this.$refs.lyric.clearCurrenIndex)
      this.$bus.$emit('clearLyric', 'ok')
    },
    // 获取音乐的url
    async getSongUrl(ids, index) {
      // 把当前播放的音乐的id赋值给vuex中的变量，方便其他组件检测
      this.$store.state.playId = this.playList[index].id

      const { data: res } = await this.$http.cloudDetail({ ids, timestamp: Date.now() })
      console.log(res, 'url')
      if (res.code !== 200) return this.$message.error('歌曲播放失败')

      console.log(res.data[0], 'URL2')
      if (res.data[0].code !== 200) {
        // this.$store.state.isPlayed = false
        // this.$refs.music.src = ''
        // this.nowSong = []
        // this.$store.state.playId = ''
        // clearTimeout(this.imgRotateTime)
        this.del({ index, id: this.playList[index].id })
        return this.$message.error('播放失败')
      }
      // this.$store.state.isPlayed = false
      // console.log(url)
      this.$refs.music.src = res.data[0].url

      // this.$refs.music.src = this.playList[index].url
      // 解决暂停时播放新歌会播放半秒钟旧歌的BUG
      this.$store.state.isPlayed = true
      // ----------------------------------------------
      // this.$refs.music.play()

      // setInterval((params) => {})
      // return res.data[0]
    }

    //  this.$refs.lyric.clearCurrenIndex()
  },

  computed: {
    ...mapState(['playList', 'playIndex', 'isPlayed', 'playId']),
    // 计算进度条的长度
    ProgressWidth() {
      // console.log(this.nowSongTime, this.nowSong.duration)
      const songTime = (this.songTime / this.nowSongTime) * 100
      // console.log(songTime)
      return songTime
    }
    // 歌词实时滚动
    // transform() {
    //   return `transform: translateY(-${50 * this.currenIndex}px)`
    // }
    // // picUrl() {
    //   return this.nowSong.album.picUrl
    // }
    // setTime() {
    //   return this.$refs.music.currentTime * 1000
    // }
  },
  watch: {
    // 监听索引值的变化，如果变化立即调用函数播放音乐
    playIndex(newVal, oldVal) {
      console.log(newVal, '监听')
      console.log(this.isPlayed)
      if (this.isPlayed) this.playSong(newVal)
      // if (this.isPlayed) {
      //   this.playSong(newVal)
      // }
    },
    isPlayed(newVal, oldVal) {
      // newVal ? this.$refs.music.play() : this.$refs.music.pause()
      if (newVal) {
        this.$refs.music.play()
        document.title = `正在播放:${this.nowSong[0].name}`
      } else {
        this.$refs.music.pause()
        document.title = '音乐'
      }
    },
    // 监听进度条长度变化，每变一次就赋值给dom元素
    ProgressWidth(newVal, oldVal) {
      // if (this.isMove) this.$refs.minProgress.style.width = `${newVal}%`

      if (this.isMove) {
        this.timeBubble()
        this.$refs.minProgress.style.width = `${newVal}%`
      }
    },
    songTime(newVal, oldVal) {
      this.$store.state.songTime = newVal
      if (this.isMove) this.ProgressTime = newVal
      // this.currentIndex(newVal)
    },
    percent(newVal, oldVal) {
      console.log('触发了')
      if (newVal > oldVal) {
        if (this.rotate >= 360) this.rotate = 0
        this.rotate += 20
      } else {
        if (this.rotate <= -360) this.rotate = 0
        this.rotate -= 20
      }
      this.$refs.img.style.transform = `rotate(${this.rotate}deg)`
    },
    // 如果切换了下一首歌那么歌曲的ID一点是会变化的
    playId(newVal, oldVal) {
      if (newVal !== oldVal) this.rotate = 0
      // 开始播放下一首时最好把角度值归零，不然播放下一首时封面图片是歪的很尴尬是吧、
    },
    // 当音量百分比一改变就把值赋值给播放器,并且将值赋值给音量滚动条长度
    volumepercent(newVal, oldVal) {
      this.$refs.music.volume = newVal / 100
      this.$refs.volumeMinProgress.style.width = `${newVal}%`
    },
    // currenIndex(newVal, oldVal) {
    //   this.lyricScroll(newVal - 1)
    // },
    nowSongId: {
      handler(newVal, oldVal) {
        console.log('起作用了')
        this.getLyric(newVal)
      },
      deep: true
    }
  },
  components: {
    songList,
    lyric
  },
  beforeDestroy() {
    // document.onscroll = null
    this.$bus.$off('scrollleft')
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.audio-continer {
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.5);
  // background-color: #ffffff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: -70px;
  height: 70px;
  transition: 0.3s all;
  // cursor: none;
  // min-width: 1100px;
  z-index: 1000;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  &:hover {
    // bottom: 0px;
    .lock {
      display: block;
    }
  }
  .hover {
    // background-color: red;
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 20px;
  }
}
.Progress {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 5px;
  transform: translateY(50%);
  background-color: #f5f5f5;
  .minProgress {
    position: relative;
    width: 0;
    height: 100%;
    background-color: #e60026;
    .btn {
      position: absolute;
      // content: '';
      top: 50%;
      right: 0;
      transform: translate(50%, -50%);
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background-color: orange;

      // &:hover {
      //   .time {
      //     display: flex;
      //   }
      // }
      &::after {
        position: absolute;
        content: '';
        border-radius: 50%;
        width: 5px;
        height: 5px;
        background-color: #f5f5f5;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .time {
        position: absolute;
        // 写到了行内样式，不然JS读不出来
        // display: none;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        width: 65px;
        height: 31px;
        top: -40px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        a {
          color: #5f5f5f;
        }
        // left: 0;
        // left: -15px;
        // transform: translateX(-50%);
        background-color: #e7e7e7;

        &::before {
          position: absolute;
          content: '';
          top: 30px;
          border: 5px solid transparent;
          border-top: 8px solid #e7e7e7;
        }
      }
    }
  }
}
.cache {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // width: 100%;
  // height: 100%;
  // background-color: orange;
  div {
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #d5d5d5;
  }
}
.lock {
  display: none;
  position: absolute;
  overflow: hidden;
  top: -12.5px;
  right: 15%;
  width: 70px;
  height: 30px;
  background-color: #ffffff;
  border-radius: 25px 25px 0 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  a {
    width: 100%;
    height: 100%;
    line-height: 30px;
    text-align: center;
    color: #5f5f5f;
    font-size: 25px;
  }
  &:hover {
    a {
      color: #e60026;
    }
  }
}
.box {
  display: flex;
  position: relative;
  width: 96%;
  height: 100%;
  margin: 0 auto;
  margin-top: 2.5px;
  min-width: 1100px;
  .min-box {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .left {
    flex-shrink: 0;
    display: flex;
    // background-color: red;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    .img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;

      a {
        display: block;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .title {
      width: 220px;
      height: 100%;
      // background-color: rosybrown;
      display: flex;
      flex-direction: column;
      // align-items: center;
      justify-content: space-around;
      h6 {
        font-size: 15px;
        a {
          color: #333;
          font-size: 15px;
        }
        overflow: hidden !important;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        color: #999;
        font-size: 12px;
        a {
          color: #999;
          font-size: 12px;
        }
        overflow: hidden !important;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .middleTime {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: 99px;
    height: 100%;
    flex-shrink: 0;
    font-size: 15px;
    color: #606266;
    // background-color: red;
    margin-left: 15px;
    em {
      font-size: inherit;
      font-style: normal;
      color: inherit;
    }
  }
  .controls {
    display: flex;
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    transform: translate(-50%);
    justify-content: center;
    align-items: center;
    width: 300px;
    // background-color: red;
    .chenge {
      font-size: 40px;
      color: #666;
    }
    .middle {
      font-size: 50px;
      margin: 0 20px;
      color: #e60026;
    }
  }
  .volume {
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 64%;
    bottom: 0;
    width: 200px;
    // background-color: #e60026;
    .Progress {
      border-radius: 2.5px;
      width: 60%;
      top: 50%;
      left: 50%;
      bottom: auto;
      transform: translate(-50%, -50%);
      .minProgress {
        border-radius: 2.5px;
      }
    }
    .btn {
      .time {
        width: 35px !important;
        display: none;
        left: 50%;
        transform: translateX(-50%);
      }
      &:hover {
        .time {
          display: flex;
        }
      }
    }
    .volumeIcon {
      position: absolute;
      top: 50%;
      left: 5px;
      font-size: 25px;
      transform: translateY(-50%);
      color: #333;
      &:hover {
        color: #e60026;
      }
    }
  }
  .right {
    display: flex;
    justify-content: space-between;
    width: 200px;
    align-items: center;
    // background-color: red;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    a {
      color: #999;
      font-size: 20px;
    }
    .btnPlayList {
      position: relative;
      span {
        position: absolute;
        top: -6px;
        left: 15px;
        font-size: 3px;
      }
    }
  }
}
.PLAY-LIST {
  position: absolute;
  transition: 0.5s all;
  border-radius: 20px;
  width: 400px;
  height: 500px;
  background-color: #ffffff;
  right: 20px;
  top: 180px;
  z-index: 9;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  .playListBox {
    width: 100%;
    height: 100%;
    overflow: auto;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    // background-color: red;
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
  }
  .close {
    position: absolute;
    display: none;
    width: 100%;
    right: 0;
    top: -40px;
    justify-content: space-between;
    align-items: center;
    .delAll {
      display: inline-block;
      width: 100px;
      height: 30px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      background-color: #f0f0f0;
      border-radius: 15px;
      color: #333;
      text-align: center;
      line-height: 30px;
      font-size: 15px;
    }
    // background-color: red;
    .right {
      color: rgba(0, 0, 0, 0.5);
      font-size: 40px;
      transition: 0.3s all;
      &:hover {
        color: #e60026;
        transform: rotate(180deg);
      }
    }
  }

  &:hover {
    .close {
      display: flex;
    }
  }
}
.lyric {
  position: absolute;
  // top: -513px;
  left: 50%;
  transition: 0.5s all;
  transform: translateX(-50%);
  width: 400px;
  height: 500px;
  border-radius: 20px;
  background-color: #f0f0f0;
  // background-color: #e60026;
  overflow: hidden;

  // box-shadow: 0 0 5px rgb(0 0 0 / 50%);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
.shadow {
  box-shadow: 0 0 20px #ff641e;
}
.filter {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
}
@supports (-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px)) {
  // .filter {
  //   background-color: transparent !important;
  //   -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
  //   backdrop-filter: saturate(1.2) blur(24px) !important;
  //   background-color: rgba(36, 36, 36, 0.7) !important;
  // }
  .filter {
    background-color: rgba(255, 255, 255, 0.6) !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
    // border: 0 !important;
  }
  .lock {
    background-color: rgba(255, 255, 255, 0.6) !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
  }
  .lyric {
    background-color: rgba(240, 240, 240, 0.6) !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
  }
  .PLAY-LIST {
    background-color: rgba(240, 240, 240, 0.6) !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
  }
  /deep/.background {
    background-color: transparent;
  }
  /deep/.rows {
    &:hover {
      background-color: rgba(240, 240, 240, 0.4);
    }
  }
  /deep/.list-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  /deep/.nowPlay {
    background-color: rgba(240, 240, 240, 0.5) !important ;
  }
}

/deep/.columnAlbum {
  display: none;
}
/deep/.columnSong {
  width: 36%;
}
</style>
