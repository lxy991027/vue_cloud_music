<template>
  <div>
    <Tag v-if="showMvBox" :list="mv_area" :settingList="mvListTagSetting" :tagValue.sync="mvListListTagValue" @cilckTag="mvListValue"></Tag>
    <div class="Tags" v-else></div>
    <div class="mvBoxList" :class="{ 'grid-template-columns5': count === 10, 'grid-template-columns4': count === 8 }">
      <MvList v-for="(item, index) in mv_list" :key="index" :list="item" v-show="index < count"></MvList>
    </div>
  </div>
</template>

<script>
import Tag from '@/components/Tag/tag.vue'
import MvList from '@/components/Mv-List/mv-list.vue'
export default {
  props: ['count', 'showMvBox'],
  data() {
    return {
      // 最新MV的TAG列表
      mv_area: [{ name: '全部' }, { name: '内地' }, { name: '港台' }, { name: '欧美' }, { name: '日本' }, { name: '韩国' }],
      mvListTagSetting: {
        // 设置MV的tag栏
        label: 'name',
        keys: 'name',
        type: 'name'
      },
      // MVTag栏切换状态
      mvListListTagValue: '',
      // 最新MV列表
      mv_list: [],
      // mv_listSplist: [],
      mv_params: { limit: 12 }
    }
  },
  components: {
    Tag,
    MvList
  },
  created() {
    for (let i = 0; i < 10; i++) {
      this.mv_list.push({})
    }
    // this.mvListValue()
  },
  methods: {
    // MV的TAG栏点击事件
    async mvListValue() {
      if (this.mvListListTagValue !== '全部') {
        this.mv_params.area = this.mvListListTagValue
      } else {
        this.mv_params.area = ''
      }

      const { data: res } = await this.$http.getNewMv(this.mv_params)
      if (res.code !== 200) return this.$message.error('MV列表获取失败')

      // 将获取到的MV列表保存到data中
      this.mv_list = res.data.slice(0, 12)
      // this.showCd()
      console.log(this.mvListListTagValue)
      console.log(this.mv_list)
    }
  },
  watch: {
    showMvBox(newVal) {
      if (newVal) {
        this.mvListValue()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Tags {
  width: 100%;
  height: 24px;
}
.mvBoxList {
  margin-top: 15px;
  display: grid;
  grid-column-gap: 15px;
  grid-row-gap: 15px;
  grid-template-columns: repeat(6, 1fr);
}
.grid-template-columns5 {
  grid-template-columns: repeat(5, 1fr);
}
.grid-template-columns4 {
  grid-template-columns: repeat(4, 1fr);
}
</style>
