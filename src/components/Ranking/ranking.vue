<template>
  <div>
    <div class="box">
      <img :src="TopListslice.coverImgUrl + '?param=200y400'" alt="" />
      <h2>{{ TopListslice.name }}</h2>
      <ol>
        <li v-for="(item2, index) in TopListslice.value" :key="item2.id">
          <span class="index">{{ index + 1 }}</span>

          <div>
            <router-link :to="{ path: '/song', query: { id: item2.id } }" class="config">
              <span class="title">{{ item2.name }}</span>
            </router-link>
            <!-- <a href="#">
              <span class="title">{{ item2.name }}</span>
            </a> -->
            <div class="name">
              <!-- <a href="#" v-for="(item3, index) in item2.ar" :key="item3.id">
                <span> {{ index !== 0 ? '/ ' + item3.name : item3.name }}</span>
              </a> -->
              <router-link :to="{ path: '/singer', query: { id: author.id } }" class="song_name" v-for="(author, k) in item2.ar" :key="author.id + k">{{ k !== 0 ? ' / ' + author.name : author.name }}</router-link>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  props: ['TopListslice']
}
</script>

<style lang="less" scoped>
.box:hover {
  // box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.7);
  width: 370px;
  // height: calc(100% + 10%);
  // transform: translateX(-5%) translateY(-5%);
  z-index: 999;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
}
.box {
  border-radius: 20px;
  position: relative;
  transition: all 0.3s;
  width: 250px;
  overflow: hidden;
  // height: 400px;
  // background-color: red;
  padding: 20px;
  &:hover img {
    transform: scale(2);
  }
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    filter: blur(60px);
    transform: scale(1.5);
    // transition: all 0.3s;
    top: 0;
    left: 0;
    z-index: -999;
  }
  .index {
    font-size: 20px;
    color: #fff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  }
  li {
    display: flex;
    align-items: center;
    a {
      color: #fff;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
    }
    div {
      width: 100%;
      padding: 5px 0 5px 10px;
      .title {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // background-color: black;
      }
      .name {
        padding: 0;
        font-size: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        color: #fff;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
      }
    }
  }
  h2 {
    position: relative;
    width: 100%;
    text-align: center;
    color: #fff;
    margin-bottom: 50px;
    &::after {
      position: absolute;
      content: '';
      border-bottom: 3px solid #fff;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 50%;
    }
  }
}
</style>
