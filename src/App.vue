<template>
  <div>
    <div class="header">
      <Header></Header>
    </div>
    <main>
      <router-view></router-view>
    </main>
    <footer>
      <span>本网站仅供学习参考，不做任何商业用途</span>
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
      const { data: res } = await this.$http.logsss()
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
  height: 70px !important;
  padding: 0;
}
main {
  padding: 0;
  min-height: calc(100vh - 80px - 40px);
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
  background-color: #333;
  width: 100%;
  height: 20vh;
  z-index: 999;
  span {
    font-size: 3vw;
  }
}
</style>
