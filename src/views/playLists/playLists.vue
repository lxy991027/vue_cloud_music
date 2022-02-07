<template>
  <div class="playLists-continer">
    <div class="w">
      <ul class="filter">
        <li class="filter-item" v-for="(item, index1) in categories" :key="index1" :class="{ border: index1 > 0 }">
          <span>{{ item.name }}</span>
          <ul>
            <template v-if="item.children.length <= 12">
              <li v-for="(item, index) in item.children" :key="index" :class="curType === item.name ? 'active' : ''" @click="selectType(item)">
                <a href="javascript:;">{{ item.name }}</a>
              </li>
            </template>
            <template v-else>
              <li v-for="(item, index) in item.children.slice(0, 11)" :key="index" @click="selectType(item)" :class="curType === item.name ? 'active' : ''">
                <a href="javascript:;">{{ item.name }}</a>
              </li>
              <li @click="show(index1)">
                <a href="javascript:;" class="moreText" :class="[moreTxt[index1] ? 'active' : '']">{{ moreTxt[index1] ? curType : '更多' }} <i class="iconfont icon-arrow"></i></a>
              </li>
              <ul class="more" :class="`more${index1}`">
                <div></div>
                <li v-for="(item, index) in item.children.slice(12)" :key="index" @click="click(item, index1)" :class="curType === item.name ? 'active' : ''">
                  <a href="javascript:;">{{ item.name }}</a>
                </li>
              </ul>
            </template>
          </ul>
        </li>
      </ul>
      <div class="tltle">
        <span class="h">{{ curType }}({{ total }}) </span>
        <div class="type">
          <span :class="params.order === 'hot' ? 'active' : ''" @click="selectOrder('hot')">热门</span>
          <span :class="params.order === 'new' ? 'active' : ''" @click="selectOrder('new')">最新</span>
        </div>
      </div>
      <main>
        <ul class="main" ref="main" :class="{ 'grid-template-columns6 ': PlayCdCount === 6, 'grid-template-columns5': PlayCdCount === 5 }">
          <li v-for="(item, index) in list" :key="item.id ? item.id + index : index">
            <PlayCd :playCdList="item"></PlayCd>
          </li>
        </ul>
        <div class="msg" ref="msg">{{ msg }}</div>
      </main>
    </div>
  </div>
</template>

<script>
import PlayCd from '@/components/PlayCd/playcd.vue'
export default {
  data() {
    return {
      categories: [],
      sub: [],
      curType: '',
      // sub: [],
      // categories: [],
      // curType: '',
      moreTxt: {},
      allList: {},
      params: {
        order: 'hot',
        cat: '',
        limit: 50,
        offset: 0
      },
      isClick: false,
      more: true,
      total: 0,
      list: [],
      divBox: 0,
      PlayCdCount: 0,
      msg: '下拉加载',
      top: 0,
      load: false
    }
  },
  created() {
    this.params.cat = this.$route.query.cat ? this.$route.query.cat : ''
    this.params.order = this.$route.query.order ? this.$route.query.order : 'hot'
    this.getPlayList(this.params)
    this.getCatlist()
  },
  mounted() {
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
    // window.onscroll = () => {
    //   this.top = document.body.scrollTop + document.documentElement.scrollTop
    // }
    this.$bus.$on('scrollTop', (v) => {
      this.top = v
    })
  },
  methods: {
    // 窗口变动事件
    sizeChenge() {
      // this.top = document.body.scrollTop + document.documentElement.scrollTop
      // this.show(this.top)
      // this.bodyWidth = document.body.clientWidth
      this.divBox = this.$refs.main.offsetWidth
      console.log(this.divBox)
      // console.log(this.bodyWidth)
      this.showCd()
    },
    showCd() {
      if (this.divBox >= 1577) {
        this.PlayCdCount = 8
      } else if (this.divBox >= 1041) {
        this.PlayCdCount = 6
      } else {
        this.PlayCdCount = 5
      }
    },
    async getCatlist() {
      const { data: res } = await this.$http.catlist()
      if (res.code !== 200) this.$message.error('数据请求失败')
      console.log(res)
      this.sub = res.sub
      for (const k in res.categories) {
        const params = { name: res.categories[k] }

        params.children = this.sub.filter((subItem) => {
          return subItem.category === Number(k)
        })
        this.categories.push(params)
      }
      console.log(this.categories)
      // console.log(this.categories, '1')
      this.curType = this.$route.query.cat ? this.$route.query.cat : res.all.name
      this.allList = res.all
      this.getMoreTxt()
    },
    selectType(item) {
      if (!this.isClick) return this.$message.error('点击太频繁了')
      if (item.name === this.$route.query.cat) return
      this.$router.push({ path: 'playlists', query: { cat: item.name, order: this.params.order } })
    },
    selectOrder(type) {
      if (!this.isClick) return this.$message.error('点击太频繁了')
      if (type === this.$route.query.order) return
      this.$router.push({ path: 'playlists', query: { cat: this.params.cat, order: type } })
    },
    getMoreTxt() {
      // 查询当前显示的歌单分类详情，如：全部歌单、华语
      const itemInfo = this.sub.find((subItem) => {
        return subItem.name === this.curType
      })
      this.moreTxt = {}
      if (itemInfo) {
        // 若有歌单分类，且分类歌单的索引在更多里面，则渲染moreText数据
        const index = this.categories[itemInfo.category].children.indexOf(itemInfo)
        index >= 11 && (this.moreTxt[itemInfo.category] = itemInfo)
      }
    },
    show(index) {
      console.log(index)
      const dom = document.querySelector(`.more${index}`)
      console.log(dom.style.display)
      if (dom.style.display === 'flex') {
        dom.style.display = 'none'
      } else {
        dom.style.display = 'flex'
      }
      // dom.style.display = 'flex'
    },
    click(item, index) {
      this.selectType(item)
      this.show(index)
    },
    async getPlayList(params, cb) {
      this.isClick = false
      //  'R%26B%2FSoul'
      if (params.cat === 'R&B/Soul') params.cat = 'R%26B%2FSoul'
      const { data: res } = await this.$http.playList(params)
      console.log(res)
      if (res.code !== 200) {
        this.isClick = true
        return this.$message.error('数据请求失败')
      }
      this.isClick = true
      this.total = res.total
      // this.list = res.playlists
      this.list = this.params.offset !== 0 ? [...this.list, ...res.playlists] : res.playlists
      this.load = true
      if (cb) cb()
      // this.list = this.params.offset !== 0 ? [...this.list, ...res.playlists] : res.playlists
      // this.busy = this.list.length >= res.total
      // this.isLoading = !this.busy
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
      this.getPlayList(this.params, () => {
        this.load = true
        this.msg = '加载更多'
      })
    }
  },
  watch: {
    $route(newVal, oldVal) {
      this.total = 0
      const { cat, order } = newVal.query
      console.log(order)
      this.curType = cat || this.allList.name
      this.params = Object.assign({}, { order: 'hot', cat: '', limit: 50, offset: 0 }, { cat: cat || '', order: order || 'hot' })
      this.getMoreTxt()
      this.getPlayList(this.params)
    },
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
  components: {
    PlayCd
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    // document.onscroll = null
    this.$bus.$off('scrollTop')
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.playLists-continer {
  padding: 15px 0;
}
.filter {
  display: flex;
  .filter-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    span {
      font-weight: 700;
    }
    // background-color: pink;
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        text-align: center;
        width: calc(100% / 3);
        font-size: 14px;
        height: 34px;
        // width: 36px;
        padding: 5px;
        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        a {
          color: #050505;
        }
        .moreText {
          position: relative;
          i {
            position: absolute;
            top: 0;
            right: -16px;
          }
        }
      }
      // .more {
      //   position: relative;
      .more {
        // display: flex;
        display: none;
        border: 1px solid #ebeef5;
        position: absolute;
        right: 0;
        top: 168px;
        background-color: #fff;
        // width: auto;
        width: 100%;
        z-index: 2020;
        // white-space: nowrap;

        // overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        // text-overflow: ellipsis;
        div {
          position: absolute;
          border: 5px solid transparent;
          border-bottom: 10px solid #fff;
          top: -15px;
          right: 15%;
        }
      }
    }
  }
}
.tltle {
  margin-top: 15px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
  .h {
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;
  }
  .type {
    position: absolute;
    left: 15%;
    margin-left: 50px;
    font-size: 14px;
    span {
      display: inline-block;
      margin-right: 20px;
      height: 22px;
      cursor: pointer;
    }
  }
}
main {
  width: 100%;
  min-height: 100vh;
}
.main {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 3%;
  li {
    margin-bottom: 25px;
  }
}
.border {
  border-left: 1px solid rgba(0, 0, 0, 0.05);
}
.active {
  border-bottom: 2px solid red;
}
.grid-template-columns6 {
  grid-template-columns: repeat(6, 1fr);
}
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
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
