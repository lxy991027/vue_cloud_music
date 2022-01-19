<template>
  <div class="mvlist-continer">
    <div class="w">
      <div class="filter">
        <div class="filter-item">
          <span>区域</span>
          <a href="javascript:;" v-for="(item, index) in area" :class="index === areaIndex ? 'active' : ''" :key="index" @click="selectType('area', index)">{{ item }}</a>
        </div>
        <div class="filter-item">
          <span>类型</span>
          <a href="javascript:;" v-for="(item, index) in type" :class="index === typeIndex ? 'active' : ''" :key="index" @click="selectType('type', index)">{{ item }}</a>
        </div>
        <div class="filter-item">
          <span>热度</span>
          <a href="javascript:;" v-for="(item, index) in order" :class="index === orderIndex ? 'active' : ''" :key="index" @click="selectType('order', index)">{{ item }}</a>
        </div>
      </div>
      <div class="title">
        <span>全部MV</span>
      </div>
      <div class="main" ref="main" :class="{ 'grid-template-columns5': MvListCount === 5, 'grid-template-columns4': MvListCount === 4 }">
        <MvList v-for="(item, index) in list" :key="item.id ? item.id + index : index" :list="item"></MvList>
      </div>
      <div class="msg" ref="msg">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
import MvList from '@/components/Mv-List/mv-list.vue'
export default {
  data() {
    return {
      area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      // '原生',
      type: ['全部', '官方版', '现场版', '网易出品'],
      //  '热门',
      order: ['上升最快', '最新'],
      areaIndex: 0,
      typeIndex: 0,
      orderIndex: 0,
      params: {
        area: '',
        type: '',
        order: '',
        limit: 30,
        offset: 0
      },
      list: [],
      MvListCount: 0,
      hasMore: true,
      msg: '下拉加载',
      top: 0,
      load: false
    }
  },
  created() {
    this.params.area = this.area[this.areaIndex]
    this.params.type = this.type[this.typeIndex]
    this.params.order = this.order[this.orderIndex]
    this.getMv(this.params)
  },
  mounted() {
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
    window.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
  },
  methods: {
    sizeChenge() {
      // this.top = document.body.scrollTop + document.documentElement.scrollTop
      // this.show(this.top)
      // this.bodyWidth = document.body.clientWidth
      this.divBox = this.$refs.main.offsetWidth

      // console.log(this.bodyWidth)
      this.showCd()
    },
    selectType(type, index) {
      this[type + 'Index'] = index
      this.list = []
      this.params.offset = 0
      this.params[type] = this[type][index]
      this.getMv(this.params)
    },
    async getMv(params, cb) {
      const { data: res } = await this.$http.mv(params)
      console.log(res, '???')
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }

      this.list = this.params.offset !== 0 ? [...this.list, ...res.data] : res.data
      this.hasMore = res.hasMore
      this.load = true
      if (cb) cb()
      // this.isLoadMv = !res.hasMore
      // this.isLoading = res.hasMore
    },
    showCd() {
      if (this.divBox >= 1577) {
        this.MvListCount = 6
      } else if (this.divBox >= 1041) {
        this.MvListCount = 5
      } else {
        this.MvListCount = 4
      }
    },
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

      if (!this.hasMore) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      // console.log(this.hotAlbums.length)
      // console.log(this.hotAlbums.length >= this.total)
      this.getMv(this.params, () => {
        this.load = true
        this.msg = '加载更多'
      })
    }
  },
  components: {
    MvList
  },
  watch: {
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
.mvlist-continer {
  padding: 15px 0;
}
.active {
  border-bottom: 2px solid red;
}
.filter-item {
  display: flex;
  margin-bottom: 10px;
  span {
    padding: 0 12px;
    flex-shrink: 0;
    font-size: 14px;
    color: #050505;
    height: 30px;
    font-weight: 600;
  }
  a {
    padding: 0 12px;
    flex-shrink: 0;
    font-size: 14px;
    color: #050505;
    height: 30px;
  }
}
.main {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
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
.title {
  span {
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;
  }
  margin: 15px 0;
}
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
}
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
</style>
