<template>
  <div>
    <div class="w">
      <el-input placeholder="请输入歌名、歌词、歌手或专辑" v-model="keyVal" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyVal: this.$route.query.key,
      listType: {
        songs: '单曲',
        artists: '歌手',
        albums: '专辑',
        playlists: '歌单'
      }
    }
  },
  methods: {
    a() {
      console.log('a')
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 60%;
  height: 20px !important;
  margin: 50px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
/deep/.el-input__inner {
  border-radius: 16px 0 0 16px !important;
  border: 0;
  padding: 0;
  line-height: 32px;
  padding-left: 30px;
  // padding-top: 8px;
  height: 40px;
}
/deep/.el-input-group__append {
  background-color: #e60026;
  border-radius: 0 16px 16px 0;
  border: 0;
  // width: 20px;
  .el-icon-search {
    font-size: 20px;
    color: #fff;
  }
}
</style>
