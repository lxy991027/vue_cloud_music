import api from '@/api/instance.js'
// 首页的轮播图
const getBanner = () => api.get('/banner')
// 获取热门歌曲Tab栏g歌单分类选项
const getHotMusicList = () => api.get('/playlist/hot')
// 推荐歌曲列表
const playlist = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => api.get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`)
// 新碟上架
const topAlbum = ({ limit = 20, offset = 0, area = 'all', type = 'new', year = '', month = '' }) => api.get(`/top/album?limit=${limit}&offset=${offset}&area=${area}&type=${type}&year=${year}&month=${month}`)
// 排行榜
const toplist = () => api.get('/toplist', {})
// 歌单列表
const playList = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => api.get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`, {})
// 歌单详情
const listDetail = ({ id = '', s = 8 }) => api.get(`/playlist/detail?id=${id}&s=${s}`, {})
// 最新MV
const getNewMv = ({ limit = 30, area = '' }) => api.get(`/mv/first?limit=${limit}&area=${area}`, {})
// 热门歌手
const topArtists = ({ limit = 30, offset = 0 }) => api.get(`/top/artists?limit=${limit}&offset=${offset}`, {})
// 歌手介绍
const artistDesc = ({ id = '' }) => api.get(`/artist/desc?id=${id}`, {})
// 歌手热门歌曲
const artists = ({ id = '' }) => api.get(`/artists?id=${id}`, {})
// 获取歌词
// /lyric?id=33894312
const getLyric = ({ id = '' }) => api.get(`/lyric?id=${id}`)
// 获取 mv详情
const mvDetail = ({ id = '' }) => api.get(`/mv/detail?mvid=${id}`, {})
// 获取MV地址
const mvUrl = ({ id = '', r = 1080 }) => api.get(`/mv/url?id=${id}&r=${r}`, {})
// 相似mv
const simiMv = ({ id = '' }) => api.get(`/simi/mv?mvid=${id}`, {})
// 获取mv评论
const commentMv = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => api.get(`/comment/mv?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {})
/* ********* 歌曲 ********* */
// 歌曲详情 多个id , 隔开
const songDetail = ({ ids = '', timestamp = 0 }) => api.post(`/song/detail?timestamp=${timestamp}`, { ids: ids })
// 获取相似音乐
const simiSong = ({ id = '' }) => api.get(`/simi/song?id=${id}`, {})
/* ********* 歌曲评论 ********* */
// 歌曲评论
const commentSong = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => api.get(`/comment/music?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {})
const albumSub = ({ id = '', t = 1 }) => api.get(`/album/sub?id=${id}&t=${t}`, {})

/*
 * 发送/删除评论
 * t: 0删除 1发送 2回复
 * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
 * id: 对应资源id
 * content: 发送的内容/对应内容的id
 * commentId: 回复的评论id
 */
const comment = ({ t = 1, type = 0, id = '', content = '', commentId = '' }) => api.get(`/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}`, {})
/* ********* 专辑 ********* */
// 获取专辑内容
const album = ({ id = '' }) => api.get(`/album?id=${id}`, {})
// 专辑动态信息
const albumDynamic = ({ id = '' }) => api.get(`/album/detail/dynamic?id=${id}`, {})

// 专辑评论
const albumComment = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => api.get(`/comment/album?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {})
// 获取歌手专辑
const artistAlbum = ({ id = '', limit = 50, offset = 0 }) => api.get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`, {})
// 收藏/取消收藏歌手
const artistSub = ({ id = '', t = '1' }) => api.get(`/artist/sub?id=${id}&t=${t}`, {})
// 歌单详情
const playlistdetail = ({ id = '', s = 8, timestamp = 0 }) => api.get(`/playlist/detail?id=${id}&s=${s}&timestamp=${timestamp}`, {})
// 歌单收藏用户
const playlistSCollect = ({ id = '', limit = 20, offset = 0 }) => api.get(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`, {})
// 相关歌单推荐
const playlistRelated = ({ id = '' }) => api.get(`/related/playlist?id=${id}`, {})
// 歌单评论
const playlistComment = ({ id = '', limit = 20, offset = 0, before = 0 }) => api.get(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}&before=${before}`, {})
// 获取歌手 mv
const artistMv = ({ id = '', limit = 50, offset = 0 }) => api.get(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`, {})
// 登录
const login = ({ phone = '', pwd = '', timestamp = 0 }) => api.get(`/login/cellphone?phone=${phone}&password=${pwd}&timestamp=${timestamp}`, {})
// 获取用户详情
const getUserInfo = ({ uid = '' }) => api.get(`/user/detail?uid=${uid}`, {})
// 登录状态
const logsss = ({ timestamp = 0 }) => api.get(`/user/account?timestamp=${timestamp}`, {})
// 退出登录
const logout = () => api.get('/logout', {})
// 获取用户歌单
const playlistUser = ({ uid = '', limit = 30, offset = 0 }) => api.get(`/user/playlist?uid=${uid}&limit=${limit}&offset=${offset}`, {})
// 歌单分类
const catlist = () => api.get('/playlist/catlist', {})
// 收藏的歌手列表
const subArtist = () => api.get('/artist/sublist', {})

const cloud = ({ limit = 200, offset = 0 }) => api.get(`/user/cloud?limit=${limit}&offset=${offset}`, {})

const cloudDetail = ({ ids = '' }) => api.get(`/song/url?id=${ids}`, {})
// 获取我收藏的专辑
const getAlbumSublist = ({ limit = 25, offset = 0 }) => api.get(`/album/sublist?limit=${limit}&offset=${offset}`, {})
// 收藏、取消歌单 1：收藏 2取消
const subPlayList = ({ t = 1, id = '' }) => api.get(`/playlist/subscribe?t=${t}&id=${id}`, {})
// 添加歌曲到歌单
const addPlayList = ({ op = 'add', pid = '', tracks = '' }) => api.get(`/playlist/tracks?op=${op}&pid=${pid}&tracks=${tracks}`, {})
// 所有榜单内容摘要
const topListDetail = () => api.get('/toplist/detail', {})
/* type: -1:全部; 1:男歌手; 2:女歌手; 3:乐队
 * area: -1:全部; 7华语; 96欧美; 8:日本; 16韩国; 0:其他
 * initial: 按首字母索引查找参数, 热门传-1, #传0
 * limit: 30
 * offset: 0
 */
const artistList = ({ type = -1, area = -1, initial = '', limit = 50, offset = 0 }) => api.get(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}`, {})
// 获取 mv
const mv = ({ area = '', type = '', order = '', limit = 50, offset = 0 }) => api.get(`/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`, {})
// 热门搜索
const serachHot = () => api.get('/search/hot', {})
// 搜索
const serachSuggest = ({ keywords = '' }) => api.get(`/search/suggest?keywords=${keywords}`, {})
export default {
  getBanner,
  getHotMusicList,
  playlist,
  topAlbum,
  toplist,
  listDetail,
  getNewMv,
  topArtists,
  artistDesc,
  artists,
  getLyric,
  mvDetail,
  mvUrl,
  simiMv,
  commentSong,
  commentMv,
  songDetail,
  simiSong,
  album,
  albumComment,
  artistAlbum,
  playlistdetail,
  playlistSCollect,
  playlistRelated,
  playlistComment,
  artistMv,
  login,
  getUserInfo,
  logsss,
  comment,
  playlistUser,
  logout,
  subArtist,
  cloud,
  cloudDetail,
  artistSub,
  albumDynamic,
  albumSub,
  getAlbumSublist,
  subPlayList,
  addPlayList,
  topListDetail,
  artistList,
  mv,
  catlist,
  playList,
  serachHot,
  serachSuggest
}
