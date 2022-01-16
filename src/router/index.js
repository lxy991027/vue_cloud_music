import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home/Home.vue'
import Singer from '@/views/singer/singer.vue'
import Mv from '@/views/mv/mv.vue'
import Song from '@/views/song/song.vue'
import Album from '@/views/album/album.vue'
import Detail from '@/views/detail/detail.vue'
import songList from '@/views/songList/songList.vue'
import allCd from '@/views/allCd/allCd.vue'
import songListMv from '@/views/songListMv/songListMv.vue'
import myUser from '@/views/myUser'
import Playlist from '@/views/myUser/playlist.vue'
import Favorite from '@/views/myUser/favorite.vue'
import cloudSongList from '@/views/myUser/cloudSongList.vue'
import AlbumSunlist from '@/views/myUser/albumSunlist.vue'
import Rank from '@/views/rank/rank.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Home' },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer,
    redirect: '/singer/songList',
    children: [
      { path: '/singer/songList', component: songList },
      { path: '/singer/allCd', component: allCd },
      { path: '/singer/songListMv', component: songListMv }
    ]
  },
  {
    path: '/mv',
    name: 'mv',
    component: Mv
  },
  {
    path: '/song',
    name: 'song',
    component: Song
  },
  {
    path: '/album',
    name: 'album',
    component: Album
  },
  {
    path: '/detail',
    name: 'detail',
    component: Detail
  },
  {
    path: '/myuser',
    name: 'myuser',
    component: myUser,
    children: [
      { path: '/myuser/playlist', name: 'myPlaylist', component: Playlist },
      { path: '/myuser/favorite', name: 'myFavorite', component: Favorite },
      { path: '/myuser/cloudSongList', name: 'myCloudSongList', component: cloudSongList },
      // AlbumSunlist
      { path: '/myuser/albumSunlist', name: 'myAlbumSunlist', component: AlbumSunlist }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
