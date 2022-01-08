<template>
  <div class="mv-continer" @click="abc">
    <router-link :to="{ path: '/mv', query: { id: list.id } }">
      <div class="box">
        <div class="img">
          <img :src="list.cover" alt="" />
        </div>
        <div class="info">
          <h3>{{ list.name }}</h3>
          <span>
            <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in list.artists" :key="author.name">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
          </span>
          <em><i class="el-icon-video-camera"></i>{{ list.playCount | setCount }}</em>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    abc() {
      console.log(this.list)
    }
  }
}
</script>

<style lang="less" scoped>
.mv-continer {
  position: relative;
  padding-top: 120%;
  // background-color: red;
  width: 100%;
  height: 100%;
  transition: 0.3s all;
  &:hover {
    width: calc(100% + 10%);
    height: calc(100% + 10%);
    transform: translateX(-5%) translateY(-5%);
    z-index: 999;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  }
  .box {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    // background-color: orange;
    color: #333;
    .img {
      width: 100%;
      height: 50%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .info {
      position: relative;
      padding: 25px 15px;
      width: 100%;
      height: 50%;
      background-color: #fff;
      h3 {
        font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      span {
        display: block;
        color: #999;
        font-size: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a {
          color: #333;
        }
      }
      em {
        position: absolute;
        bottom: 10%;
        font-style: normal;
        color: #999;
        font-size: 15px;
        i {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
