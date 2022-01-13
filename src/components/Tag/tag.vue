<template>
  <div>
    <ul>
      <li v-for="(item, index) in list" :key="item[settingList.keys]" @click="childclick(item[settingList.type], index)" :class="index == playIndex ? 'active' : ''">{{ item[settingList.label] }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['list', 'settingList', 'nowStatus'],
  data() {
    return {
      playIndex: 0
    }
  },
  mounted() {
    this.status()
  },
  methods: {
    childclick(label, index) {
      // console.log(this.playIndex)
      this.$emit('update:tagValue', label)
      if (index !== this.playIndex) {
        this.$emit('cilckTag')
      }
      this.playIndex = index
    },
    status() {
      // console.log(this.settingList.nowStatus, '里面')
      if (!this.settingList.nowStatus) return
      // console.log(1)
      // console.log(this.list[1].name)
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i][this.settingList.type] === this.settingList.nowStatus) {
          console.log(i)
          console.log(this.list[i][this.settingList.type])
          this.playIndex = i
          this.childclick(this.list[i][this.settingList.type], i)

          return
        }
      }
    }
  },

  watch: {
    list(newValue, oldValue) {
      this.childclick(newValue[0][this.settingList.label], this.playIndex)
    }
  }
}
</script>

<style lang="less" scoped>
ul {
  display: flex;
  justify-content: center;
  // background-color: pink;
  font-size: 15px;
  height: 24px;
  li {
    cursor: pointer;
    margin: 0 24px;
    padding: 0 10px 2px 10px;
    -moz-user-select: none;
    -khtml-user-select: none;
    user-select: none;

    &:hover {
      border-bottom: 2px solid red;
    }
  }
}
.active {
  // background-color: red;
  border-bottom: 2px solid red;
}
</style>
