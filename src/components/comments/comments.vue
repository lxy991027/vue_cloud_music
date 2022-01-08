<template>
  <div class="Comments-continer">
    <div class="commentBox">
      <div class="zhezhao" v-if="!isLogin">
        <span>请<a href="javascript:;" @click="showLogin">登录</a>后评论</span>
      </div>
      <div class="comment_hd">
        <h2>
          评论<em>共{{ total }}条评论</em>
        </h2>
        <div class="userInfo" v-if="userInfo">
          <span>{{ userInfo.nickname }}</span>
          <img :src="userInfo.avatarUrl" class="avatar" />
        </div>
      </div>
      <div class="comment_textarea">
        <div class="textarea">
          <textarea placeholder="期待你的神评论……" v-model="text"></textarea>
        </div>
        <span class="error" v-if="text.length > 500">字数超出限制</span>
        <div class="commit">
          <a href="javascript:;" @click="commit">提交</a>
          <span :class="{ color: text.length > 500 }">{{ this.text.length }}\500</span>
        </div>
      </div>
    </div>
    <div>
      <ul class="hotComments">
        <li v-for="item in hotComments" :key="item.commentId + 'index'">
          <div class="hot">热评</div>
          <div class="img">
            <img :src="item.user.avatarUrl + '?param=50y50'" alt="" />
          </div>
          <div class="users">
            <router-link class="name" :to="{ path: '/user', query: { id: item.user.userId } }">{{ item.user.nickname }}</router-link>
            <p>{{ item.content }}</p>
            <template v-if="item.beReplied.length">
              <div class="comment_reply" v-for="replyItem in item.beReplied" :key="replyItem.beRepliedCommentId">
                <router-link :to="{ path: '/user', query: { id: replyItem.user.userId } }">
                  {{ replyItem.user.nickname }}
                </router-link>
                : {{ replyItem.content }}
              </div>
            </template>
            <div class="time">
              <em>{{ item.time | format }}</em>
            </div>
          </div>
        </li>
      </ul>
      <ul class="comments">
        <li v-for="(item, index) in comments" :key="item.commentId + index">
          <div class="img">
            <img :src="item.user.avatarUrl + '?param=50y50'" alt="" />
          </div>
          <div class="users">
            <router-link class="name" :to="{ path: '/user', query: { id: item.user.userId } }">{{ item.user.nickname }}</router-link>
            <p>{{ item.content }}</p>
            <template v-if="item.beReplied.length">
              <div class="comment_reply" v-for="replyItem in item.beReplied" :key="replyItem.beRepliedCommentId">
                <router-link :to="{ path: '/user', query: { id: replyItem.user.userId } }">
                  {{ replyItem.user.nickname }}
                </router-link>
                : {{ replyItem.content }}
              </div>
            </template>
            <div class="time">
              <em>{{ item.time | format }}</em>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="msg" ref="msg">{{ msg }}</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: ['id', 'type'],
  data() {
    return {
      limit: 20,
      offset: 0,
      before: 0,
      comments: [],
      total: 0,
      hotComments: [],
      msg: '加载更多',
      top: 0,
      load: false,
      page: 0,
      text: '',
      showError: false
    }
  },
  created() {
    this.getComment()
    // this.getMvComment()
  },
  mounted() {
    document.onscroll = () => {
      this.top = document.body.scrollTop + document.documentElement.scrollTop
    }
  },
  methods: {
    ...mapMutations(['showDialog']),
    getComment(cb) {
      this.page++
      this.currentChange(this.page)
      switch (this.type) {
        case 0:
          this.getSongComment(cb)
          break
        case 1:
          this.getMvComment(cb)
          break
        case 2:
          this.getComments(cb)
          break
        case 3:
          this.getAlbumComment(cb)
          break
        case 5:
          this.getVideoComment(cb)
          break
      }
    },
    async getSongComment(cb) {
      const { data: res } = await this.$http.commentSong({ id: this.id, limit: this.limit, offset: this.offset, before: this.before })
      // if (this.comments.length !== 0) {
      //   console.log(this.comments[this.comments.length - 1].time)
      //   this.before = this.comments[this.comments.length - 1].time
      // }
      console.log(res, '评论')
      this.msgHandler(res, cb)
    },
    async getMvComment(cb) {
      console.log(this.offset)
      // if (this.comments.length !== 0) {
      //   console.log(this.comments[this.comments.length - 1].time)
      //   this.before = this.comments[this.comments.length - 1].time
      // }
      const { data: res } = await this.$http.commentMv({ id: this.id, limit: this.limit, offset: this.offset, before: this.before })
      console.log(res, '评论')
      this.msgHandler(res, cb)
    },
    async getAlbumComment(cb) {
      const { data: res } = await this.$http.albumComment({ id: this.id, limit: this.limit, offset: this.offset, before: this.before })

      this.msgHandler(res, cb)
    },
    // 歌单精彩评论
    async getComments(cb) {
      const { data: res } = await this.$http.playlistComment({ id: this.id, limit: this.limit, offset: this.offset, before: this.before })

      this.msgHandler(res, cb)
    },
    msgHandler(res, cb) {
      if (res.code !== 200) return this.$message.error('获取数据失败')
      this.total = res.total
      if (!cb) {
        this.hotComments = res.hotComments
      }
      this.comments = [...this.comments, ...res.comments]
      this.load = true
      if (cb) cb()
    },
    currentChange(page) {
      this.offset = (page - 1) * this.limit
      // this.getComment()
    },
    // an() {
    //   const top = document.body.scrollTop + document.documentElement.scrollTop
    //   console.log(top)
    //   console.log(document.documentElement.clientHeight)
    //   console.log(this.$refs.msg.offsetTop - top)
    // },
    cb() {
      this.msg = '加载中...'
      // this.offset++
      // setTimeout(() => {
      //   console.log('被调用了')
      //   this.load = true
      //   this.msg = '加载更多'
      // }, 2000)
      if (this.comments.length >= this.total) {
        this.msg = '已经到最底下了'
        this.load = true
        return
      }
      this.getComment(() => {
        this.load = true
        this.msg = '加载更多'
      })
    },
    commit() {
      if (this.text.length > 500) return
      console.log(this.text)
      this.subComment()
    },
    // 发布/删除/回复评论
    async commentHandler(t, content, commentId) {
      console.log('调用')
      const params = {
        t: t, // 0删除 1发送 2回复
        type: this.type, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
        id: this.id, // 对应资源id
        content: content, // 发送的内容/对应内容的id
        commentId: commentId // 回复的评论id
      }
      const { data: res } = await this.$http.comment(params)

      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }
      if (res.code === 250) {
        return this.$message.error(res.msg)
      }
      this.test = ''
      this.getComment()
      if (t === 0) {
        this.$massege.success('删除评论成功！')
      } else if (t === 1) {
        this.$massege.success('评论成功！')
      } else if (t === 2) {
        this.$massege.success('回复评论成功！')
        // this.replyCommentId = 0
        // this.replyIndex = -1
      }
    },
    // 发布评论
    subComment() {
      // if (!this.isLogin) {
      //   this.setLoginDialog(true)
      //   return
      // }
      this.commentHandler(1, this.text)
    },
    showLogin() {
      this.showDialog(true)
    }
  },
  computed: {
    ...mapState(['userInfo', 'isLogin'])
  },
  watch: {
    id() {
      this.offset = 0
      this.before = 0
      this.page = 0
      this.comments = []
      // this.getMvComment()
      this.getComment()
    },
    top(newVal, oldVal) {
      if (!this.load) return
      if (this.$refs.msg.offsetTop - newVal < document.documentElement.clientHeight) {
        this.load = false
        this.cb()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.commentBox {
  position: relative;
  height: 320px;
  .zhezhao {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    span {
      display: flex;

      color: #fff;
      font-size: 30px;

      a {
        color: #e60026;
      }
    }
  }
}
.comment_hd {
  margin-top: 15px;
  display: flex;
  align-items: center;
  height: 60px;
  font-size: 0;

  h2 {
    flex: 1;
    font-size: 24px;
    line-height: 24px;
    font-weight: normal;

    em {
      padding-left: 20px;
      font-size: 14px;
      line-height: 14px;
      font-style: normal;
      color: #999;
    }
  }

  .userInfo {
    // background-color: pink;
    display: flex;
    align-items: center;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      vertical-align: top;
    }

    span {
      display: inline-block;
      padding: 0 20px;
      line-height: 30px;
      font-size: 14px;
      color: #666;
    }
  }
}
.comment_textarea {
  position: relative;
  .error {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: red;
  }
  .textarea {
    width: 100%;
    height: 200px;
    border: 1px solid #bababa;
    border-radius: 30px;
    overflow: hidden;
    textarea {
      padding: 9px;
      width: 100%;
      height: 100%;
      resize: none;
      outline: none;
      border: 0;
    }
  }
  .commit {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
      border-radius: 20px;
      text-align: center;
      line-height: 30px;
      width: 80px;
      height: 30px;
      color: #f5f5f5;
      font-size: 20px;
      background-color: #e60026;
    }
    span {
      font-size: 10px;
    }
  }
}
.hotComments {
  margin-top: 15px;
  width: 100%;

  .hot {
    position: absolute;
    width: 40px;
    font-size: 13px;
    text-align: center;
    line-height: 20px;
    background-color: #e60026;
    height: 20px;
    border-radius: 10px;
    color: #fff;
    right: -10px;
    top: -5px;
  }
  li {
    position: relative;
    display: flex;
    // background-color: red;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
    .img {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
    }
    .users {
      width: 100%;
      // height: 20px;
      margin-left: 10px;
      // background-color: rosybrown;
      .name {
        // height: 10px;
        display: inline-block;
        line-height: 10px;
        color: #999;
        font-size: 10px;
        vertical-align: top;
      }
      p {
        font-size: 14px;
        color: #333;
        margin-top: 5px;
      }
      .time {
        font-size: 14px;
        color: #999;
        margin-top: 5px;
        em {
          font-style: normal;
        }
      }
      .comment_reply {
        width: 100%;
        line-height: 28px;
        margin-top: 10px;
        // height: 50px;
        background-color: #f2f2f2;
        a {
          color: #999;
        }
      }
    }
  }
}
.comments {
  margin-top: 15px;
  width: 100%;
  li {
    display: flex;
    // background-color: red;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
    .img {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 50%;
    }
    .users {
      width: 100%;
      // height: 20px;
      margin-left: 10px;
      // background-color: rosybrown;
      .name {
        // height: 10px;
        display: inline-block;
        line-height: 10px;
        color: #999;
        font-size: 10px;
        vertical-align: top;
      }
      p {
        font-size: 14px;
        color: #333;
        margin-top: 5px;
      }
      .time {
        font-size: 14px;
        color: #999;
        margin-top: 5px;
        em {
          font-style: normal;
        }
      }
      .comment_reply {
        width: 100%;
        line-height: 28px;
        margin-top: 10px;
        font-size: 13px;
        // height: 50px;
        background-color: #f2f2f2;
        a {
          color: #999;
        }
      }
    }
  }
}
.msg {
  width: 100%;
  line-height: 25px;
  text-align: center;
  height: 25px;
  font-size: 10px;
  margin-bottom: 10px;
  color: #333;
  background-color: rgba(153, 153, 153, 0.3);
  border-radius: 10px;
}
.color {
  color: red;
}
</style>
