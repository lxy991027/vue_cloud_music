<template>
  <div class="Comments-continer">
    <!-- v-if="showDelDialog" -->
    <div class="delDialog" v-if="showDelDialog">
      <div class="box">
        <div class="title">
          <span>删除评论</span>
          <a href="javascript:;" class="el-icon-close" @click="close"></a>
        </div>
        <div class="info">
          <p>是否删除此评论</p>
          <div class="buttons">
            <a href="javascript:;" class="no" @click="close">取消</a>
            <a href="javascript:;" class="yes" @click="delcomment(item, index, types)">确定</a>
          </div>
        </div>
      </div>
    </div>
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
          {{ text }}
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
          <div class="liBox">
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
                <div class="comment_oper">
                  <!-- v-if="userInfo && userInfo.userId === item.user.userId"  -->
                  <a href="javascript:;" class="comment_del" v-if="userInfo && userInfo.userId === item.user.userId" @click="DelDialog(item, index, 'comments')"><i class="iconfont icon-del"></i></a>
                  <a href="javascript:;" :class="[item.liked ? 'active' : '']" @click="likeComment(item)"><i class="iconfont icon-praise"></i>({{ item.likedCount }})</a>
                  <a href="javascript:;" class="replyComment" @click="showMsgBox('' + item.commentId + index)"><i class="iconfont icon-comment"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div class="msgBox" :class="'msgBox' + item.commentId + index">
            <h3>
              <p>我回复@{{ item.user.nickname }}:</p>
              <a href="javascript:;" class="el-icon-close" @click="offMsgBox('' + item.commentId + index)"></a>
            </h3>
            <div class="text">
              <div class="text-n" :class="'text' + item.commentId + index"></div>
              <textarea @input="valueLength('' + item.commentId + index)" :class="'textarea' + item.commentId + index" placeholder="期待你的神评......"></textarea>
            </div>
            <div class="button">
              <span :class="'span' + item.commentId + index">0\500</span>
              <a href="javascript:;" @click="replyMsg('textarea' + item.commentId + index, item, index)">提交</a>
            </div>
          </div>
        </li>
      </ul>
      <ul class="comments">
        <li v-for="(item, index) in comments" :key="item.commentId + index">
          <div class="liBox">
            <div class="img">
              <img :src="item.user.avatarUrl + '?param=50y50'" alt="" />
            </div>
            <div class="users">
              <router-link class="name" :to="{ path: '/user', query: { id: item.user.userId } }">{{ item.user.nickname }}</router-link>
              <p>{{ item.content }}</p>
              <template>
                <div class="comment_reply" v-for="replyItem in item.beReplied" :key="replyItem.beRepliedCommentId">
                  <router-link :to="{ path: '/user', query: { id: replyItem.user.userId } }">
                    {{ replyItem.user.nickname }}
                  </router-link>
                  : {{ replyItem.content }}
                </div>
              </template>
              <div class="time">
                <em>{{ item.time | format }}</em>
                <div class="comment_oper">
                  <!-- v-if="userInfo && userInfo.userId === item.user.userId"  -->
                  <a href="javascript:;" class="comment_del" v-if="userInfo && userInfo.userId === item.user.userId" @click="DelDialog(item, index, 'comments')"><i class="iconfont icon-del"></i></a>
                  <a href="javascript:;" :class="[item.liked ? 'active' : '']" @click="likeComment(item)"><i class="iconfont icon-praise"></i>({{ item.likedCount }})</a>
                  <a href="javascript:;" class="replyComment" @click="showMsgBox('' + item.commentId + index)"><i class="iconfont icon-comment"></i></a>
                </div>
              </div>
            </div>
          </div>
          <div class="msgBox" :class="'msgBox' + item.commentId + index">
            <h3>
              <p>我回复@{{ item.user.nickname }}:</p>
              <a href="javascript:;" class="el-icon-close" @click="offMsgBox('' + item.commentId + index)"></a>
            </h3>
            <div class="text">
              <div class="text-n" :class="'text' + item.commentId + index"></div>
              <textarea @input="valueLength('' + item.commentId + index)" :class="'textarea' + item.commentId + index" placeholder="期待你的神评......"></textarea>
            </div>
            <div class="button">
              <span :class="'span' + item.commentId + index">0\500</span>
              <a href="javascript:;" @click="replyMsg('textarea' + item.commentId + index, item, index)">提交</a>
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
      showError: false,
      showDelDialog: false,
      item: null,
      index: 0,
      // 删除的是否热评
      types: ''
    }
  },
  created() {
    this.getComment()
    // this.getMvComment()
  },
  mounted() {
    this.$bus.$on('scrollTop', (v) => {
      console.log('触发了')
      this.top = v
    })
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
      const { data: res } = await this.$http.commentSong({ id: this.id, limit: this.limit, offset: this.offset, before: this.before, timestamp: Date.now() })
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
      const { data: res } = await this.$http.commentMv({ id: this.id, limit: this.limit, offset: this.offset, before: this.before, timestamp: Date.now() })
      console.log(res, '评论')
      this.msgHandler(res, cb)
    },
    async getAlbumComment(cb) {
      const { data: res } = await this.$http.albumComment({ id: this.id, limit: this.limit, offset: this.offset, before: this.before, timestamp: Date.now() })

      this.msgHandler(res, cb)
    },
    // 歌单精彩评论
    async getComments(cb) {
      const { data: res } = await this.$http.playlistComment({ id: this.id, limit: this.limit, offset: this.offset, before: this.before, timestamp: Date.now() })

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
    async commentHandler(t, content, commentId, index, type, item) {
      console.log('调用')
      const params = {
        t: t, // 0删除 1发送 2回复
        type: this.type, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
        id: this.id, // 对应资源id
        content: content, // 发送的内容/对应内容的id
        commentId: commentId // 回复的评论id
      }
      const { data: res } = await this.$http.comment(params)
      console.log(res, '这里是评论')
      if (res.code !== 200) {
        return this.$message.error(res.msg)
      }
      if (res.code === 250) {
        return this.$message.error(res.msg)
      }
      this.text = ''
      console.log(this.test, '这个是test')
      // this.page = 0
      // this.offset = 0
      // this.comments = []
      // this.getComment()
      if (t === 0) {
        this.$message.success('删除评论成功！')
        if (type === 'comments') {
          this.comments.splice(index, 1)
        } else {
          this.hotComments.splice(index, 1)
        }
      } else if (t === 1) {
        res.comment.liked = false
        res.comment.likedCount = 0
        this.comments.unshift(res.comment)
        this.$message.success('评论成功！')
      } else if (t === 2) {
        res.comment.liked = false
        res.comment.likedCount = 0
        this.comments.unshift(res.comment)
        res.comment.beReplied = [item]
        console.log(item)
        this.$message.success('回复评论成功！')
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
    },
    // 给评论点赞
    async likeComment(item) {
      console.log(item)
      if (!this.isLogin) {
        this.showLogin()
        return
      }

      const { data: res } = await this.$http.commentLike({ id: this.id, cid: item.commentId, t: Number(!item.liked), type: this.type })
      console.log(res)
      if (res.code !== 200) {
        return this.$message.error('数据请求失败')
      }
      if (item.liked) {
        this.$message.success('取消点赞成功')
        item.likedCount--
      } else {
        this.$message.success('点赞成功')
        item.likedCount++
      }
      item.liked = !item.liked
      // this.getComment()
    },
    // 删除评论
    delComment(item, index, type) {
      this.commentHandler(0, '', item.commentId, index, type)
    },
    close() {
      this.showDelDialog = false
    },
    delcomment(item, index, type) {
      this.delComment(item, index, type)
      this.showDelDialog = false
    },
    DelDialog(item, index, type) {
      this.item = item
      this.index = index
      this.types = type
      this.showDelDialog = true
    },
    showMsgBox(id) {
      console.log(`.msgBox${id}`)
      const msgBox = document.querySelector(`.msgBox${id}`)
      console.log(msgBox)
      const count = document.querySelector(`.span${id}`)
      const background = document.querySelector(`.text${id}`)
      count.innerHTML = '0\\500'
      count.style.color = ''
      background.innerHTML = ''
      msgBox.style.display = 'block'

      // this.$refs[id].style.display = 'block'
    },
    offMsgBox(id) {
      const msgBox = document.querySelector(`.msgBox${id}`)
      const textarea = document.querySelector(`.textarea${id}`)
      console.log(msgBox, textarea)

      msgBox.style.display = 'none'
      textarea.value = ''
    },
    replyMsg(dom, item, index) {
      if (!this.isLogin) {
        this.showLogin()
        return
      }
      // console.log(item.commentId.length, item.commentId, '544335')

      const msg = document.querySelector(`.${dom}`).value
      // console.log(msg)
      if (msg.length > 500) return this.$message.error('内容长度超过500')
      this.commentHandler(2, msg, item.commentId, null, null, item)
      this.offMsgBox('' + item.commentId + index)
    },
    valueLength(dom) {
      const doms = document.querySelector(`.textarea${dom}`).value.length
      console.log(doms)
      const count = document.querySelector(`.span${dom}`)
      const background = document.querySelector(`.text${dom}`)
      background.innerText = document.querySelector(`.textarea${dom}`).value
      count.innerHTML = `${doms}\\500`
      if (doms >= 500) {
        count.style.color = 'red'
      } else {
        count.style.color = ''
      }
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
  },
  beforeDestroy() {
    this.$bus.$off('scrollTop')
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
    background-color: #f2f2f2;
    z-index: 10;
    border-radius: 20px;
    span {
      display: flex;

      color: #606266;
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
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .liBox {
    position: relative;
    display: flex;
    // background-color: red;

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
        display: flex;
        justify-content: space-between;
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
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f2f2f2;
  }
  .liBox {
    display: flex;
    // background-color: red;
    // margin-bottom: 15px;
    // padding: 10px 0;
    // border-bottom: 1px solid #f2f2f2;
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
        display: flex;
        justify-content: space-between;
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
.comment_oper {
  a {
    margin-left: 10px;
    color: #999;
  }
}
.active {
  color: #e60026 !important;
}
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
.msgBox {
  display: none;
  width: 100%;
  // height: 200px;
  border-radius: 10px;
  background-color: #efefef;
  padding: 6px;
  h3 {
    display: flex;
    justify-content: space-between;
    a {
      color: #999;
    }
    p {
      color: #999;
      font-size: 13px;
    }
  }
  .text {
    position: relative;
    width: 100%;
    margin-top: 5px;
    min-height: 50px;
    // background-color: red;
    .text-n {
      width: 100%;
      min-height: 50px;
      border-radius: 10px;
      padding: 5px;
      padding-bottom: calc(5px + 13px);
      font-size: 13px;
      // background-color: pink;
      word-wrap: break-word;
      word-break: normal;
    }
    textarea {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      // bottom: 0;
      height: 100%;
      width: 100%;
      font-size: 13px;
      resize: none;
      outline: none;
      border: 0;
      border-radius: 10px;
      padding: 5px;
      overflow: hidden;
    }
  }

  .button {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    span {
      font-size: 10px;
    }
    a {
      display: block;
      border-radius: 20px;
      text-align: center;
      line-height: 25px;
      width: 60px;
      height: 25px;
      color: #f5f5f5;
      font-size: 14px;
      background-color: #e60026;
    }
  }
}
</style>
