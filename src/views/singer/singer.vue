<template>
  <div class="singer-continer">
    <div class="Top" ref="headerTop">
      <div class="w">
        <div class="singer-details w">
          <!-- 数据驱动视图，数据一变化就销毁原来的dom元素然后新建 -->
          <!-- <div>{{ artist }}</div> -->
          <div class="singer-details-box" v-for="item in artist" :key="item.id">
            <div class="singrImg">
              <img :src="item.img1v1Url + '?param=300y300'" :alt="item.name" />
            </div>
            <div class="singerText">
              <div class="name-title">
                <h1>{{ item.name }}</h1>
                <div class="collect" v-if="userInfo !== null">
                  <!-- {{ userInfo }} -->
                  <a href="javascript:; " :class="{ no: item.followed, yes: !item.followed }" @click="getArtistSub(item)"><i class="iconfont icon-collect"></i>{{ item.followed ? '取消收藏' : '收藏' }}</a>
                </div>
              </div>
              <div class="Text">
                {{ item.briefDesc ? item.briefDesc : '暂无简介' }}
                <!-- 没有更多信息时隐藏更多按钮 -->
                <a href="javascript:;" @click="showDialog" v-if="introduction.length">更多>>></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tableList" ref="tableListRef">
      <div class="w">
        <div class="topTitle">
          <h1>作品集</h1>
          <span v-for="item in artist" :key="item.id"> <Tag :list="option" :settingList="optionSetting" :tagValue.sync="optionChenge" @cilckTag="optiomCilck"></Tag></span>
        </div>
        <div>
          <router-view></router-view>
        </div>
        <!-- <template class="list"> -->
        <!-- <song-list v-show="optionChenge === '热门作品'" :list="hotSongs"></song-list> -->
        <!-- </template> -->
        <!-- <template> -->
        <!-- <div class="cdBox">
          <NewCd v-show="optionChenge === '所有专辑'" v-for="item in hotAlbums" :key="item.id" :NewCdList="item"></NewCd>
        </div> -->
        <!-- <div class="load" ref="msg">{{ msg }}</div> -->
        <!-- </template> -->
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="50%" :show-close="false">
      <div v-for="(item, index) in introduction" :key="index" class="genduo">
        <h3>{{ item.ti }}</h3>
        <p :class="[index === introduction.length - 1 ? '' : 'marginBottom', '']">{{ item.txt }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import songList from '@/components/songList/song-list.vue'
import Tag from '@/components/Tag/tag.vue'
import { mapState } from 'vuex'
// import NewCd from '@/components/NewCdList/NewCd.vue'
export default {
  mounted() {
    this.sizeChenge()
    window.addEventListener('resize', this.sizeChenge)
    document.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
  },
  data() {
    return {
      Uid: this.$route.query.id,
      // 歌手详情
      artist: [],
      // 控制对话框的显示与隐藏
      dialogVisible: false,
      // 更多歌手信息
      introduction: [],

      // 选项
      option: [
        {
          name: '热门作品',
          code: '/songList'
        },
        {
          name: '所有专辑',
          code: '/allCd'
        },
        {
          name: '相关MV',
          code: '/songListMv'
        }
      ],
      optionSetting: {
        label: 'name',
        keys: 'name',
        type: 'code',
        nowStatus: this.$route.path
      },
      optionChenge: '', // TopSize: 0,
      // hotAlbums: [],
      // limit: 24,
      // offset: 0,
      // total: 0,
      // msg: '下拉加载',
      // top: 0,
      // load: true,
      // page: 0

      path: '',
      showTag: true
    }
  },
  created() {
    this.init()
    console.log()
    // setInterval(() => {
    //   console.log(this.Uid)
    // }, 1000)
  },
  methods: {
    sizeChenge() {
      // 监听窗口大小变化事件

      // this.TopSize = console.log(this.TopSize)
      setTimeout(() => {
        this.$refs.tableListRef.style.marginTop = this.$refs.headerTop.offsetHeight + 'px'
      }, 1)
      this.$refs.headerTop.style.width = this.$refs.tableListRef.offsetWidth + 'px'
    },
    // 初始化
    init() {
      this.getArtistDesc()
      this.getArtist()
      // this.getArtistAlbum()
    },

    async getArtistDesc() {
      const { data: res } = await this.$http.artistDesc({ id: this.$route.query.id })
      // console.log(res)
      if (res.code !== 200) this.$message('更多歌手信息获取失败')
      this.introduction = res.introduction
      // console.log(this.introduction.length)
    },
    async getArtist() {
      this.artist = []
      const { data: res } = await this.$http.artists({ id: this.$route.query.id })
      console.log(res)
      if (res.code !== 200) return this.$message.error('歌手信息获取失败')

      this.artist.push(res.artist)
    },

    showDialog() {
      // 展示对话框
      this.dialogVisible = true
    },
    timechenge(mss) {
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
      minutes = minutes < 10 ? '0' + minutes : minutes
      var seconds = parseInt((mss % (1000 * 60)) / 1000)
      seconds = seconds < 10 ? '0' + seconds : seconds
      return minutes + ':' + seconds
    },
    // 点击时间监听
    optiomCilck() {
      console.log(this.optionChenge)
      if (this.optionChenge === '/allCd') {
        this.$router.push('/allCd?id=' + this.Uid)
      } else if (this.optionChenge === '/songList') {
        this.$router.push('/songList?id=' + this.Uid)
      } else {
        this.$router.push('/songListMv?id=' + this.Uid)
      }
    },
    chengePach() {
      if (this.$route.path === '/allCd') {
        this.$router.push('/allCd?id=' + this.Uid)
      } else if (this.$route.path === '/songList') {
        this.$router.push('/songList?id=' + this.Uid)
      } else {
        this.$router.push('/songListMv?id=' + this.Uid)
      }
    },
    async getArtistSub(item) {
      console.log(item.followed)
      let t = 0
      t = item.followed ? 0 : 1
      console.log(t)
      const { data: res } = await this.$http.artistSub({ id: this.Uid, t: t })
      console.log(res)
      if (res.code !== 200) return t === 0 ? this.$message.success('取消收藏失败') : this.$message.success('收藏失败')

      if (t === 0) {
        item.followed = false
        this.$message.success('取消收藏成功')
      } else {
        item.followed = true
        this.$message.success('收藏成功')
      }

      // this.getArtists()
    }
  },
  components: {
    // songList,
    Tag
    // NewCd
  },
  computed: {
    ...mapState(['userInfo'])
  },
  watch: {
    '$route.query.id': {
      handler() {
        this.Uid = this.$route.query.id
        // this.chengePach()
        // this.showTag = false
        // this.optionSetting.nowStatus = this.$route.path
        // this.showTag = true
        this.init()
      }
      // deep: true
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.sizeChenge)
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.singer-continer {
  width: 100%;

  background-color: #f5f5f5;
}
.Top {
  margin-top: 70px;
  position: fixed;
  // width: 100%;
  top: 0;
  left: 0;

  // z-index: 1;
  padding-bottom: 15px;
}
.singer-details {
  position: relative;
  // background-color: red;
  width: 100%;
  padding-top: 30%;
  // background-color: #f8f8f8;
  .singer-details-box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: blue;
    .singrImg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30%;
      height: 100%;
      // background-color: blueviolet;

      img {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        overflow: hidden;
        transition: 0.3s all;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .singerText {
      display: flex;
      flex-direction: column;
      width: 70%;
      height: 100%;

      .name-title {
        // font-size: 0;
        padding: 0 15px;
        display: flex;
        align-items: center;
        width: 100%;
        height: 20%;
        .collect {
          margin-left: 15px;
          a {
            padding: 0 17px;
            position: relative;
            display: block;
            width: 110px;
            height: 30px;
            border-radius: 15px;
            line-height: 30px;
            text-align: right;
            background-color: pink;
            font-size: 15px;
            color: #f5f5f5;
            i {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              left: 10px;
              font-size: 15px;
            }
          }
          .no {
            background-color: #fa7a7a;
          }
          .yes {
            background-color: #ffffff;
            color: #000;
            padding: 0 35px;
          }
        }
        h1 {
          display: inline-block;
          // height: 100%;
          // background-color: chocolate;
          font-size: 40px;
          // vertical-align: middle;
        }
      }
      .Text {
        width: 100%;
        height: 80%;
        overflow-y: auto;

        padding: 15px;
        color: #999;
        a {
          color: #ff614e;
          white-space: nowrap;
        }
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
    }
  }
}
.genduo {
  h3 {
    margin-bottom: 10px;
  }
  p {
    // margin-bottom: 10px;
    line-height: 30px;
  }
}
.marginBottom {
  margin-bottom: 10px;
}
/deep/.el-dialog__header {
  padding: 0;
}
.tableList {
  position: relative;
  // margin-top: 28%;
  width: 100%;
  background-color: #ffffff;
  z-index: 9;
  padding-bottom: 15px;
}
.topTitle {
  width: 500px;
  // background-color: red;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  h1 {
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;
  }
  span {
    // display: block;
    width: 391px;
  }
}
</style>
