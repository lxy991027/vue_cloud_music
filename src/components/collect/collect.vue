<template>
  <div class="collect-continer">
    <div class="box">
      <div class="title">
        <span>收藏到歌单</span>
        <a href="javascript:;" class="el-icon-close" @click="close"></a>
      </div>
      <ul class="info">
        <li v-for="(item, index) in createdList" :key="item.id + index" :class="{ background: isbacground(index), 'margin-bottom': index < createdList.length }" @click="setSong(item.id)">
          <div class="img">
            <img :src="item.coverImgUrl" alt="" />
          </div>
          <div class="info">
            <span>{{ item.name }}</span>
            <em>{{ item.trackCount }}首</em>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      Id: '亲，这条消息你永远都不会看到',
      createdList: [],
      click: true
    }
  },
  created() {
    console.log(this.Id, '???')
    this.getUserPlayList()
  },
  methods: {
    close() {
      this.$emit('update:close', false)
    },
    isbacground(index) {
      if (index % 2 !== 0) {
        return true
      }
      return false
    },
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
      // if (this.$route.path !== '/myuser/playlist') {
      //   this.$router.push({ path: '/myuser/playlist', query: { id: this.createdList[0].id } })
      // }

      // this.collectList = res.playlist.filter((item) => {
      //   return item.subscribed
      // })
      // console.log(this.collectList)
      // if (!this.id && this.$route.path !== '/my/favorite') {
      //   this.id = this.createdList[0].id
      //   this.$router.push({ path: 'my/playlist', query: { id: this.id } })
      // }
    },
    setSong(id) {
      if (!this.click) return this.$message.error('操作太频繁了，稍微慢一点吧！！')
      this.click = false
      console.log('歌单ID', id)
      console.log(this.Id)
      if (this.Id !== '亲，这条消息你永远都不会看到') {
        this.addPlayList(id)
      }
    },
    async addPlayList(id) {
      const { data: res } = await this.$http.addPlayList({ pid: id, tracks: this.Id })
      console.log(res)
      if (res.status !== 200) {
        this.click = true
        return this.$message.error('未知错误')
      }
      if (res.body.code !== 200) {
        this.click = true
        return this.$message.error(res.body.message)
      }
      this.$message.success('收藏成功', res.message)
      this.$emit('update:close', false)
    }
  },
  computed: {
    ...mapState(['isLogin', 'userInfo'])
  }
}
</script>

<style lang="less" scoped>
.collect-continer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  .box {
    width: 500px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    .title {
      padding: 0 10px;
      background-color: #2d2d2d;
      width: 100%;
      height: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        color: #f5f5f5;
        font-weight: bold;
        font-size: 14px;
      }
    }
  }
}
.el-icon-close {
  font-size: 20px;
  color: #f5f5f5;
}
.info {
  width: 100%;
  height: 265px;
  overflow-y: auto;
  li {
    padding: 0 10px;
    display: flex;
    align-items: center;
    // border-bottom: 1px solid #000;
    width: 100%;
    height: 60px;
    border-radius: 10px;
    cursor: pointer;
    // background-color: #f5f5f5;
    // background-color: pink;
    .img {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
      border-radius: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      padding: 1px 0 1px 10px;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      // width: 80%;
      height: 100%;
      // background-color: red;
      em {
        font-size: 12px;
        font-style: normal;
      }
    }
    &:hover {
      background-color: #dcdcdc;
    }
  }
}
.background {
  background-color: #f5f5f5;
}
.margin-bottom {
  margin-bottom: 2px;
}
</style>
