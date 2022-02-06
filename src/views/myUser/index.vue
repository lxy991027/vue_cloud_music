<template>
  <div class="userPlayList-continer">
    <div class="zhezhao" v-if="!isLogin">
      <span>请<a href="javascript:;" @click="showLogin">登录</a>后继续</span>
    </div>
    <Main v-else></Main>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Main from './main.vue'
export default {
  // 监听属性 类似于data概念
  mounted() {
    if (!this.isLogin) {
      if (this.$route.path === '/myuser') return
      this.$router.push({ path: '/myuser' })
    }
  },
  components: {
    Main
  },
  computed: {
    ...mapState(['isLogin', 'userInfo'])
  },
  watch: {
    isLogin(newVal) {
      // console.log(this.$route.path, '导航')
      if (this.$route.path === '/myuser') return
      if (!newVal) {
        this.$router.push({ path: '/myuser' })
      }
    }
  },
  methods: {
    ...mapMutations(['showDialog']),
    showLogin() {
      this.showDialog(true)
    }
  }
}
</script>

<style lang="less" scoped>
.zhezhao {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 155px);
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
// .zhezhao {
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
// }
</style>
