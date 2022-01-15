<template>
  <div class="hotMusicList-continer">
    <Tag :list="HotMusicList" :settingList="HotMusicListTagSetting" :tagValue.sync="hotMusicListTagValue" @cilckTag="getHotMusicValue"></Tag>
    <div class="CD" ref="CD" :class="{ 'grid-template-columns6': count === 6, 'grid-template-columns5': count === 5 }">
      <PlayCd v-for="(item, index) in playMusicList" :key="item.id + index" :playCdList="item" v-show="index < count"></PlayCd>
    </div>
  </div>
</template>

<script>
import Tag from '@/components/Tag/tag.vue'
import PlayCd from '@/components/PlayCd/playcd.vue'
export default {
  props: ['count', 'showHotMusicList'],
  data() {
    return {
      // 热歌tag列表
      HotMusicList: [],
      // Tag栏的属性设置
      HotMusicListTagSetting: {
        // 设置标题
        label: 'name',
        // 设置key
        keys: 'createTime',
        type: 'name'
      },
      // TAG切换
      hotMusicListTagValue: '',
      playMusicList: [{}],
      playlist_params: {
        limit: 8,
        offset: 0,
        cat: ''
      }
    }
  },
  created() {
    // this.getHotMusicList()
    // this.getHotMusicValue()
  },
  methods: {
    async getHotMusicValue() {
      this.playMusicList = [{}]
      console.log(this.hotMusicListTagValue)
      if (this.hotMusicListTagValue === '为您推荐') {
        this.playlist_params.cat = ''
      } else {
        this.playlist_params.cat = this.hotMusicListTagValue
      }
      const { data: res } = await this.$http.playlist(this.playlist_params)
      if (res.code !== 200) return this.$message.error('推荐列表获取失败')
      this.playMusicList = res.playlists.slice(0, 8)

      // this.showCd()
      console.log(res.playlists)
    },
    // 获取热歌列表
    async getHotMusicList() {
      try {
        const { data: res } = await this.$http.getHotMusicList()
        if (res.code !== 200) return this.$message.error('获取失败')
        res.tags.unshift({ name: '为您推荐' })
        this.HotMusicList = res.tags.splice(0, 6)
        console.log(this.HotMusicList)
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    Tag,
    PlayCd
    // NewCd,
    // MvList,
    // RanKing,
    // hotsingerlist,
    // HotMusicList
  },
  watch: {
    showHotMusicList(newVal) {
      if (newVal) {
        this.getHotMusicList()
        this.getHotMusicValue()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.CD {
  margin-top: 15px;
  display: grid;
  // justify-content: space-around;
  grid-template-columns: repeat(8, 1fr);
  grid-column-gap: 3%;
}
.grid-template-columns6 {
  grid-template-columns: repeat(6, 1fr);
}
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
}
</style>
