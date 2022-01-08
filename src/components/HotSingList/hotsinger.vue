<template>
  <div class="hotsinger-continer">
    <router-link :to="{ path: 'singer', query: { id: list.id } }">
      <div class="img">
        <img :src="list.picUrl + '?param=120y120'" alt="" />
      </div>
      <span class="name">{{ list.name }}</span>
      <span class="albumSize">专辑：{{ list.albumSize }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['list']
}
</script>

<style lang="less" scoped>
.hotsinger-continer {
  transition: 0.3s all;
  &:hover {
    transform: translateY(-10px);
  }
}
.img {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 5px;
  img {
    width: 100%;
    height: 100%;
  }
}
span {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 14px;
}
.name {
  color: #333;
  margin-bottom: 6px;
}
.albumSize {
  color: #ccc;
}
</style>
