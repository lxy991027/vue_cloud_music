<template>
  <div class="menu">
    <div class="oneMenu" @click="changeHeight">
      <span>{{ title }} ({{ list.length }})</span>
      <i class="iconfont icon-arrow" :class="{ rotate: menuHeight === 0 }"></i>
    </div>
    <div class="value" :style="{ height: `${menuHeight}px` }">
      <div @click="anxia" v-for="(item, index) in list" :key="item.id" :class="{ listb: index < list.length - 1 }" class="list" ref="list" :style="{ 'background-color': color(item.id + '') }">
        <playListButton :item="item"></playListButton>
      </div>
    </div>
  </div>
</template>

<script>
import playListButton from './playListButton.vue'
export default {
  props: ['title', 'list'],
  mounted() {
    this.menuHeight = this.$refs.list[0].offsetHeight * this.list.length + (5 * this.list.length - 1)
    console.log(this.menuHeight, '在哪里？')
    console.log(this.$route.query.id, '这里是ID')
    this.id = this.$route.query.id + ''
  },
  data() {
    return {
      menuHeight: 0,
      menuHeights: 0,
      id: ''
    }
  },
  components: {
    playListButton
  },
  methods: {
    changeHeight() {
      // const value=
      if (this.menuHeight !== 0) {
        this.menuHeights = this.menuHeight
        this.menuHeight = 0
      } else {
        this.menuHeight = this.menuHeights
      }
    },
    anxia() {
      this.id = this.$route.query.id + ''
    }
  },
  computed: {
    color() {
      return (id) => {
        if (id === this.id) {
          console.log(this.id, id)
          return '#dcdcdc'
        }
      }
    }
  },
  watch: {
    $route: {
      handler() {
        this.id = this.$route.query.id
        // this.init()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.menu {
  margin-bottom: 5px;
  .oneMenu {
    width: 100%;
    height: 40px;
    // background-color: pink;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 10px;
    background-color: #f0f0f0;
    cursor: pointer;
    span {
      font-size: 14px;
    }
    i {
      transition: all 0.5s;
    }
  }
  .value {
    display: flex;
    flex-direction: column;
    // align-items: flex-end;
    // height: 100px;
    justify-content: flex-end;
    // background-color: red;
    overflow: hidden;
    transition: height 0.5s;
    // background-color: red;
  }
}
.listb {
  margin-bottom: 5px;
}
.rotate {
  transform: rotate(-180deg);
}
.list {
  border-radius: 8px;
}
</style>
