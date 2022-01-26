<template>
  <div>
    <div class="hotSingerBox">
      <hotsingerlist v-for="(item, index) in artists_list" :key="item.id + '' + index" :list="item" v-show="index < count"></hotsingerlist>
    </div>
  </div>
</template>

<script>
import hotsingerlist from '@/components/HotSingList/hotsinger.vue'
export default {
  props: ['count'],
  data() {
    return {
      artists_list: [],
      artists_params: { limit: 11 }
    }
  },
  created() {
    this.getArtists()
  },
  methods: {
    // 热门歌手
    async getArtists() {
      const { data: res } = await this.$http.topArtists(this.artists_params)

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }

      this.artists_list = res.artists
      // this.showCd()
      console.log(this.artists_list, '热门歌手')
    }
  },
  components: {
    hotsingerlist
  }
}
</script>

<style lang="less" scoped>
.hotSingerBox {
  display: flex;
  justify-content: space-between;
}
</style>
