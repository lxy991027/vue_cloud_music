<template>
  <div class="artist-continer">
    <div class="w">
      <div class="filter">
        <div class="filter-item">
          <a href="javascript:;" v-for="(item, index) in initial" :key="index" :class="index === initialIndex ? 'active' : ''" @click="selectType('initial', index)">{{ item.label }}</a>
        </div>
        <div class="filter-item">
          <a href="javascript:;" v-for="(item, index) in area" :key="index" :class="index === areaIndex ? 'active' : ''" @click="selectType('area', index)">{{ item.label }}</a>
        </div>
        <div class="filter-item">
          <a href="javascript:;" v-for="(item, index) in type" :key="index" :class="index === typeIndex ? 'active' : ''" @click="selectType('type', index)">{{ item.label }}</a>
        </div>
      </div>
      <div class="main" ref="main">
        <div class="item" v-for="(item, index) in list" :key="item.id + '' + index" ref="item">
          <hotsingerlist :list="item"></hotsingerlist>
        </div>
        <div class="symbolic" v-for="(item, index) in symbolic" :key="index"></div>
      </div>
      <div class="msg" ref="msg">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
import hotsingerlist from '@/components/HotSingList/hotsinger.vue'
export default {
  data() {
    return {
      type: [
        { label: '全部', val: -1 },
        { label: '男歌手', val: 1 },
        { label: '女歌手', val: 2 },
        { label: '乐队', val: 3 }
      ],
      area: [
        { label: '全部', val: -1 },
        { label: '华语', val: 7 },
        { label: '欧美', val: 96 },
        { label: '日本', val: 8 },
        { label: '韩国', val: 16 },
        { label: '其他', val: 0 }
      ],
      initial: [
        { label: '热门', val: -1 },
        { label: '#', val: 0 }
      ],
      typeIndex: 0,
      areaIndex: 0,
      initialIndex: 0,
      params: {
        area: '',
        type: '',
        initial: '',
        limit: 30,
        offset: 0
      },
      list: [],
      symbolic: [],
      msg: '下拉加载',
      top: 0,
      load: false,
      more: true
    }
  },
  created() {
    this.params.area = this.area[this.areaIndex].val
    this.params.type = this.type[this.typeIndex].val
    this.params.initial = this.initial[this.initialIndex].val
    this.renderInitial()
    this.getArtist(this.params)
  },
  mounted() {
    window.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
    window.addEventListener('resize', this.sizeChenge)
  },
  methods: {
    sizeChenge() {
      // this.top = document.body.scrollTop + document.documentElement.scrollTop
      // this.show(this.top)
      // this.bodyWidth = document.body.clientWidth
      const row = parseInt(this.$refs.main.offsetWidth / (this.$refs.item[0].offsetWidth + 30))
      const countSymbolic = row - (this.list.length % row)
      console.log(countSymbolic)
      this.symbolic = []
      for (let i = 0; i < countSymbolic; i++) {
        this.symbolic.push({})
      }
      console.log(this.symbolic)
      // console.log(this.bodyWidth)
      // this.showCd()
    },
    renderInitial() {
      const alphabet = []
      for (let i = 0; i < 26; i++) {
        alphabet.push({
          label: String.fromCharCode(65 + i),
          val: String.fromCharCode(97 + i)
        })
      }
      this.initial = [this.initial[0], ...alphabet, this.initial[1]]
      console.log(this.initial)
    },
    selectType(type, index) {
      this[type + 'Index'] = index
      this.list = []
      this.params.offset = 0
      this.params[type] = this[type][index].val
      this.getArtist(this.params)
    },
    async getArtist(params, cb) {
      const { data: res } = await this.$http.artistList(params)
      console.log(res, '???')
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }
      this.list = this.params.offset !== 0 ? [...this.list, ...res.artists] : res.artists
      this.more = res.more
      this.load = true
      if (cb) cb()
      this.$nextTick(() => {
        this.sizeChenge()
      })

      // this.isLoadMv = !res.more
      // this.isLoading = res.more
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
      this.params.offset += this.params.limit
      this.msg = '加载中...'
      // this.offset++
      // setTimeout(() => {
      //   console.log('被调用了')
      //   this.load = true
      //   this.msg = '加载更多'
      // }, 2000)

      if (!this.more) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      // console.log(this.hotAlbums.length)
      // console.log(this.hotAlbums.length >= this.total)
      this.getArtist(this.params, () => {
        this.load = true
        this.msg = '加载更多'
      })
    }
  },
  components: {
    hotsingerlist
  },
  watch: {
    // params: {
    //   handler(params) {
    //     this.getArtist(params)
    //   },
    //   deep: true // 深度监听
    // },
    top(newVal, oldVal) {
      console.log('触发了')
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
    window.removeEventListener('resize', this.sizeChenge)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.artist-continer {
  padding: 15px 0;
}
.active {
  border-bottom: 2px solid red;
}
.filter {
  margin-bottom: 15px;
}
.filter-item {
  display: flex;
  margin-bottom: 10px;
  a {
    padding: 0 12px;
    flex-shrink: 0;
    font-size: 14px;
    color: #050505;
    height: 30px;
  }
}
.main {
  transform: translateX(-15px);
  width: calc(100% + 30px);
  // background: pink;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .item {
    margin: 0 15px 5px 15px;
  }
  .symbolic {
    width: 120px;
    margin: 0 15px;
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
