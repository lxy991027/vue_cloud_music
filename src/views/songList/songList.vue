<template>
  <div>
    <song-list :list="hotSongs"></song-list>
  </div>
</template>

<script>
import songList from '@/components/songList/song-list.vue'
import { mapState } from 'vuex'
export default {
  components: {
    songList
  },
  data() {
    return {
      hotSongs: []
      // id: this.$route.query.id
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getArtist()
    },
    async getArtist() {
      const { data: res } = await this.$http.artists({ id: this.$route.query.id, timestamp: new Date().valueOf() })
      console.log(res)
      if (res.code !== 200) return this.$message.error('歌手信息获取失败')
      // this.artist[0] = res.artist
      // console.log(this.artist, '7489')
      this.hotSongs = this.$format._format(res.hotSongs)

      console.log(this.hotSongs)
    }
  },
  computed: {
    ...mapState(['userInfo', 'isLogin'])
  },
  watch: {
    $route: {
      handler() {
        // this.Uid = this.$route.query.id
        this.init()
      },
      deep: true
    },
    isLogin() {
      this.init()
    }
  }
}
</script>

<style></style>
