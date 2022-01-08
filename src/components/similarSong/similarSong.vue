<template>
  <div class="similarSong-continer">
    <h6>相似歌曲</h6>
    <ul>
      <li v-for="item in list" :key="item.id">
        <div class="simi-info">
          <router-link class="simi-name" :to="{ path: '/song', query: { id: item.id } }">
            {{ item.name }}
          </router-link>
          <div class="simi-author">
            <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song-author" v-for="(author, k) in item.singer" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
          </div>
        </div>
        <div class="simi-song-status">
          <i v-if="item.vip" class="iconfont icon-vip"></i>
          <i v-else @click="plyaing(item)" :class="['iconfont', playSimiIcon(item)]"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  props: ['list'],
  methods: {
    ...mapActions(['addSong', 'onlyAddSong']),
    ...mapMutations(['zanting']),
    plyaing(item) {
      // console.log(item)
      if (item.id === this.playId && this.isPlayed) return this.zanting()
      this.addSong(item)
    }
  },
  computed: {
    ...mapState(['playId', 'isPlayed']),
    playSimiIcon() {
      return (item) => {
        return String(item.id) === this.playId && this.isPlayed ? 'icon-audio-pause' : 'icon-audio-play'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.similarSong-continer {
  width: 100%;
  // height: 500px;
  // background-color: saddlebrown;
  h6 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
  }
  ul {
    li {
      display: flex;
      padding-top: 5px;
      border-bottom: 1px solid #f2f2f2;
      margin-bottom: 5px;
      .simi-name {
        line-height: 20px;
        font-size: 12px;
        color: #000;
      }
      .simi-author {
        font-size: 0;

        a {
          font-size: 12px;
          color: #999;
        }
      }
      .simi-item {
        display: flex;
        padding-top: 5px;
        border-bottom: 1px solid #f2f2f2;
        margin-bottom: 5px;
      }
      .simi-info {
        flex: 1;
      }
      .simi-song-status {
        line-height: 48px;
        .icon-vip {
          color: #e60026;
        }
        i {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
