<template>
  <div>
    <div class="header">
      <Header></Header>
    </div>
    <main>
      <div class="main"></div>
      <router-view></router-view>
    </main>
    <footer>
      <span>本站仅供学习参考，不做任何商业用途</span>
    </footer>
    <Audio></Audio>
    <Login></Login>
  </div>
</template>

<script>
import Header from '@/components/Header/header.vue'
import Audio from '@/components/audio/Audio.vue'
import Login from '@/components/login/login.vue'
import { mapMutations } from 'vuex'
export default {
  components: {
    Header,
    Audio,
    Login
  },
  created() {
    this.login()
  },
  // mounted() {
  //   window.addEventListener('unload', function(event) {
  //     // event.returnValue = '我在这写点东西...'
  //     alert('拜拜')
  //     // this.login()
  //     for (let i = 0; i < 999999; i++) {
  //       console.log('你好')
  //     }
  //   })
  // },
  methods: {
    ...mapMutations(['showDialog', 'setUserInfo', 'setLogin']),
    async login() {
      const { data: res } = await this.$http.logsss({ timestamp: Date.now() })
      if (res.code !== 200) return this.$message.error('获取登录信息失败')
      console.log(res, '登录信息')
      if (res.profile) {
        this.setLogin(true)
        this.setUserInfo(res.profile)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 55px !important;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
main {
  padding: 0;
  min-height: calc(100vh - 100px);

  .main {
    width: 100%;
    height: 55px;
    background-color: #242424;
  }
}
.main-box {
  position: relative;
  // background-color: red;
}
footer {
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-top: 55px;
  background-color: #e8e8e8;
  width: 100%;
  height: 100px;
  z-index: 999;
  span {
    font-size: 20px;
  }
}
</style>
