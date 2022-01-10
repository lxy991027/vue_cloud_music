<template>
  <div class="lyric-continer" ref="lyricContiner" :style="{ width: `${width}px` }">
    <ul ref="lyricbox">
      <li class="placeholder" :style="{ width: `${lyricsSizeWidth}px` }"></li>
      <li v-for="(item, index) in lyricArr" :key="index" :class="{ color: index === currenIndex - 1 }" ref="lyrics" :style="{ width: `${lyricsSizeWidth}px` }">
        {{ item.value }}
      </li>
      <li class="placeholder" :style="{ width: `${lyricsSizeWidth}px` }"></li>
    </ul>
  </div>
</template>

<script>
export default {
  // props: ['lyric', 'nowTime'],
  created() {
    this.lyricArr = this.parseLyric(this.lyric)
    // setTimeout(() => {
    //   this.currentIndex(this.nowTime)
    // }, 5000)
    // // if (this.currenIndex !== 0) this.lyricScroll(this.currenIndex - 1)
    // console.log(this.lyric)
  },
  props: {
    lyric: {
      type: String,
      default: ''
    },
    nowTime: {},
    width: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      lyricsSizeWidth: 0,
      lyricArr: [],
      currenIndex: 0
    }
  },
  mounted() {
    this.lyricsSize()

    // this.$refs.lyricbox.attachEvent('resize', () => {
    //   this.lyricsSize()
    // })
  },
  methods: {
    lyricsSize() {
      // console.log(this.$refs.lyricContiner.offsetWidth, '什么？')
      this.lyricsSizeWidth = this.$refs.lyricContiner.offsetWidth
    },
    // 实现歌词滚动
    lyricScroll(currentLyric) {
      // 获取歌词item
      const lyricsArr = this.$refs.lyrics
      // 获取歌词框
      const lyrics = this.$refs.lyricbox
      // console.log(lyrics)
      // placeholder的高度
      // if (placeholderHeight === 0) {
      const placeholderHeight = lyricsArr[0].offsetTop - lyrics.offsetTop
      // }
      console.log(placeholderHeight, lyricsArr[0].offsetTop, lyrics.offsetTop)
      //   歌词item在歌词框的高度 = 歌词框的offsetTop - 歌词item的offsetTop
      //   console.log(currentLyric);
      if (lyricsArr[currentLyric]) {
        const distance = lyricsArr[currentLyric].offsetTop - lyrics.offsetTop
        // console.log(lyricsArr[currentLyric].offsetTop)
        //   lyricsArr[currentLyric].scrollIntoView();
        lyrics.scrollTo({
          behavior: 'smooth',
          top: distance - placeholderHeight
        })
      }
    },
    currentIndex(newValue) {
      // const index = 0
      // for (let i = 0; i < this.Lyric.length; i++) {
      //   if (this.currenIndex < this.Lyric.length) {
      //     if (newValue < this.Lyric[i].ms) {
      //       this.currenIndex = i - 1
      //       return
      //     }
      //   }
      // }
      if (this.currenIndex < this.lyricArr.length) {
        if (newValue >= this.lyricArr[this.currenIndex].ms) {
          this.currenIndex += 1
          // console.log(this.currenIndex, '里面')
          // this.lyricScroll(this.currenIndex - 1)
        }
      }
      // console.log(index)
    },
    // 处理歌词
    parseLyric(text) {
      // 将文本分隔成一行一行，存入数组
      var lines = text.split('\n')
      // 用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      // var pattern = /[\d2:\d2.\d2]/g
      var pattern = /\[\d+:\d+\.\d+\]/g
      //  /^[[0~9]2:[0~9]2.[0~9]2]$/g
      // 保存最终结果的数组
      var result = []
      // 去掉不含时间的行
      // while (!pattern.test(lines[0])) {
      //   lines = lines.slice(1)
      // }
      // 上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
      lines[lines.length - 1].length === 0 && lines.pop()

      lines.forEach((v /* 数组元素值 */, i /* 元素索引 */, a /* 数组本身 */) => {
        // 提取出时间[xx:xx.xx]
        // console.log(v)
        let time = v.match(pattern)
        time = time[0].match(/\b\d+:\d+\.\d+/g)
        time = time[0].replace('.', ':').split(':')

        // console.log(time[0] + '分' + time[1] + '秒' + time[2] + '毫秒')
        // console.log(parseInt(time[0]), parseInt(time[1]), parseInt(time[2]))
        const fen = parseInt(time[0]) * 60 * 1000
        const m = parseInt(time[1]) * 1000
        const s = parseInt(time[2])
        const ms = fen + m + s
        // console.log('毫秒')
        // 提取歌词
        var value = v.replace(pattern, '')
        if (value !== '') {
          // console.log(value)
          result.push({ ms, value })
        }
        // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        // console.log(time[0], 'time')

        // time.forEach((v1, i1, a1) => {
        //   // 去掉时间里的中括号得到xx:xx.xx
        //   var t = v1.slice(1, -1).split(':')
        //   // 将结果压入最终数组
        //   result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
        // })
      })
      // 最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
      // result.sort((a, b) => {
      //   return a[0] - b[0]
      // })
      return result
    },
    clearCurrenIndex() {
      this.currenIndex = 0
    }
  },
  watch: {
    lyric(newVal, oldVal) {
      // console.log(newVal)
      console.log('触发了')
      this.lyricArr = this.parseLyric(newVal)
      this.currenIndex = 0
      console.log(this.lyricArr)
    },
    nowTime(newVal, oldVal) {
      // console.log('起作用了')
      this.currentIndex(newVal)
    },
    currenIndex(newVal, oldVal) {
      this.lyricScroll(newVal - 1)
    },
    width(newVal, oldVal) {
      this.lyricsSizeWidth = newVal
      // this.lyricsSize()
    }
  }
}
</script>

<style lang="less" scoped>
.lyric-continer {
  // position: absolute;
  width: 100%;
  height: 100%;

  overflow: hidden;

  ul {
    width: calc(100% + 20%);
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;

    li {
      // width: 400px;
      text-align: center;
      margin: 25px 0;
      transition: 0.3s all;
    }
    .placeholder {
      width: 100%;
      height: 40%;
    }
  }
}
.color {
  color: #e60026;
  font-weight: 600;
  font-size: 20px;
}
</style>
