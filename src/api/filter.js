import Vue from 'vue'

Vue.filter('setCount', (value) => {
  if (value < 10000) {
    return value
  } else {
    return (value / 10000).toFixed(1) + '万'
  }
})
Vue.filter('timechenge', (mss) => {
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  minutes = minutes < 10 ? '0' + minutes : minutes
  var seconds = parseInt((mss % (1000 * 60)) / 1000)
  // var ms = parseInt(mss % 1000)
  seconds = seconds < 10 ? '0' + seconds : seconds
  return minutes + ':' + seconds
})
Vue.filter('format', (ms) => {
  var time = new Date(ms)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  h = h < 10 ? '0' + h : h
  var mm = time.getMinutes()
  mm = mm < 10 ? '0' + mm : mm
  var s = time.getSeconds()
  s = s < 10 ? '0' + s : s
  return y + '年' + m + '月' + d + '日' + ' ' + h + ':' + mm + ':' + s
})
Vue.filter('formats', (ms) => {
  var time = new Date(ms)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()

  return y + '年' + m + '月' + d + '日'
})
