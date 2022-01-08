<template>
  <div class="otherCd-continer">
    <ul>
      <li v-for="item in list" :key="item.id">
        <!-- '/playlist/detail', query: { id: item.id }} -->
        <router-link class="box" :to="{ path: '/detail', query: { id: item.id } }">
          <div class="img">
            <img :src="item.coverImgUrl + '?param=70y70'" alt="" />
          </div>
          <div class="info">
            <span>{{ item.name }}</span>
            <em>
              <div class="recom-author">
                By. <router-link :to="{ path: '/user', query: { id: item.creator.userId } }">{{ item.creator.nickname }}</router-link>
              </div>
            </em>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {
      playlists: []
    }
  },
  created() {
    // console.log(this.list, '里面')
  },
  watch: {
    list(newVal) {
      this.playlists = newVal
    }
  }
}
</script>

<style lang="less" scoped>
.otherCd-continer {
  margin-top: 10px;
}
li {
  position: relative;
  width: 100%;
  // background-color: olive;
  padding-top: 28%;
  margin-bottom: 15px;
  .box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: rosybrown;
    .img {
      height: 100%;
      width: 28%;
      // background-color: red;
      overflow: hidden;
      border-radius: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      width: 72%;
      height: 100%;
      // background-color: orange;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 3px 0 3px 10px;
      em {
        font-style: normal;
        color: #999;
        font-size: 10px;
        a {
          color: #999;
        }
      }
      span {
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-all;
        cursor: pointer;
        color: #333;
      }
    }
  }
}
</style>
