<template>
  <div class="table-continer">
    <div class="list-header">
      <div class="columnIndex">序号</div>
      <div class="columnSong">歌曲</div>
      <div class="columnSinger">歌手</div>
      <div class="columnAlbum">专辑</div>
      <div class="columnTime">时长</div>
    </div>
    <div class="tableListMain">
      <!-- isPlay(item.id) -->
      <div class="rows" v-for="(item, index) in list" :key="item.id + index" :class="{ background: isbacground(index), vip: item.vip && !item.cloud, nowPlay: nowSong(item.id), license: item.license && !item.cloud }">
        <div class="columnIndex">
          <div class="audio-icon" v-if="isPlay(item.id)">
            <div class="column" style="animation-delay: -1.2s"></div>
            <div class="column"></div>
            <div class="column" style="animation-delay: -1.5s"></div>
            <div class="column" style="animation-delay: -0.9s"></div>
            <div class="column" style="animation-delay: -0.6s"></div>
          </div>
          <em v-if="!isPlay(item.id)">{{ index + 1 }}</em>
          <!-- v-if="!item.license" -->
          <template v-if="!item.license || item.cloud">
            <a href="javascript:;" class="el-icon-video-play play" @click="addSong(item)" v-if="!isPlay(item.id)"></a>
            <a href="javascript:;" class="el-icon-video-pause play" @click="zanting" v-if="isPlay(item.id)"></a>
          </template>
          <div v-if="item.cloud" class="cloud">云盘</div>
        </div>
        <div class="columnSong">
          <div class="name config">
            <router-link :to="{ path: '/song', query: { id: item.id } }" class="config">
              {{ item.name }}
            </router-link>
          </div>
          <template>
            <router-link class="mv-name" :to="{ path: '/mv', query: { id: item.mvId } }" v-if="item.mvId">
              <i class="el-icon-video-camera"></i>
            </router-link>
            <span v-if="item.vip">VIP</span>
          </template>
        </div>
        <div class="columnSinger config">
          <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in item.singer" :key="author.id + k">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
        </div>
        <div class="columnAlbum config">
          <router-link class="songlist-album" :to="{ path: '/album', query: { id: item.album.id } }" v-if="item.album">{{ item.album.name }}</router-link>
        </div>
        <div class="columnTime">
          <span>{{ item.duration | timechenge }}</span>
          <div class="btn" v-if="isPlayList">
            <i class="iconfont icon-del del" @click="delChenge({ index, id: item.id })"></i>
          </div>
          <div class="btn" v-else>
            <i class="el-icon-plus add" @click="onlyAddSong(item)"></i>
            <i class="iconfont icon-collect heart" @click="chengeShowCollet(item)" v-if="!myDetail"></i>
            <!-- delSong(detailId, item.id, index) -->
            <i class="iconfont icon-del heart" @click="DelDialog(detailId, item, index)" v-else></i>
          </div>
        </div>
      </div>
    </div>
    <Collect ref="collect" v-if="showCollet" :close.sync="showCollet"></Collect>
    <div class="delDialog" v-if="showDelDialog">
      <div class="box">
        <div class="title">
          <span>删除歌曲《{{ delName }}》</span>
          <a href="javascript:;" class="el-icon-close" @click="close"></a>
        </div>
        <div class="info">
          <p>是否从此歌单中删除《{{ delName }}》</p>
          <div class="buttons">
            <a href="javascript:;" class="no" @click="close">取消</a>
            <a href="javascript:;" class="yes" @click="delSong(detailId, itemId, index)">确定</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Collect from '@/components/collect/collect.vue'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  props: ['list', 'isPlayList', 'myDetail', 'detailId'],
  data() {
    return {
      Songs: [],
      showCollet: false,
      click: true,
      showDelDialog: false,
      delName: '',
      // 需要删除歌曲的ID
      itemId: '',
      // 需要删除的歌曲的索引
      index: ''
    }
  },
  // created() {
  //   this.Songs = this.list
  //   .map((item) => {
  //     return {
  //       id: String(item.id),
  //       name: item.name,
  //       mvId: item.mv,
  //       singer: item.ar,
  //       album: item.al,
  //       alia: item.alia,
  //       vip: item.fee === 1,
  //       license: item.st === -1,
  //       duration: item.dt,
  //       // url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
  //       publishTime: item.publishTime,
  //       cloud: item.pc
  //     }
  //   })
  //   console.log(this.Songs)
  // },
  methods: {
    isbacground(index) {
      if (index % 2 !== 0) {
        return false
      }
      return true
    },
    ...mapMutations(['zanting', 'showDialog']),
    ...mapActions(['addSong', 'onlyAddSong']),
    delChenge(obj) {
      this.$emit('ondelete', obj)
    },
    chengeShowCollet(item) {
      if (!this.isLogin) return this.showDialog(true)
      this.showCollet = true
      console.log(item.id)
      console.log(this.$refs)
      this.$nextTick(() => {
        this.$refs.collect.Id = item.id
        // console.log(this.$refs.collect)
      })

      // this.$refs.collect.Id = item.Id
    },
    delSong(detailId, itemId, index) {
      // console.log(detailId, itemId, index)
      if (!this.click) return this.$message.error('操作太频繁了，稍微慢一点吧！！')
      this.click = false
      // console.log(id)
      this.delPlayList(detailId, itemId, index)
      this.showDelDialog = false
    },
    async delPlayList(detailId, itemId, index) {
      const { data: res } = await this.$http.addPlayList({ op: 'del', pid: detailId, tracks: itemId })
      console.log(res, '删除')
      if (res.status !== 200) {
        this.click = true
        return this.$message.error('未知错误')
      }
      if (res.body.code !== 200) {
        this.click = true
        return this.$message.error(res.body.message)
      }
      this.click = true
      this.$message.success('删除成功', res.message)
      this.list.splice(index, 1)
      // this.$emit('update:close', false)
    },
    DelDialog(detailId, item, index) {
      this.showDelDialog = true
      this.delName = item.name
      this.itemId = item.id
      this.index = index
      console.log(detailId, item.id, index)
    },
    close() {
      this.showDelDialog = false
    }
  },
  components: {
    Collect
  },
  computed: {
    ...mapState(['playId', 'isPlayed', 'isLogin']),
    isPlay() {
      return (id) => {
        if (this.playId === id && this.isPlayed) {
          return true
        }
      }
    },
    nowSong() {
      return (id) => {
        if (this.playId === id) {
          return true
        }
      }
    }
  }
  // watch: {
  //   list(newVal) {
  //     if (this.isPlayList) {
  //       this.Songs = newVal
  //     } else {
  //       this.Songs = newVal.map((item) => {
  //         return {
  //           id: String(item.id),
  //           name: item.name,
  //           mvId: item.mv,
  //           singer: item.ar,
  //           album: item.al,
  //           alia: item.alia,
  //           vip: item.fee === 1,
  //           license: item.st === -1,
  //           duration: item.dt,
  //           // url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
  //           publishTime: item.publishTime,
  //           cloud: item.pc
  //         }
  //       })
  //     }
  //   }
  // }
}
</script>

<style lang="less" scoped>
.list-header {
  display: flex;
  height: 30px;
  border-bottom: 1px solid #ebeef5;
  font-weight: bold;
  color: #999;
}
.nowPlay {
  background-color: #f0f0f0 !important;
}
.rows {
  position: relative;
  display: flex;
  height: 50px;
  align-items: center;
  font-size: 14px;
  color: #333;
  em {
    font-style: normal;
  }
  .play {
    display: none;
    font-size: 30px;
    color: #999 !important;
    &:hover {
      color: #e60026 !important;
    }
  }
  a {
    color: #333;
  }
  &:hover {
    background-color: #f0f0f0;
    em {
      display: none;
    }
    .play {
      display: block;
    }
    .audio-icon {
      display: none;
    }
    .columnTime {
      span {
        display: none;
      }

      .btn {
        display: flex;
      }
    }
  }
}
.background {
  background-color: #fafafa;
}
.columnIndex {
  width: 70px;
  text-align: center;
}
.columnSong {
  display: flex;
  width: 25%;
  // background-color: red;
  // display: flex;
  // align-items: center;
  vertical-align: middle;
  // flex: 1.5;
  .name {
    // width: 50%;
    overflow: hidden;
  }
  i {
    margin-left: 8px;
    margin-right: 8px;
    font-size: 20px;
    vertical-align: middle;
  }
  a {
    vertical-align: middle;
  }
  span {
    margin-left: 15px;
    vertical-align: middle;
  }
}
.columnSinger {
  flex: 1.5;
}
.columnAlbum {
  flex: 1.5;
}
.columnTime {
  width: 50px;
  text-align: center;
  .btn {
    position: relative;
    // background-color: brown;
    // width: 50%;
    font-size: 20px;
    display: none;
    align-items: center;
    // justify-content: space-around;
    .add {
      cursor: pointer;
      &:hover {
        color: #e60026;
      }
    }
    .del {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
      font-size: 20px;
      &:hover {
        color: #e60026;
      }
    }
    .heart {
      cursor: pointer;
      margin-left: 5px;
      font-size: 20px;
      &:hover {
        color: #e60026;
      }
    }
  }
}
.config {
  // width: 50px;
  // background-color: red;
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flex {
  // width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  // height: 100%;
}
.vip {
  color: red !important;
  a {
    color: red !important;
  }
}
.a {
  width: calc(100%-35px);
}
.license {
  // position: relative;
  // &::after {
  //   font-weight: 600;
  //   letter-spacing: 100px;
  //   content: '无版权 ';
  //   font-size: 30px;
  //   line-height: 50px;
  //   text-align: center;
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   cursor: not-allowed;
  // }
  color: #ccc;
  a {
    color: #ccc;
  }
}
.cloud {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 12px;
  font-size: 10px;
  color: #ccc;
  user-select: none;
}
.delDialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
    .info {
      display: flex;
      flex-direction: column;
      padding: 0 10px;
      width: 100%;
      height: 265px;
      // background-color: pink;
      justify-content: space-between;
      p {
        margin-top: 35px;
        font-size: 20px;
        text-align: center;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.7);
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      .buttons {
        display: flex;
        justify-content: space-between;
        padding: 0 80px;
        margin-bottom: 50px;
        a {
          // background-color: red;
          height: 30px;
          width: 100px;
          border-radius: 15px;
          text-align: center;
          line-height: 30px;
          color: rgba(0, 0, 0, 0.7);
          font-size: 15px;
          font-weight: 600;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        .yes {
          background-color: rgba(255, 0, 0, 0.5);
        }
        .no {
          background-color: #dcdcdc;
        }
      }
    }
    .el-icon-close {
      font-size: 20px;
      color: #f5f5f5;
    }
  }
}
</style>
