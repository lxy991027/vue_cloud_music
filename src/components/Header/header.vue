<template>
  <header class="container-header">
    <div class="header">
      <div>
        <h1 class="logo">
          <a href="#">网易云音乐</a>
        </h1>
        <ul class="tab">
          <li v-for="(item, index) in tabList" :key="index">
            <router-link :to="item.path">{{ item.name }}</router-link>
          </li>
        </ul>
      </div>

      <div class="right">
        <el-input placeholder="音乐/视频/电台/用户" v-model="input3" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button round class="btn" @click="logout">退出登录</el-button>
        <div class="user-box">
          <a href="Javascript:;" @click="dialog" v-if="!isLogin">登录</a>
          <div class="user" v-else>
            <img :src="userInfo.avatarUrl" alt="" />
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
  data() {
    return {
      tabList: [
        {
          name: '发现音乐',
          path: '/home'
        },
        {
          name: '我的音乐',
          path: '/myuser'
        },
        {
          name: '朋友',
          path: 'home'
        },
        {
          name: '商城',
          path: 'home'
        },
        {
          name: '音乐人',
          path: 'home'
        },
        {
          name: '下载客户端',
          path: 'home'
        }
      ],
      input3: ''
    }
  },
  methods: {
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
      this.setUserInfo()

      // if (this.$route.path.indexOf('/my') >= 0) {
      //     this.$router.push({ path: '/' })
      // }
    }
  },
  computed: {
    ...mapState(['isLogin', 'userInfo'])
  }
}
</script>

<style lang="less" scoped>
.container-header {
  width: 100%;
  height: 100%;
  background-color: #242424;

  .header {
    display: flex;
    justify-content: space-between;

    margin: 0 auto;
    width: 80%;
    min-width: 1100px;
    div {
      display: flex;
    }
    .right {
      // background-color: red;
      align-items: center;
    }
  }
}
.logo {
  width: 176px;
  height: 69px;
  padding-right: 20px;
  background-image: url('../../assets/topbar.png');
  background-position: 0 0;
  text-indent: -9999px;
}
.tab {
  display: flex;
  a {
    display: block;
    padding: 0 19px;
    font-size: 14px;
    color: #ccc;
    line-height: 70px;
    height: 70px;
  }
}
.el-input {
  margin-left: 85px;
  // margin-top: 19px;
  width: 158px;
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
  margin: 0 0 0 12px;
  border: 1px solid #4f4f4f;
  background-color: transparent;
  font-size: 12px;
  color: #ccc;
}
.user-box {
  display: flex;
  align-items: center;
  margin-left: 20px;
  // padding-right: 22px;
  font-size: 12px;
  // background-color: pink;
  width: 50px;
  height: 50px;

  a {
    color: #787878;
    // line-height: 27px;
    // height: 20px;
    // background-color: pink;
  }
  .user {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
