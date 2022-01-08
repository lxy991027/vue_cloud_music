<template>
  <div class="playListButton-continer">
    <router-link :to="{ name: 'myPlaylist', query: { id: item.id } }">
      <div class="box">
        <div class="img">
          <img :src="item.coverImgUrl" alt="" />
        </div>
        <div class="info">
          <span>{{ item.name }}</span>
          <em>
            {{ item.trackCount }}首 By.
            {{ item.creator.nickname }}
          </em>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['item']
}
</script>

<style lang="less" scoped>
.playListButton-continer {
  position: relative;
  width: 100%;
  // padding-top: 25%;
  height: 62px;
  flex-shrink: 0;
  // background-color: red;
  border-radius: 8px;
  &:hover {
    background-color: #dcdcdc;
  }
  .box {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background-color: olive;
    .img {
      height: 100%;
      width: 25%;
      // background-color: orange;
      overflow: hidden;
      border-radius: 8px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .info {
      // background-color: orchid;
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
        overflow: hidden;
        text-overflow: ellipsis;
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
