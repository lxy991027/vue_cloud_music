import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/global.css'
import '@/assets/less/common.less'
import '@/assets/fonts/font.css'
import '@/assets/less/video.less'
// 引入饿了么组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入axios
import http from '@/api/http.js'
// 导入video.js

import Videojs from 'video.js'

import 'video.js/dist/video-js.css'

import f from '@/js/_format.js'

import '@/api/filter.js'
Vue.prototype.$video = Videojs

Vue.prototype.$http = http

Vue.prototype.$format = f
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this // 安装全局事件总线
  }
}).$mount('#app')
