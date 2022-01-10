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
      <div class="rows" v-for="(item, index) in list" :key="item.id" :class="{ background: isbacground(index), vip: item.vip && !item.cloud, nowPlay: nowSong(item.id), license: item.license && !item.cloud }">
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
          <template>
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
          <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in item.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
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
            <i class="iconfont icon-collect heart"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  props: ['list', 'isPlayList'],
  data() {
    return {
      Songs: []
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
    ...mapMutations(['zanting']),
    ...mapActions(['addSong', 'onlyAddSong']),
    delChenge(obj) {
      this.$emit('ondelete', obj)
    }
  },
  computed: {
    ...mapState(['playId', 'isPlayed']),
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
}
</style>
