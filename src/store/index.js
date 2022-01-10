import Vue from 'vue'
import Vuex from 'vuex'
import { Message } from 'element-ui'

Vue.use(Vuex)
const songFilter = (context, value, onlyAdd) => {
  if (value.vip && !value.cloud) {
    Message.error('该歌曲需要VIP，请使用客户端播放')
    return false
  }
  // 如果当前需要播放的歌曲和正在播放但是暂停的歌曲ID一样则调用播放函数继续播放
  if (context.state.playId === value.id) {
    context.commit('bofang')
    return false
  }
  console.log(context.state.playList.indexOf(value))
  //  如果歌单里面包含这首歌,就不会再次添加重复
  // if (context.state.playList.indexOf(value) === -1) {
  //   console.log('123')
  //   console.log(context.state.playList)
  //   console.log(context, value)
  //   // 调用把歌曲对象添加入播放列表数组
  //   context.commit('AddSong', value)
  // }

  // context.state.playList.forEach((item) => {
  //   if (item.id === value.id) {
  //     return false
  //   }
  // })
  // 如果列表里面找到和当前歌单一样的ID，说明当前列表里面包含用户现在选中的歌曲的对象，则直接获取列表里的对象播放即可
  for (let i = 0; i < context.state.playList.length; i++) {
    if (context.state.playList[i].id === value.id) {
      // 如果onlyAdd的值为真，则当前并不想播放
      if (!onlyAdd) {
        context.commit('PlayStatus', { status: true, value: context.state.playList[i] })
      } else {
        // 如果onlyAdd的值为真则会走到这里
        Message.error('播放列表已存在改歌曲')
      }

      return false
    }
  }
  return true
}
export default new Vuex.Store({
  state: {
    isLogin: false, // 是否登录
    userInfo: null, // 登录用户信息
    loginDialogVisible: false, // 登录弹窗显示与隐藏
    isPlayed: false, // 当前播放状态
    playList: [], // 播放列表
    playIndex: null, // 当前播放歌曲在播放列表的所有位置
    playListTips: 0, // 添加及播放成功后，播放列表按钮提示的文字
    // 当前正在播放的音乐的id
    playId: '',
    songTime: 0
  },
  mutations: {
    AddSong(state, value) {
      state.playList.push(value)
      console.log(state.playList)
    },
    PlayStatus(state, value) {
      state.isPlayed = value.status
      // 保存当前需要播放的歌曲的索引值
      state.playIndex = state.playList.indexOf(value.value)
      console.log(state.playIndex, '索引值')

      // 当前需要播放的歌曲的索引值
      // console.log(value[1])
    },
    zanting(state, value) {
      state.isPlayed = false
    },
    bofang(state, value) {
      state.isPlayed = true
    },
    showDialog(state, value) {
      state.loginDialogVisible = value
    },
    setUserInfo(state, value) {
      state.userInfo = value
    },
    setLogin(state, value) {
      state.isLogin = value
    }
  },
  actions: {
    addSong(context, value) {
      if (!songFilter(context, value)) {
        return
      }
      // 如果没有找到对应的ID值，则歌单内没有当前选中的歌曲则先添加进歌单
      context.commit('AddSong', value)
      // 然后再播放
      context.commit('PlayStatus', { status: true, value })
    },
    onlyAddSong(context, value) {
      if (!songFilter(context, value, true)) {
        return
      }
      // 如果没有找到对应的ID值，则歌单内没有当前选中的歌曲则先添加进歌单
      context.commit('AddSong', value)
      // 添加成功给提示
      Message.success('添加成功')
      if (context.state.playList.length === 1) {
        // 如果当前歌单只有一首歌曲，则播放
        context.commit('PlayStatus', { status: true, value })
      }
    }
  }
  // getters: {
  //   isLogin(state) {
  //     return state.isLogin || JSON.parse(window.sessionStorage.getItem('isLogin'))
  //   },
  //   userInfo(state) {
  //     return state.userInfo || JSON.parse(window.sessionStorage.getItem('userInfo'))
  //   }
  // }
  // getters: {}
  // modules: {}
})
