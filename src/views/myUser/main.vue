<template>
  <div class="w">
    <div class="left">
      <Menu title="我创建的歌单" :list="createdList" v-if="createdList.length"></Menu>
      <Menu title="我收藏的歌单" :list="collectList" v-if="collectList.length"></Menu>

      <div class="oneMenu" @click="Jump(2)">
        <span>我收藏的歌手</span>
        <i class="iconfont icon-arrow rotate" :class="{ rotate: menuHeight === 0 }"></i>
      </div>
      <div class="oneMenu" @click="Jump(3)">
        <span>我收藏的专辑</span>
        <i class="iconfont icon-arrow rotate" :class="{ rotate: menuHeight === 0 }"></i>
      </div>
      <div class="oneMenu" @click="Jump(1)">
        <span>我的音乐云盘</span>
        <i class="iconfont icon-arrow rotate" :class="{ rotate: menuHeight === 0 }"></i>
      </div>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Menu from './menu.vue'
export default {
  // 监听属性 类似于data概念
  data() {
    return {
      createdList: [],
      collectList: [],
      menuHeight: ''
    }
  },

  components: {
    Menu
  },
  computed: {
    ...mapState(['isLogin', 'userInfo'])
  },

  created() {
    if (this.isLogin) {
      this.getUserPlayList()
    }
  },
  methods: {
    async getUserPlayList() {
      const { data: res } = await this.$http.playlistUser({ uid: this.userInfo.userId, limit: '', offset: '' })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }
      this.createdList = res.playlist.filter((item) => {
        return !item.subscribed
      })
      console.log(this.createdList, '????')
      if (this.$route.path !== '/myuser/playlist') {
        this.$router.push({ path: '/myuser/playlist', query: { id: this.createdList[0].id } })
      }

      this.collectList = res.playlist.filter((item) => {
        return item.subscribed
      })
      console.log(this.collectList)
      // if (!this.id && this.$route.path !== '/my/favorite') {
      //   this.id = this.createdList[0].id
      //   this.$router.push({ path: 'my/playlist', query: { id: this.id } })
      // }
    },
    Jump(type) {
      if (type === 1) {
        // cloudSongList
        if (this.$route.path === '/myuser/cloudSongList') return
        this.$router.push({ path: '/myuser/cloudSongList' })
      } else if (type === 2) {
        if (this.$route.path === '/myuser/favorite') return
        this.$router.push({ path: '/myuser/favorite' })
      } else {
        if (this.$route.path === '/myuser/albumSunlist') return
        this.$router.push({ path: '/myuser/albumSunlist' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.oneMenu {
  width: 100%;
  height: 40px;
  // background-color: pink;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  background-color: #f0f0f0;
  margin-bottom: 5px;
  cursor: pointer;
  span {
    font-size: 14px;
  }
  i {
    transition: all 0.5s;
  }
}
.w {
  display: flex;
  padding-top: 15px;
}
.left {
  width: 251px;
  // height: 100vh;
  // background-color: pink;
  flex-shrink: 0;
  margin-right: 15px;
}
.right {
  width: 100%;
  min-width: 0;
  // height: 100vh;
  // background-color: red;
}
.rotate {
  transform: rotate(-90deg);
}
</style>
