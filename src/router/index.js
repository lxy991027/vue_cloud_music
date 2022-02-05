import Vue from 'vue'
import VueRouter from 'vue-router'
// import Search from '@/views/search/search.vue'
const Search = () => import(/* webpackChunkName: "Login_Search" */ '@/views/search/search.vue')
// import Playlist from '@/views/myUser/playlist.vue'
const Playlist = () => import(/* webpackChunkName: "Login_Playlist" */ '@/views/myUser/playlist.vue')
// import Album from '@/views/album/album.vue'
const Album = () => import(/* webpackChunkName: "Login_Album" */ '@/views/album/album.vue')
// import Mv from '@/views/mv/mv.vue'
const Mv = () => import(/* webpackChunkName: "Login_Mv" */ '@/views/mv/mv.vue')
// import Detail from '@/views/detail/detail.vue'
const Detail = () => import(/* webpackChunkName: "Login_Detail" */ '@/views/detail/detail.vue')
// import Song from '@/views/song/song.vue'
const Song = () => import(/* webpackChunkName: "Login_Song" */ '@/views/song/song.vue')
// import songListMv from '@/views/songListMv/songListMv.vue'
const songListMv = () => import(/* webpackChunkName: "Login_Singer_songList_allCd_songListMv" */ '@/views/songListMv/songListMv.vue')
// import allCd from '@/views/allCd/allCd.vue'
const allCd = () => import(/* webpackChunkName: "Login_Singer_songList_allCd_songListMv" */ '@/views/allCd/allCd.vue')
// import songList from '@/views/songList/songList.vue'
const songList = () => import(/* webpackChunkName: "Login_Singer_songList_allCd_songListMv" */ '@/views/songList/songList.vue')
// import Singer from '@/views/singer/singer.vue'
const Singer = () => import(/* webpackChunkName: "Login_Singer_songList_allCd_songListMv" */ '@/views/singer/singer.vue')
// import Artist from '@/views/artist/artist.vue'
const Artist = () => import(/* webpackChunkName: "Login_PlayLists_Mvlist_Rank_Artist" */ '@/views/artist/artist.vue')
// import Mvlist from '@/views/mvlist/mvlist.vue'
const Mvlist = () => import(/* webpackChunkName: "Login_PlayLists_Mvlist_Rank_Artist" */ '@/views/mvlist/mvlist.vue')
// import PlayLists from '@/views/playLists/playLists.vue'
const PlayLists = () => import(/* webpackChunkName: "Login_PlayLists_Mvlist_Rank_Artist" */ '@/views/playLists/playLists.vue')
// import Rank from '@/views/rank/rank.vue'
const Rank = () => import(/* webpackChunkName: "Login_PlayLists_Mvlist_Rank_Artist" */ '@/views/rank/rank.vue')
// import Favorite from '@/views/myUser/favorite.vue'
const Favorite = () => import(/* webpackChunkName: "Login_myUser_AlbumSunlist_cloudSongList_Favorite" */ '@/views/myUser/favorite.vue')
// import cloudSongList from '@/views/myUser/cloudSongList.vue'
const cloudSongList = () => import(/* webpackChunkName: "Login_myUser_AlbumSunlist_cloudSongList" */ '@/views/myUser/cloudSongList.vue')
// import AlbumSunlist from '@/views/myUser/albumSunlist.vue'
const AlbumSunlist = () => import(/* webpackChunkName: "Login_myUser_AlbumSunlist_cloudSongList" */ '@/views/myUser/albumSunlist.vue')
// import myUser from '@/views/myUser'
const myUser = () => import(/* webpackChunkName: "Login_myUser_AlbumSunlist_cloudSongList" */ '@/views/myUser')
// import Home from '@/views/Home/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home" */ '@/views/Home/Home.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
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
    path: '/playLists',
    name: 'PlayLists',
    component: PlayLists
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
    path: '/mvlist',
    name: 'mvlist',
    component: Mvlist
  },
  {
    path: '/artist',
    name: 'artist',
    component: Artist
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
    path: '/search',
    name: 'search',
    component: Search
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
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
