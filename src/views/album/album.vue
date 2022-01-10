<template>
  <div class="albunm-continer">
    <div class="album-cover">
      <div class="w">
        <div class="Top">
          <div class="top-box">
            <div class="img">
              <img :src="details.picUrl" alt="" />
            </div>
            <div class="text">
              <div class="album-title">
                {{ details.name }}
                <span>{{ '#' + details.type }}</span>
              </div>
              <div class="album-singer">
                歌手：<router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in details.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
              </div>
              <div class="album-time">发行时间：{{ details.publishTime | formats }}</div>
              <div class="album-company">发行公司：{{ details.company }}</div>
              <h5>歌单简介</h5>
              <div class="songText">
                {{ details.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="album-info">
      <div class="w album-info-config">
        <div class="left">
          <div class="count">
            <span>包含歌曲列表</span>
            <em>{{ details.size + '首歌' }}</em>
          </div>
          <div class="songTable">
            <song-list :list="songList"></song-list>
          </div>
          <Comments :id="id" :type="type"></Comments>
        </div>
        <div class="right">
          <h3 class="aside-title">{{ artistsName }}的其他专辑 <router-link v-if="details.artists" :to="{ path: '/allCd', query: { id: artistsId } }" class="album-more">全部>></router-link></h3>
          <OtherCd :list="hotAlbums"></OtherCd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import songList from '@/components/songList/song-list.vue'
import Comments from '@/components/comments/comments.vue'
import OtherCd from '@/components/OtherCd/OtherCd.vue'
export default {
  data() {
    return {
      id: this.$route.query.id,
      type: 3, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
      details: [],
      songList: [],
      hotAlbums: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getAlbum()
    },
    // 相关歌单推荐
    async getAlbum(params) {
      const { data: res } = await this.$http.album({ id: this.id })

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      // console.log(res)
      this.details = res.album
      console.log(this.details.artists[0].name)
      this.songList = this.$format._format(res.songs)
      // .map((item) => {
      //   return {
      //     id: String(item.id),
      //     name: item.name,
      //     mvId: item.mv,
      //     singer: item.ar,
      //     album: item.al,
      //     alia: item.alia,
      //     vip: item.fee === 1,
      //     license: item.st === -1,
      //     duration: item.dt,
      //     url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
      //     publishTime: item.publishTime
      //   }
      // })
      // console.log(res.songs)
      this.getArtistAlbum()
    },
    async getArtistAlbum() {
      const { data: res } = await this.$http.artistAlbum({ id: this.details.artists[0].id, limit: 5 })

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      this.hotAlbums = res.hotAlbums
      // console.log(this.hotAlbums)
    }

    // this.songList = this._formatSongs(res.songs)
    // this.getArtistAlbum()
  },
  computed: {
    artistsName() {
      if (this.details.artists) return this.details.artists[0].name
      return '...'
    },
    artistsId() {
      if (this.details.artists) return this.details.artists[0].id
      return '...'
    }
  },
  components: {
    songList,
    Comments,
    OtherCd
  },
  watch: {
    $route: {
      handler() {
        this.id = this.$route.query.id
        this.init()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.Top {
  margin-top: 15px;
  position: relative;
  width: 100%;
  padding-top: 30%;
  .top-box {
    display: flex;
    position: absolute;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: pink;
    .img {
      position: relative;
      height: 100%;
      width: 30%;
      // padding-left: 10%;
      // background-color: orange;
      img {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        width: 75%;
        height: 75%;
      }
      &::before {
        position: absolute;
        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);
        content: '';
        width: 75%;
        height: 75%;
        // background-color: orangered;
        background-image: url('../../assets/disc.png');
        background-size: contain;
      }
    }
    .text {
      width: 70%;
      height: 100%;
      padding-left: 10px;
      // background-color: red;
      overflow: hidden;
      .album-title {
        padding-bottom: 20px;
        font-size: 24px;
        font-weight: bold;

        span {
          display: inline-block;
          font-size: 14px;
          font-weight: normal;
          color: #e60026;
        }
      }
      .album-singer,
      .album-time,
      .album-company {
        line-height: 22px;
        font-size: 14px;
        color: #999;
        a {
          color: #333;
        }
      }
      .songText {
        // background-color: pink;
        margin-top: 10px;
        height: 55%;
        overflow-y: auto;
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

.album-info {
  // background-color: #999;
  margin-top: 15px;
  background-color: #fff;
  // height: 1000px;
  .album-info-config {
    display: flex;
    .right {
      width: 251px;
      // height: 100vh;
      // background-color: pink;
      margin-left: 15px;
      flex-shrink: 0;
    }
    .left {
      width: 100%;
      .songTable {
        margin-top: 15px;
      }
    }
  }
  .count {
    span {
      font-size: 24px;
      line-height: 24px;
      font-weight: normal;
    }
    em {
      font-style: normal;
      margin-left: 40px;
      font-size: 13px;
      color: #999;
    }
  }
}
.aside-title {
  // margin-left: 5px;
  font-weight: normal;
  a {
    margin-top: 5px;
    float: right;
    font-size: 12px;
    color: #666;
  }
}
</style>
