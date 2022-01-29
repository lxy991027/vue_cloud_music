<template>
  <div class="video-continer" ref="videoContiner">
    <div class="video" ref="videoBox">
      <video ref="video" class="video-js video-skin"></video>
    </div>
    <div class="controls" ref="controls" @mousemove="showControls">
      <div class="playBar" :style="{ bottom: `${playBarBottom}px` }" @mouseover="showControlLock = true" @mouseout="showControlLock = false">
        <a href="javascript:;" class="iconfont icon-audio-pause" @click="pause" v-if="isPlay"></a>
        <a href="javascript:;" class="iconfont icon-audio-play" v-else @click="play"></a>
        <span class="volume">
          <!-- @click="mute" -->
          <!-- @click="loudspeake" -->
          <!-- <button @click="abc">50%</button> -->
          <div class="ProgressBox" ref="ProgressBox">
            <div class="hovers"></div>
            <div class="Progress" ref="volumeProgress">
              <div class="ProgressMin" ref="volumeMinProgress">
                <div class="btn" ref="volumeBtn" @mousedown.stop="volumeDown">
                  <div class="volumepercent" ref="volumepercent">
                    <span>{{ parseInt(volumepercent) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="javascript:;" class="iconfont icon-volume-active volumeIcon" v-if="volumepercent === 0" @click="mute"></a>
          <a href="javascript:;" class="iconfont icon-volume volumeIcon" v-else @click="loudspeake"></a>
          <!-- <span>{{ volumepercent }}</span> -->
        </span>
        <div class="videoProgress">
          <!-- @mousedown="skipTime" @mouseover="downHover" @mouseout="upHover" -->
          <div class="Progress" ref="videoProgress" @mousedown="skipTime">
            <!-- <div class="cache"> -->
            <!-- this.jindu[i] = { startp, width } -->
            <!-- <div v-for="(item, index) in jindu" :key="index" :style="{ left: `${item.startp}%`, width: `${item.width}%` }"></div> -->
            <!-- </div> -->
            <div class="minProgress" ref="videominProgress">
              <!-- @mousedown.stop="down"  -->
              <div class="btn" ref="videobtn" @mousedown.stop="down">
                <div class="time" ref="time" :style="{ left: '15px', display: 'none' }">
                  <span>
                    <!-- <a href="javascript:;" @click="ProgressLock = !ProgressLock">{{ ProgressTime | timechenge }}</a> -->
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="middleTime">
          <span>
            <em>{{ nowTime | timechenge }}</em>
            /
            <em>{{ thisSongTime | timechenge }}</em>
          </span>
        </div>
        <div class="HD">
          <a href="javascript:;">{{ opt.qualityType[resolutionRatio.br] }}</a>
          <ul class="HDmenu">
            <li v-for="(item, index) in kexuanqingxidu" :key="item.a" :class="{ color: item.a == resolutionRatio.br }">
              <a href="javascript:;" @click="qiehuan(item.a)" :class="{ boder: index !== kexuanqingxidu.length - 1 }">{{ item.b }}</a>
            </li>
          </ul>
        </div>
        <div class="da" v-if="showDa">
          <a href="javascript:;" class="el-icon-bottom-left" v-if="da" @click="changeWin"></a>
          <a href="javascript:;" class="el-icon-bottom-right" v-else @click="changeWin"></a>
        </div>
        <a href="javascript:;" class="el-icon-full-screen" @click="fullScreen"></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default() {
        return {
          isDown: false
        }
      }
    },
    resolutionRatio: {
      // type: Number
    }
  },
  created() {
    // console.log(this)
    window.onresize = () => {
      if (!this.isFullscreen()) {
        // console.log(this.isFullscreen())
        if (!this.da) this.$refs.videoContiner.style.padding = ''
        this.showDa = true
      } else {
        if (!this.da) this.$refs.videoContiner.style.padding = '0'
        this.showDa = false
      }
    }
  },

  data() {
    return {
      opt: {
        playbackRates: [0.5, 1, 1.5, 2], // 播放速度
        controls: false,
        autoplay: true, // 如果true,浏览器准备好时开始播放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        // language: 'zh-cn', // 设置无效
        // languages: {
        //     'zh-CN': {
        //         Play: '播放',
        //         Pause: '暂停',
        //         Mute: '静音',
        //         Unmute: '取消静音',
        //         'Playback Rate': '播放速度'
        //     }
        // },
        // aspectRatio: '16:9', // 播放器的比例。用冒号分隔的两个数字（例如"16:9"或"4:3"）
        // fluid: true, // 当true时，播放器将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'application/x-mpegURL',
            src: 'http://cctvalih5ca.v.myalicdn.com/live/cctv1_2/index.m3u8' // url地址
          }
        ],
        // poster: '', // 你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 无法播放媒体源时显示的默认信息。
        controlBar: {
          currentTimeDisplay: true, // 当前播放时长
          timeDivider: true, // 当前播放时间与总时间的斜杆分隔符
          durationDisplay: true, // 总时长
          remainingTimeDisplay: false, // 是否显示剩下的时间
          volumePanel: {
            // 音量组件
            inline: false // 调整音量调方向为纵向或者横向
          },
          QualitySelector: true,
          children: [
            'playToggle', // 播放暂停按钮
            'volumePanel', // 音量按钮
            'progressControl', // 视频进度条
            'currentTimeDisplay', // 当前播放时长
            'timeDivider', //  ‘/’ 分隔符
            'durationDisplay', // 视频总时长
            'PlaybackRateMenuButton', // 播放速度
            'qualityButton', // 视频高清切换
            'fullscreenToggle' // 全屏按钮
          ]
        },
        qualityList: [], // 当前可播放视频的分辨率列表
        quality: {}, // 当前播放视频的分辨率
        qualityType: {
          // 视频分辨率分类
          240: '240p',
          360: '360p',
          480: '480p',
          720: '720p',
          1080: '1080P'
        },
        errorDisplay: false,
        posterImage: false,
        bigPlayButton: true,
        textTrackDisplay: false
      },
      player: null,
      isfullScreen: false,
      isPlay: false,
      volumepercent: 0,
      // 静音前的音量值
      oldVolumepercent: 0,
      nowTime: 0,
      Interval: 0,
      thisSongTime: 0,
      isMove: true,
      isUp: true,
      percent: 0,
      qingxidu: 0,
      kexuanqingxidu: [],
      da: false,
      showDa: true,
      playBarBottom: -50,
      showControlssetTimeout: 0,
      showControlLock: false,
      left: 0
    }
  },
  mounted() {
    this.loadPlay()
    this.$bus.$on('scrollleft', (v) => {
      this.left = v
    })
  },
  methods: {
    loadPlay() {
      const video = document.querySelector('.video-js ')
      // this.player.pause()
      // console.log(this.player.quality())
      // this.$refs.videoContiber.requestFullscreen()
      console.log(this.player)
      const self = this

      this.$nextTick(() => {
        const options = { ...this.opt, ...this.options }
        console.log(this.options, options, '里面')
        this.player = this.$video(video, options, function onPlayerReady() {
          self.$emit('ready', this, '视频加载完成')

          this.on('loadstart', () => {
            self.$emit('loadstart', this, '开始请求数据')
          })
          this.on('progress', () => {
            self.$emit('progress', this, '正在请求数据')
          })
          this.on('loadedmetadata', () => {
            self.$emit('loadedmetadata', this, '获取资源长度完成')
          })
          this.on('canplaythrough', () => {
            self.$emit('canplaythrough', this, '视频源数据加载完成')
            self.thisSongTime = this.duration() * 1000
          })
          this.on('waiting', () => {
            self.$emit('waiting', this, '等待数据')
          })
          this.on('play', () => {
            self.$emit('play', this, '视频开始播放')
            self.isPlay = true
            self.getVideoTime()
          })
          this.on('playing', () => {
            self.$emit('playing', this, '视频播放中')
          })
          this.on('pause', () => {
            self.$emit('pause', this, '视频暂停播放')
            self.isPlay = false
            clearTimeout(self.Interval)
          })
          this.on('ended', () => {
            self.$emit('ended', this, '视频播放结束')
          })
          this.on('error', () => {
            self.$emit('error', this, 'error')
          })
          this.on('seek', () => {
            self.$emit('seek', this, '视频跳转')
          })
          this.on('seeking', () => {
            self.$emit('seeking', this, '视频跳转中')
          })
          this.on('seeked', () => {
            self.$emit('seeked', this, '视频跳转结束')
          })
          this.on('ratechange', () => {
            self.$emit('ratechange', this, '播放速率改变')
          })
          this.on('timeupdate', () => {
            self.$emit('timeupdate', this, '播放时长改变')
          })
          this.on('volumechange', () => {
            self.$emit('volumechange', this, '音量改变')
          })
          this.on('stalled', () => {
            self.$emit('stalled', this, '网速异常')
          })
          // this.on('qualityChange', (a, b, c) => {
          //   self.$emit('qualityChange', this, '高清视频切换')
          // })
        })

        this.volumepercent = this.player.volume() * 100
      })
    },
    fullScreen() {
      const a = this.$refs.videoContiner
      // console.log(this.isFullscreen())
      // const a = this.$refs.videoContiner
      if (this.isfullScreen) {
        this.exitFull()
        // document.exitFullscreen()
        // this.$refs.videoContiner.style.padding = ''
        this.isfullScreen = false
      } else {
        this.requestFullScreen(a)
        // this.$refs.videoContiner.requestFullscreen()
        // this.$refs.videoContiner.style.padding = '0'
        this.isfullScreen = true
      }

      // exitFullscreen()
    },
    requestFullScreen(elem) {
      // 判断各种浏览器，找到正确的方法
      if (elem.requestFullscreen) {
        elem.requestFullscreen()
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen()
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen()
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen()
      }
    },
    // 退出全屏 判断浏览器种类
    exitFull() {
      // 判断各种浏览器，找到正确的方法
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen()
      }
    },
    isFullscreen() {
      return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || false
    },
    pause() {
      this.player.pause()
    },
    play() {
      this.player.play()
    },
    abc() {
      console.log(this.player.volume())
    },
    volumeDown(e) {
      this.$refs.ProgressBox.style.display = 'flex'
      this.$refs.volumepercent.style.display = 'flex'
      const y1 = e.clientY
      const Height = this.$refs.volumeMinProgress.offsetHeight
      console.log(Height)
      // this.$refs.volumeTime.style.display = 'flex'
      document.onmousemove = (e) => {
        // 获取按下鼠标后移动的距离
        const y2 = e.clientY
        // 计算出移动的距离
        const y = y2 - y1
        // 计算出音量条的百分比
        this.volumepercent = ((Height - y) / this.$refs.volumeProgress.offsetHeight) * 100
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
          this.$refs.ProgressBox.style.display = ''
          this.$refs.volumepercent.style.display = ''
          // this.$refs.volumeTime.style.display = ''
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
    getVideoTime() {
      clearTimeout(this.Interval)
      this.Interval = setInterval(() => {
        this.nowTime = this.player.currentTime() * 1000
      }, 1)
    },
    // 当鼠标按下时触发
    down(e) {
      // 开始修改
      this.isMove = false
      this.isUp = false
      // console.log(e)
      const x1 = e.clientX
      const width = this.$refs.videominProgress.offsetWidth
      // this.$refs.time.style.display = 'flex'

      document.onmousemove = (e) => {
        // this.timeBubble()
        this.isUp = true
        //  获取按下鼠标后移动的距离
        const x2 = e.clientX
        // 计算出移动的距离
        const x = x2 - x1
        // this.$refs.minProgress.style.width = `${width + x}px`
        this.percent = ((width + x) / this.$refs.videoProgress.offsetWidth) * 100
        if (this.percent <= 0) {
          this.percent = 0
        } else if (this.percent >= 100) {
          this.percent = 100
        }
        // this.percent = percent.toFixed(2)
        this.$refs.videominProgress.style.width = `${this.percent}%`
        // this.ProgressTime = (this.percent / 100) * this.nowSongTime
        // console.log(this.$refs.minProgress.width)
        // console.log(`${this.percentt}%`)
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null

        if (this.isUp) {
          // 当松开滚动条也清空一次歌词索引

          const nowTime = (this.percent / 100) * this.thisSongTime
          // 除1000转化为秒
          console.log(nowTime / 1000)
          // 修改时间
          this.player.currentTime(nowTime / 1000)
          // 处理兼容性问题
          // 'fastSeek' in this.$refs.music ? this.$refs.music.fastSeek(nowTime / 1000) : (this.$refs.music.currentTime = nowTime / 1000)
          // if ('fastSeek' in this.$refs.music) {
          //   console.log('支持')
          //   this.$refs.music.fastSeek(nowTime / 1000)
          // } else {
          //   console.log('不支持')
          //   this.$refs.music.currentTime = nowTime / 1000
          // }
          // this.$refs.music.currentTime = nowTime / 1000

          // 将改变后的时间赋值给显示时间区域
          // this.nowTime = nowTime
          this.isMove = true
          // console.log(this.percent, '长度')
        }
        // 第一个if强制锁住气泡不消失,第二个if判断鼠标是否在进度条上，如果不在就隐藏气泡
        if (!this.ProgressLock) if (this.hover) this.$refs.time.style.display = 'none'

        this.isUp = true
        this.isMove = true
      }
    },
    skipTime(e) {
      if (this.isUp) {
        console.log('去你吗')
        // this.currenIndex = 0
        console.log('111')
        const x1 = e.clientX - this.getAbsLeft(this.$refs.videominProgress) + this.left
        const subWidth = x1 - this.$refs.videominProgress.offsetWidth
        // this.$refs.minProgress.style.width = this.$refs.minProgress.offsetWidth + subWidth + 'px'
        let percent = ((this.$refs.videominProgress.offsetWidth + subWidth) / this.$refs.videoProgress.offsetWidth) * 100
        if (percent < 0) {
          percent = 0
        } else if (percent > 100) {
          percent = 100
        }
        this.$refs.videominProgress.style.width = `${percent}%`
        const nowTime = (percent / 100) * this.thisSongTime
        // 修改时间
        this.player.currentTime(nowTime / 1000)
        // 处理兼容问题
        // 'fastSeek' in this.$refs.music ? this.$refs.music.fastSeek(nowTime / 1000) : (this.$refs.music.currentTime = nowTime / 1000)
        // this.$refs.music.currentTime = nowTime / 1000
        // console.log(percent)
        // setTimeout(() => {
        // this.timeBubble()
        // }, 1000)
      }
    },
    qiehuan(value) {
      if (value === this.resolutionRatio.br) return
      this.resolutionRatio.br = value
      this.$emit('qualityChange', value, this.player, '高清视频切换')
    },
    // 计算子元素距离浏览器最右边距离
    getAbsLeft(_) {
      let left = _.offsetLeft
      while (_.offsetParent != null) {
        _ = _.offsetParent
        left += _.offsetLeft
      }
      return left
    },
    change() {
      // console.log('变了没')
      this.player.dispose()
      this.$refs.videoBox.innerHTML = '<video ref="video" class="video-js video-skin"></video>'
      // console.log(this.$refs.video)
      // console.log(this.player)
      this.loadPlay()
    },
    changeWin() {
      console.log('???')
      this.da = !this.da
      if (this.da) {
        this.$refs.videoContiner.style.padding = '0'
      } else {
        this.$refs.videoContiner.style.padding = ''
      }
      this.$emit('update:chengeWindow', this.da)
    },
    // 鼠标移入显示控制栏
    showControls() {
      const controls = document.querySelector('.controls')
      clearTimeout(this.showControlssetTimeout)
      this.playBarBottom = 10
      controls.style.cursor = ''
      if (this.showControlLock) return
      this.showControlssetTimeout = setTimeout(() => {
        this.playBarBottom = -50
        controls.style.cursor = 'none'
        // cursor: none
      }, 5000)
    }
    // noneControls() {
    //   this.playBarBottom = -50
    // }
  },
  computed: {
    ProgressWidth() {
      // console.log(this.nowSongTime, this.nowSong.duration)
      // const nowTime = (this.nowTime / this.thisSongTime) * 100
      // console.log(songTime)
      return (this.nowTime / this.thisSongTime) * 100
    }
  },
  watch: {
    volumepercent(newVal, oldVal) {
      console.log(newVal)
      this.player.volume(newVal / 100)
      // this.$refs.music.volume =
      this.$refs.volumeMinProgress.style.height = `${newVal}%`
    },
    nowTime(newVal, oldVal) {
      // console.log(newVal, this.thisSongTime)
    },
    ProgressWidth(newVal, oldVal) {
      // if (this.isMove) this.$refs.minProgress.style.width = `${newVal}%`

      if (this.isMove) {
        // this.timeBubble()
        this.$refs.videominProgress.style.width = `${newVal}%`
      }
    },
    // qingxidu(newVal, oldVal) {
    //   console.log('变了没')
    //   // this.player.dispose()
    //   this.loadPlay()
    // },
    // resolutionRatio(newVal, oldVal) {
    //   console.log(newVal.br, '里面清晰度')
    //   // this.qingxidu = newVal.br
    // },
    'options.qualityList'(newVal, oldVal) {
      console.log(newVal, '计算属性')
      this.kexuanqingxidu = []
      for (let i = 0; i < newVal.length; i++) {
        console.log(newVal[i].br)
        this.kexuanqingxidu.push({ a: newVal[i].br, b: this.opt.qualityType[newVal[i].br] })
      }
      console.log(this.kexuanqingxidu)
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
      clearTimeout(this.Interval)
    }
    window.onresize = null
  }
}
</script>

<style lang="less" scoped>
.controls {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.video-continer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 30px 7px;
  // background-color: black;
  // .video {
  //   width: 100%;
  //   height: 100%;
  // }
  // .video-js {
  //   position: static !important;
  //   height: 100%;
  //   width: 100%;
  // }
  // .vjs-tech {
  //   position: static !important;
  // }
  // #vjs_video_24279 {
  //   padding: 0 !important;
  // }
  // #vjs_video_11995 {
  //   width: 100%;
  //   height: 100%;
  // }
  // /deep/.vjs-control-bar {
  //   height: 60px !important;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   justify-content: space-between;
  //   // button {
  //   //   span {

  //   //   }
  //   // }
  //   .vjs-button > .vjs-icon-placeholder:before {
  //     line-height: 60px !important;
  //   }
  //   .vjs-playback-rate-value {
  //     line-height: 60px !important;
  //   }
  //   .vjs-slider-vertical .vjs-volume-level:before {
  //     left: 50%;
  //     transform: translateX(-50%);
  //   }
  // }
}
.playBar {
  display: flex;
  align-items: center;
  position: absolute;
  // transform: translateX(-50%);
  // right: 0;

  border-radius: 25px;
  background-color: #fff;
  height: 40px;
  width: 95%;
  padding: 0 8px;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  transition: 0.5s all;
  a {
    // height: 100%;
    font-size: 20px;
    // background-color: red;
    color: #333;
  }
}
.volume {
  position: relative;
  .ProgressBox {
    display: none;
    // display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 38px;
    width: 40px;
    height: 100px;
    background-color: rgba(245, 245, 245, 0.6);
    border-radius: 20px;
    // background-color: red;
    .hovers {
      position: absolute;
      // background-color: red;
      top: 72px;
      width: 20px;
      height: 50px;
    }
    .Progress {
      position: relative;

      height: 80%;
      width: 5px;
      background-color: #f5f5f5;
      border-radius: 2.5px;
      position: absolute;

      .ProgressMin {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 50%;
        background-color: #e60026;
        .btn {
          position: absolute;
          left: 50%;
          width: 15px;
          height: 15px;
          background-color: #ffa500;
          border-radius: 50%;
          transform: translate(-50%, -50%);
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
          .volumepercent {
            display: none;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 25px;
            border-radius: 11.5px;
            background-color: #f5f5f5;
            position: absolute;
            left: 25px;
            top: 50%;
            transform: translateY(-50%);
            &::after {
              position: absolute;
              left: -13px;
              content: '';
              border: 6px solid transparent;
              border-right: 8px solid #f5f5f5;
            }
          }
          &:hover {
            .volumepercent {
              display: flex;
            }
          }
        }
      }
    }
  }
  &:hover {
    .ProgressBox {
      display: flex;
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
  // margin-left: 15px;
  margin: 0 10px;
  em {
    font-size: inherit;
    font-style: normal;
    color: inherit;
  }
}
.HD {
  position: relative;
  width: 75px;
  // background-color: pink;
  height: 25px;
  background-color: #f5f5f5;
  margin-right: 10px;
  a {
    text-align: center;
    line-height: 25px;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 10px;
    // background-color: red;
  }
  .HDmenu {
    display: none;
    position: absolute;
    left: 0;
    bottom: 23px;
    width: 100%;
    background-color: #ffffff;
    a {
      // background-color: green;
      height: 35px;
      line-height: 35px;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
  .boder {
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }
  // height: 100%;
  &:hover {
    .HDmenu {
      display: block;
    }
  }
}
.da {
  margin-right: 10px;
}
.videoProgress {
  display: flex;
  justify-content: center;
  align-items: center;
  // position: relative;
  // background-color: pink;
  width: 100%;
  height: 100%;
  .Progress {
    // position: absolute;
    // bottom: 0;
    width: 95%;
    height: 5px;
    // transform: translateY(50%);
    background-color: #f5f5f5;
    border-radius: 2.5px;
    .minProgress {
      position: relative;
      width: 0;
      height: 100%;
      background-color: #e60026;
      border-radius: 2.5px;
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
}
.color {
  color: #e60026;
  a {
    color: #e60026;
  }
}
</style>
