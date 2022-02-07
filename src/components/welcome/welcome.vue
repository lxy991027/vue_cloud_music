<template>
  <div class="welcome-continer" @transitionend="transitioned" :style="{ top: `-${h}%` }" v-if="showWelcome">
    <span>欢迎</span>
  </div>
</template>

<script>
export default {
  created() {
    setTimeout(() => {
      this.h = 150
    }, 1000)
  },
  data() {
    return {
      h: 0,
      showWelcome: true
    }
  },
  methods: {
    transitioned() {
      // const welcome = document.querySelector('.welcome-continer')
      // welcome.style.display = 'none'
      this.showWelcome = false
    }
  }
}
</script>

<style lang="less" scoped>
.welcome-continer {
  transition: 1s top;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  position: fixed;
  // top: 0vh;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(36, 36, 36, 0.8);
  z-index: 999999999;
  color: #ccc;
}
@supports (-webkit-backdrop-filter: blur(25px)) or (backdrop-filter: blur(25px)) {
  .welcome-continer {
    background-color: transparent !important;
    -webkit-backdrop-filter: saturate(1.2) blur(24px) !important;
    backdrop-filter: saturate(1.2) blur(24px) !important;
    background-color: rgba(36, 36, 36, 0.4) !important;
  }
}
</style>
