<template>
  <div class="detail-continer">
    <div class="w bigBox">
      <div class="left">
        <div class="TopText">
          <div class="box">
            <div class="img">
              <img :src="details.coverImgUrl" alt="" />
            </div>
            <div class="info">
              <div class="cover-title">
                <span> {{ details.name }}</span>
                <!-- {{ details.creator.userId }}//{{ this.userInfo.userId }} -->
                <template v-if="details.creator && userInfo !== null">
                  <div class="collect" v-if="!(details.creator.userId === userInfo.userId)">
                    <!-- @click="subAlbum(dynamic)" -->
                    <a href="javascript:; " :class="{ no: details.subscribed, yes: !details.subscribed }" @click="subAlbum(details)"><i class="iconfont icon-collect"></i>{{ details.subscribed ? '取消收藏' : '收藏' }}</a>
                  </div>
                </template>
              </div>
              <div class="cover-author" v-if="details.creator">
                <!-- <img :src="details.creator.avatarUrl" class="cover-avatar"></img> -->
                <router-link :to="{ path: '/user', query: { id: details.creator.userId } }">
                  <img :src="details.creator.avatarUrl" alt="" />
                  <div class="cover-name">{{ details.creator.nickname }}</div>
                </router-link>
                <div class="cover-date">{{ details.createTime | formats }}</div>
                <div class="cover-tags" v-if="details.tags">
                  <router-link :to="{ path: '/playlists', query: { cat: tag } }" class="tag" v-for="(tag, index) in details.tags" :key="index">#{{ tag }}</router-link>
                </div>
                <div class="cover-digital">
                  <span class="cover-playCount"><i class="iconfont icon-playnum"></i> {{ details.playCount | setCount }}次</span>
                  <span class="cover-collect"><i class="iconfont icon-collect"></i> {{ details.subscribedCount | setCount }}</span>
                  <span class="cover-comment"><i class="iconfont icon-comment"></i> {{ details.commentCount | setCount }}</span>
                </div>
                <div class="cover-desc">
                  <h5>歌单简介</h5>
                  <div class="jianjie">{{ details.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="count">
          <span>包含歌曲列表</span>
          <em>{{ songList.length + '首歌' }}</em>
        </div>
        <div class="list">
          <song-list :list="songList"></song-list>
        </div>
        <Comments :id="id" :type="type"></Comments>
      </div>
      <div class="right">
        <h3 class="aside-title">喜欢这个歌单的人</h3>
        <div class="users">
          <ul>
            <li v-for="item in collects" :key="item.userId">
              <router-link :to="{ path: '/user', query: { id: item.userId } }">
                <img :src="item.avatarUrl + '?param=32y32'" alt="" />
              </router-link>
            </li>
          </ul>
        </div>
        <h3 class="aside-title">相关歌单推荐</h3>
        <playlistRecommend :list="playlists"></playlistRecommend>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import songList from '@/components/songList/song-list.vue'
import playlistRecommend from '@/components/playlistRecommend/playlistRecommend.vue'
import Comments from '@/components/comments/comments.vue'
export default {
  data() {
    return {
      id: this.$route.query.id,
      songList: [],
      details: {},
      collects: [],
      playlists: [],
      type: 2 // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    }
  },
  created() {
    this.init(this.id)
  },
  methods: {
    init(id) {
      // 歌单详情
      this.getDetail({ id: id, s: 8 })
      // 歌单收藏者
      this.getCollect({ id: id, limit: 24 })
      // 相关歌单推荐
      this.getRecom({ id: id })
    },
    // 登录及未登录下获取歌单中歌曲的列表
    async getDetail(params) {
      // this.isLoading = true
      const { data: res } = await this.$http.playlistdetail(params)

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }

      this.details = res.playlist
      console.log(this.details)
      // if (this.isLogin) {
      //   const ids = res.playlist.trackIds

      //   this.getAllSongs(ids)
      // } else {
      this.songList = this.$format._format(res.playlist.tracks)
    },
    // 订阅该歌单的用户列表
    async getCollect(params) {
      const { data: res } = await this.$http.playlistSCollect(params)

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      this.collects = res.subscribers
      // console.log(this.collects)
    },
    // 相关歌单推荐
    async getRecom(params) {
      const { data: res } = await this.$http.playlistRelated(params)

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      this.playlists = res.playlists
      // console.log(this.playlists)
    },
    async subAlbum(item) {
      let t = 2
      t = item.subscribed ? 2 : 1
      const { data: res } = await this.$http.subPlayList({ id: this.id, t: t })
      console.log(res)
      if (res.code !== 200) {
        if (t === 2) {
          this.$message.success('取消收藏失败')
        } else {
          this.$message.success('收藏失败')
        }
        return this.$message.error('数据请求失败')
      }
      if (t === 2) {
        item.subscribed = false
        this.$message.success('取消收藏成功')
      } else {
        item.subscribed = true
        this.$message.success('收藏成功')
      }
      // this.dynamic.isSub = Number(!this.dynamic.isSub)
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  components: {
    songList,
    playlistRecommend,
    Comments
  },
  watch: {
    $route: {
      handler() {
        this.id = this.$route.query.id
        // this.$refs.videoPlay.change()

        this.init(this.id)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.bigBox {
  padding-top: 15px;
  display: flex;
}
.left {
  width: 100%;
  min-width: 0;
  // flex-shrink: 0;
  // height: 100vh;
  // background-color: pink;
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
  .TopText {
    position: relative;
    width: 100%;
    padding-top: 32%;
    // background-color: rosybrown;
    .box {
      position: absolute;
      display: flex;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background-color: orange;
      .img {
        display: flex;
        // justify-content: center;
        align-items: center;
        height: 100%;
        width: 32%;
        // background-color: orchid;
        img {
          width: 90%;
          height: 90%;
        }
      }
      .info {
        width: 68%;
        height: 100%;
        // background-color: orangered;
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
        .cover-title {
          font-size: 24px;
          font-weight: bold;
          display: flex;
          align-items: center;
          // overflow: hidden !important;
          // text-overflow: ellipsis;
          // white-space: nowrap;
          span {
            overflow: hidden !important;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .collect {
            display: inline-block;
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
        }
        .cover-tags {
          padding-bottom: 5px;
          line-height: 16px;

          .tag {
            display: inline-block;
            margin-right: 5px;
            font-size: 12px;
            color: #e60026;
          }
        }

        .cover-author {
          padding: 15px 0 10px;
          a {
            color: #333;
          }
          img {
            display: inline-block;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            vertical-align: top;
          }

          .cover-name,
          .cover-date {
            display: inline-block;
            padding: 0 10px;
            line-height: 32px;
          }

          .cover-date {
            color: #999;
          }
        }
        .jianjie {
          width: 100%;
        }
        .cover-desc {
          position: relative;

          h5 {
            padding: 30px 0 5px;
            line-height: 20px;
            font-size: 14px;
            color: #333;
          }

          div {
            line-height: 22px;
            font-size: 14px;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            word-break: break-all;
            cursor: pointer;
          }
        }
        .cover-digital {
          color: #999;
          width: 249px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
.right {
  width: 251px;
  height: 100vh;
  margin-left: 15px;
  // background-color: red;
  flex-shrink: 0;
  .aside-title {
    position: relative;
    font-size: 16px;
    line-height: 24px;
  }
  .users {
    margin-top: 10px;
    width: 100%;
    // background-color: pink;
    ul {
      width: 100%;
      display: grid;
      justify-items: center;
      grid-row-gap: 15px;
      // flex-wrap: wrap;
      grid-template-columns: repeat(6, 1fr);
      li {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        a {
          display: block;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
.list {
  margin-top: 15px;
  width: 100%;
}
</style>
