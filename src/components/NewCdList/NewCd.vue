<template>
  <div class="NewCd-contener">
    <router-link :to="{ path: '/album', query: { id: NewCdList.id } }" class="item">
      <span class="type" v-if="NewCdList.type">{{ NewCdList.type }}</span>
      <div class="img">
        <img :src="NewCdList.picUrl + '?param=120y120'" alt="" />
      </div>
      <div class="boxRight">
        <h5>{{ NewCdList.name }}</h5>
        <span>
          <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in NewCdList.artists" :key="author.id + k">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
        </span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['NewCdList']
}
</script>

<style lang="less" scoped>
.NewCd-contener {
  transition: 0.3s all;
  width: 100%;
  height: 100%;
  position: relative;
  // height: 50px;
  background-color: #f0f0f0;
  padding-top: 35%;
  border-radius: 25px;
  // overflow: hidden;
  // margin-bottom: 5%;

  &:hover {
    width: calc(100% + 10%);
    height: calc(100% + 10%);
    transform: translateX(-5%) translateY(-5%);
    z-index: 999;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  }
  .type {
    position: absolute;
    top: 3%;
    right: -2%;
    z-index: 999;
    font-size: 13px;
    background-color: #e60026;
    color: #f5f5f5;
    height: 20px;
    width: 48px;
    border-radius: 10px;
    text-align: center;
    transform: rotateZ(45deg);
    transition: 0.3s all;
  }
}
.img {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding-right: 35%;
  background-image: url(../../assets/lo.gif);
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 25px 0 0 25px;
  overflow: hidden;
  img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: inherit;
    height: inherit;
  }
}
// h4 {
//   position: absolute;
//   top: 20%;
//   right: 27%;
// }
.boxRight {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 65%;
  color: #333;
  // background-color: khaki;
  h5 {
    text-align: center;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    width: 90%;
    text-align: center;
    font-size: 10px;
    a {
      color: #333;
    }
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.NewCd-contener:hover h5 {
  color: #f77e24;
}
.NewCd-contener:hover .type {
  transform: rotateZ(0);
  right: 50%;
  top: -3%;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
}
</style>
