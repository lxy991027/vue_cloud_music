<template>
  <div class="login" v-if="loginDialogVisible">
    <div class="loginBox">
      <div class="title">
        <span>手机号登录</span>
        <a href="javascript:;" class="el-icon-close" @click="close"></a>
      </div>
      <input class="text" type="text" placeholder="请输入手机号" v-model="loginForm.phone" />
      <p class="msg" :class="{ red: !isMsg, green: isMsg }">{{ msg }}</p>
      <input class="password" type="password" placeholder="请输入密码" v-model="loginForm.pwd" />
      <a href="javascript:;" class="go" @click="go">登录</a>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      reg_phone: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
      msg: '',
      isMsg: false,
      loginForm: {
        phone: '',
        pwd: ''
      }
    }
  },
  computed: {
    ...mapState(['loginDialogVisible'])
  },
  methods: {
    ...mapMutations(['showDialog', 'setUserInfo', 'setLogin']),
    close() {
      this.showDialog(false)
    },
    isMsgs() {
      if (this.isMsg) {
        return 'green'
      } else {
        return 'red'
      }
    },
    async login() {
      const { data: res } = await this.$http.login(this.loginForm)
      console.log(res, '登录')
      if (res.code !== 200) {
        this.$massege.error(res.msg)
      } else {
        this.getUserInfo(res.profile.userId)
        // window.sessionStorage.setItem('token', res.token)
        // window.sessionStorage.setItem('cookie', res.cookie)
        // window.sessionStorage.setItem('isLogin', true)
        this.showDialog(false)
      }
    },
    async getUserInfo(uid) {
      const { data: res } = await this.$http.getUserInfo({ uid: uid })
      console.log(res, '详情')
      if (res.code !== 200) {
        this.$massege.error(res.msg)
      } else {
        // window.sessionStorage.setItem('userInfo', JSON.stringify(res.profile))
        this.setLogin(true)
        this.setUserInfo(res.profile)
        console.log(this.$store.state.userInfo)
      }
    },
    go() {
      if (!this.isMsg) return
      this.login()
    }
  },
  watch: {
    'loginForm.phone'(newVal) {
      this.isMsg = this.reg_phone.test(newVal)
      if (this.isMsg) {
        this.msg = '手机号格式正确'
      } else {
        this.msg = '请输入正确的手机号'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000000;
  .loginBox {
    position: relative;
    width: 500px;
    height: 300px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    .msg {
      position: absolute;
      top: 123px;
      left: 140px;
      font-size: 10px;
    }
    .el-icon-close {
      font-size: 20px;
      color: #f5f5f5;
    }
    .text {
      margin-top: 55px;
      border: 1px solid #cdcdcd;
      width: 44%;
      height: 30px;
    }
    .password {
      margin-top: 25px;
      border: 1px solid #cdcdcd;
      width: 44%;
      height: 30px;
    }
    .go {
      width: 44%;
      height: 40px;
      margin-top: 20px;
      text-align: center;
      line-height: 40px;
      background-color: #3988d3;
      border-radius: 10px;
      color: #f5f5f5;
    }
  }
}
input {
  padding: 0 5px;
}
.red {
  color: red;
}
.green {
  color: #b6ea7b;
}
</style>
