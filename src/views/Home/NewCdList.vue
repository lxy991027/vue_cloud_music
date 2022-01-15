<template>
  <div>
    <Tag :list="NewCdListTag" :settingList="NewCdListTagSetting" :tagValue.sync="NewCdListListTagValue" @cilckTag="newCdListValue"></Tag>
    <div class="newCd" :class="{ 'grid-template-columns4 ': count === 16, 'grid-template-columns3 ': count === 9 }">
      <NewCd v-for="(item, index) in NewCdList" :key="item.id + index" :NewCdList="item" v-show="index < count"></NewCd>
    </div>
  </div>
</template>

<script>
import Tag from '@/components/Tag/tag.vue'
import NewCd from '@/components/NewCdList/NewCd.vue'
export default {
  props: ['count'],
  data() {
    return {
      // 新碟上架tag
      NewCdListTag: [
        {
          name: '全部',
          code: 'all'
        },
        {
          name: '华语',
          code: 'zh'
        },
        {
          name: '欧美',
          code: 'ea'
        },
        {
          name: '韩国',
          code: 'kr'
        },
        {
          name: '日本',
          code: 'jp'
        }
      ],
      NewCdListTagSetting: {
        // 设置标题
        label: 'name',
        // 设置key
        keys: 'name',

        type: 'code'
      },
      // 新碟推荐Tag栏切换
      NewCdListListTagValue: '',
      // 新碟上架请求数据
      NewCdParams: {
        limit: 9
      },
      // 新碟列表
      NewCdList: []
    }
  },
  created() {
    this.newCdListValue()
  },
  methods: {
    async newCdListValue() {
      this.NewCdList = []
      // 新碟推荐Tag栏点击事件
      this.NewCdParams.area = this.NewCdListListTagValue
      console.log(this.NewCdListListTagValue, '哈哈')
      const { data: res } = await this.$http.topAlbum(this.NewCdParams)
      console.log(res, '新碟', this.NewCdParams)
      if (res.code !== 200) return this.$message.error('数据请求失败')
      // if (this.NewCdParams.area === 'all' || this.NewCdParams.area === '') {
      // this.NewCdList = res.weekData.slice(0, 25)
      // } else {
      this.NewCdList = res.monthData.slice(0, 25)
      // }

      // this.showCd()
      console.log(this.NewCdList, '里面的')
      // console.log(this.NewCdListListTagValue)
    }
  },
  components: {
    Tag,
    // PlayCd
    NewCd
    // MvList,
    // RanKing,
    // hotsingerlist,
    // HotMusicList
  }
}
</script>

<style lang="less" scoped>
.newCd {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 15px;
}
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
.grid-template-columns3 {
  grid-template-columns: repeat(3, 1fr);
}
</style>
