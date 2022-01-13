<template>
  <div class="divcd">
    <router-link :to="{ path: 'detail', query: { id: playCdList.id } }" class="faceImg" v-if="JSON.stringify(playCdList) !== '{}'">
      <div class="box">
        <img :src="playCdList.coverImgUrl + '?param=200y200'" alt="" />
        <span class="count"><i class="el-icon-headset"></i>{{ playCdList.playCount | setCount }}</span>
      </div>
      <span class="msg">{{ playCdList.name }}</span>
    </router-link>
    <!-- v-if="details.tags" -->
    <div class="cover-tags" v-if="playCdList.tags">
      <router-link :to="{ path: '/playlist', query: { cat: tag } }" class="tag" v-for="(tag, index) in playCdList.tags" :key="index">#{{ tag }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['playCdList']
}
</script>

<style lang="less" scoped>
.divcd {
  position: relative;
  transition: transform 0.3s;
  position: relative;
  border-radius: 35px;

  // width: 200px;
  // height: auto;
  // background-color: red;
  // vertical-align :middle
  // overflow: hidden;
  padding-top: 100%;
  margin-bottom: 25px;
  .msg {
    position: absolute;
    width: 100%;
    top: 100%;
    left: 0;
    opacity: 1;
    text-align: center;
    // text-align: center;
    // transition: all 0.3s;
    transition-property: top, opacity, transform;
    transition-duration: 0.3s;
    // transform: translateY(-50%);
    text-shadow: 1px 1px 4px #000;

    color: #fff;
    font-size: 15px;
    overflow: hidden !important;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cover-tags {
    width: 100%;
    position: absolute;
    top: 110%;
    left: 0;
    text-align: center;
    a {
      color: #333;
      font-size: 10px;
    }
  }
  .box {
    background-image: url(../../assets/lo.gif);
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 35px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .count {
      position: absolute;
      top: 2%;
      right: 0;
      padding-right: 10%;
      background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 97%, rgba(0, 0, 0, 0.5) 100%);
      font-size: 10px;
      color: #fff;
      text-shadow: 1px 1px 4px #000;
    }
    img {
      vertical-align: text-top;
      width: 100%;
      transition: filter 0.3s;
      border-radius: 35px;
    }
  }
}
i {
  margin-right: 5px;
}
// .divcd:hover::after {
//   // transform: translateY(-15px);

//   background-color: rgba(255, 255, 255, 0.3);
// }
.divcd:hover img {
  filter: blur(10px);
}
.divcd:hover {
  transform: translateY(-5%);
}
.divcd:hover .msg {
  top: 50%;
  transform: translateY(-50%);
  opacity: 1;
}
</style>
