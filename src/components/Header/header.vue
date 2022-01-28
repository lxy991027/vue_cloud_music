<template>
  <header class="container-header">
    <div class="filter"></div>
    <div class="header">
      <div class="min-header" :style="{ left: `-${left}px` }">
        <div>
          <h1 class="logo">
            <router-link to="/home">网易云音乐</router-link>
          </h1>
          <ul class="tab">
            <li v-for="(item, index) in tabList" :key="index">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </li>
          </ul>
        </div>

        <div class="right">
          <div class="input" id="show" @keyup.enter="up">
            <el-input placeholder="请输入歌名、歌词、歌手或专辑" clearable ref="input" v-model="input3" class="input-with-select" @focus="showRank" @blur="showRanks" @input="getSerachSuggest">
              <el-button slot="append" icon="el-icon-search" @click="up"></el-button>
            </el-input>
            <div class="rank" v-if="(Rank && input3 === '') || suggestInfo.order">
              <template v-if="input3 === ''">
                <h6>热门搜索</h6>
                <ul>
                  <li v-for="(item, index) in serachHot" :key="index" @click="jumpSearch(item)">
                    <a href="javascript:;">
                      <i :class="{ top1: index === 0, top2: index === 1, top3: index === 2 }">{{ index + 1 }}.</i>
                      {{ item.first }}
                    </a>
                  </li>
                </ul>
              </template>
              <template v-else>
                <ul class="search">
                  <li v-for="(item, index) in suggestInfo.order" :key="index">
                    <h6>{{ listType[item] }}</h6>
                    <ul>
                      <li v-for="(val, k) in suggestInfo[item]" :key="k">
                        <a href="javascript:;" class="text" @click="jumpPage(val, item)">
                          {{ val.name }}
                          <template v-if="item === 'songs'">
                            -<span v-for="(a, i) in val.artists" :key="i">{{ a.name + (i !== 0 ? ' / ' : '') }}</span>
                          </template>
                          <template v-else-if="item === 'albums'">
                            -<span>{{ val.artist.name }}</span>
                          </template>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </template>
            </div>
          </div>

          <!-- <el-button round class="btn" @click="logout">退出登录</el-button> -->
          <div class="user-box">
            <a href="Javascript:;" @click="dialog" v-if="!isLogin">登录</a>
            <div class="user" v-else>
              <img :src="userInfo.avatarUrl" alt="" />
              <div class="userMenu">
                <a href="javascript:;" @click="logout">
                  <i>注销</i>
                </a>
                <!-- <el-button round class="btn" @click="logout">退出登录</el-button> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
// mapMutations
export default {
  created() {
    // this.getSearchHot()
    // this.getSerachSuggest()
  },
  mounted() {
    document.addEventListener('click', (e) => {
      e = e || window.event // 浏览器兼容性
      var elem = e.target || e.srcElement
      while (elem) {
        // 循环判断至跟节点，防止点击的是div子元素
        if (elem.id && elem.id === 'show') {
          // console.log(elem)
          return
        }
        elem = elem.parentNode
      }
      this.Rank = false
    })
    this.$bus.$on('scrollleft', (v) => {
      this.left = v
    })
  },
  data() {
    return {
      tabList: [
        {
          name: '发现音乐',
          path: '/home'
        },
        {
          name: '排行榜',
          path: '/rank'
        },
        {
          name: '歌单',
          path: '/playlists'
        },
        {
          name: 'MV',
          path: '/mvlist'
        },
        {
          name: '歌手',
          path: '/artist'
        },
        {
          name: '我的音乐',
          path: '/myuser'
        }
      ],
      input3: '',
      serachHot: [],
      Rank: false,
      listType: {
        songs: '单曲',
        artists: '歌手',
        albums: '专辑',
        playlists: '歌单'
      },
      suggestInfo: {},
      left: 0
    }
  },
  methods: {
    downs() {
      console.log('123')
    },
    ...mapMutations(['showDialog', 'setUserInfo', 'setLogin']),
    dialog() {
      this.showDialog(true)
      console.log(this.isLogin)
    },
    async abc() {
      const { data: res } = await this.$http.logsss()
      console.log(res)
      // console.log(document.cookie)
      // console.log(document.cookie.encodeURIComponentdocument())
    },
    async logout() {
      const { data: res } = await this.$http.logout()
      console.log(res, '退出登录')
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }

      this.$message.success('退出成功')
      // window.sessionStorage.removeItem('isLogin')
      // window.sessionStorage.removeItem('token')
      // window.sessionStorage.removeItem('cookie')
      // window.sessionStorage.removeItem('userInfo')
      this.setLogin(false)
      this.setUserInfo(null)

      // if (this.$route.path.indexOf('/my') >= 0) {
      //     this.$router.push({ path: '/' })
      // }
    },
    // 热门搜索
    async getSearchHot() {
      const { data: res } = await this.$http.serachHot()

      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }

      this.serachHot = res.result.hots
      console.log(this.serachHot, '热门搜索')
    },
    showRank() {
      this.Rank = true
      // setTimeout(() => {
      //   document.onclick = () => {
      //     this.Rank = false
      //     document.onclick = null
      //   }
      // }, 100)
      // if (this.Rank) {
      //   this.Rank = false
      // } else {
      //   this.Rank = true
      // }
      if (this.input3 !== '') {
        return
      }
      if (this.serachHot.length === 0) {
        console.log('123')
        this.getSearchHot()
      }
    },
    showRanks() {
      // setTimeout(() => {
      // this.Rank = false
      // }, 90)
    },
    async getSerachSuggest() {
      if (this.input3 === '') return
      const { data: res } = await this.$http.serachSuggest({ keywords: this.input3 })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }

      this.suggestInfo = res.result
    },
    // 搜索建议列表，点击后跳转到相对应的落地页
    jumpPage(item, type) {
      console.log('调用了')
      this.input3 = item.name
      switch (type) {
        case 'songs':
          this.$router.push({ path: '/song', query: { id: item.id } })
          break
        case 'artists':
          this.$router.push({ path: '/singer', query: { id: item.id } })
          break
        case 'albums':
          this.$router.push({ path: '/album', query: { id: item.id } })
          break
        case 'playlists':
          this.$router.push({ path: '/detail', query: { id: item.id } })
          break
      }
      // this.isShowSearch = false
      this.Rank = false
    },
    // 默认热门搜索列表，点击后台跳转到搜索结果页面
    jumpSearch(item) {
      // this.isShowSearch = false
      this.input3 = item.first
      if (item.first === this.$route.query.key) {
        return
      }
      this.$router.push({ path: '/search', query: { key: item.first, type: '1' } })
      this.Rank = false
    },
    up() {
      this.Rank = false
      this.$refs.input.blur()
      this.$router.push({ path: '/search', query: { key: this.input3, type: '1' } })
    }
  },
  computed: {
    ...mapState(['isLogin', 'userInfo'])
  },
  beforeDestroy() {
    // document.onscroll = null
    this.$bus.$off('scrollleft')
    console.log('销毁了')
  }
}
</script>

<style lang="less" scoped>
.container-header {
  position: relative;
  width: 100%;
  height: 100%;
  // background-color: #242424;
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #242424;
  }
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;

    margin: 0 auto;
    width: 80%;
    min-width: 1100px;
    z-index: 10;
    .min-header {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
    div {
      display: flex;
    }
    .right {
      // background-color: red;
      align-items: center;
      .input {
        position: relative;
        .rank {
          .text {
            overflow: hidden !important;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .search {
            margin-top: 0;
          }
          // display: block;
          color: #606266;
          // -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
          // backdrop-filter: saturate(1.2) blur(24px) !important;
          h6 {
            font-size: 18px;
          }
          width: 100%;
          background-color: #fff;
          position: absolute;
          flex-direction: column;
          top: 37px;
          left: 0;
          padding: 10px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          // box-shadow: ;
          border-radius: 10px;
          border: 1px solid #ebeef5;
          ul {
            margin-top: 10px;
            li {
              color: #606266;
              padding: 4px 0;
              font-size: 14px;
              a {
                color: #606266;
                display: block;
                width: 100%;
              }
              i {
                font-style: normal;
              }
            }
          }
        }
      }
    }
  }
}
.logo {
  width: 176px;
  height: 55px;
  padding-right: 20px;
  a {
    display: block;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/topbar.png');
    background-position: 0 -7px;
    text-indent: -9999px;
  }
}
.tab {
  display: flex;
  a {
    display: block;
    padding: 0 19px;
    font-size: 14px;
    color: #ccc;
    line-height: 55px;
    height: 55px;
  }
}
.el-input {
  // margin-left: 85px;
  // margin-top: 19px;
  width: 208px;
  height: 32px;
  position: relative;
  border-radius: 16px;
  font-size: 12px;
  color: #9b9b9b;
}
/deep/.el-input__inner {
  border-radius: 16px !important;
  border: 0;
  padding: 0;
  line-height: 32px;
  padding-left: 30px;
  // padding-top: 8px;
  height: 32px;
}
/deep/.el-input-group__append {
  position: absolute;
  top: 6px;
  left: 28px;
}
/deep/.el-input-group__append {
  border: 0;
  // width: 0px;
  padding: 0;
  background-color: transparent;
}
.el-button {
  padding: 0;
  margin: 0;
}
.btn {
  width: 90px;
  height: 32px;
  padding: 0 !important;
  // margin: 0 0 0 12px;
  border: 1px solid #4f4f4f;
  background-color: transparent;
  font-size: 12px;
  color: #ccc;
}
.user-box {
  display: flex;
  align-items: center;
  margin-left: 20px;
  font-size: 12px;
  width: 45px;
  height: 45px;

  a {
    color: #787878;
    // line-height: 27px;
    // height: 20px;
    // background-color: pink;
  }
  .user {
    width: 100%;
    height: 100%;
    position: relative;
    &:hover {
      .userMenu {
        display: block;
      }
      img {
        transform: rotate(1440deg);
      }
    }
    .userMenu {
      display: none;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 12px;
        i {
          font-style: normal;
        }
      }
    }
    // background: pink;

    // overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transition: all 1s;
    }
  }
}
@supports (-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px)) {
  .filter {
    background-color: transparent !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
    background-color: rgba(36, 36, 36, 0.7) !important;
  }
  .rank {
    background-color: rgba(255, 255, 255, 0.6) !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
    border: 0 !important;
  }
}
.top1 {
  font-weight: bold;
  color: #ff0000;
}
.top2 {
  font-weight: bold;
  color: rgba(255, 0, 0, 0.6);
}
.top3 {
  font-weight: bold;
  color: rgba(255, 0, 0, 0.4);
}
</style>
