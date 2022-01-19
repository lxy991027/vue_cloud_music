<template>
  <div>这里是歌单的列表</div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      sub: {}
    }
  },
  created() {
    this.getCatlist()
  },
  methods: {
    async getCatlist() {
      const { data: res } = await this.$http.catlist()
      if (res.code !== 200) this.$message.error('数据请求失败')
      this.sub = res.sub
      for (const k in res.categories) {
        const params = { name: res.categories[k] }

        params.children = this.sub.filter((subItem) => {
          return subItem.category === Number(k)
        })
        this.categories.push(params)
      }
      // console.log(this.categories, '1')
      // this.curType = this.$route.query.cat ? this.$route.query.cat : res.all.name
      // this.allList = res.all
      // this.getMoreTxt()
    }
  }
}
</script>

<style lang="less" scoped></style>
