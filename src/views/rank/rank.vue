<template>
  <div class="rank-continer">
    <div class="w">
      <div class="left">
        <div class="typeMenu">
          <span :class="type === 'Top' ? 'active' : ''" @click="selectType('Top')">TOP榜</span>
          <span :class="type === 'Feature' ? 'active' : ''" @click="selectType('Feature')">特色榜</span>
          <span :class="type === 'Other' ? 'active' : ''" @click="selectType('Other')">场景榜</span>
        </div>
        <ul class="buttons">
          <li v-for="item in list" :key="item.id" :class="{ xuanzhong: id + '' === item.id + '' }" @click="changeId(item.id)">
            <RankButton :item="item" :type="type"></RankButton>
          </li>
        </ul>
      </div>
      <div class="right">
        <PlayList v-if="this.$route.query.id"></PlayList>
      </div>
    </div>
  </div>
</template>

<script>
import RankButton from './rankButton.vue'
import PlayList from '@/views/myUser/playlist.vue'
export default {
  data() {
    return {
      id: '',
      type: 'Top',
      listTop: [],
      listFeature: [],
      listOther: [],
      list: []
    }
  },
  created() {
    this.id = this.$route.query.id
    console.log(this.id)
    this.type = this.$route.query.type ? this.$route.query.type : this.type
    this.getTopListDetail()
  },
  methods: {
    selectType(type) {
      this.type = type
      console.log('list' + this.type, '什么玩意')
      this.list = this['list' + this.type]
      console.log(this.list)
      this.id = this['list' + type][0].id
      // if (this.$route.path === `/rank?type=${this.type}&id=${this.id}`) return
      this.$router.push({ name: 'rank', query: { type: this.type, id: this.id } })
    },
    async getTopListDetail() {
      const { data: res } = await this.$http.topListDetail()
      console.log(res)
      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }

      // 云音乐TOP榜
      this.listTop = res.list.filter((item) => {
        return item.ToplistType
      })
      console.log(this.listTop, 'this.listTop')
      // 云音乐特色榜
      this.listFeature = res.list.filter((item) => {
        return !item.ToplistType && item.name.indexOf('云音乐') >= 0
      })
      console.log(this.listFeature, ' this.listFeature')
      // 其他场景榜
      this.listOther = res.list.filter((item) => {
        return !item.ToplistType && item.name.indexOf('云音乐') < 0
      })

      console.log(this.listOther, ' this.listOther')
      this.list = this.type ? this['list' + this.type] : this.listTop
      // this.id = this.id ? this.id : this.listTop[0].id
      const id = this.$route.query.id ? this.$route.query.id : this.listTop[0].id
      // this.id
      // if (this.$route.path === `/rank?type=${this.type}&id=${this.id}`) return
      console.log(this.id, '什么JBid', this.$route.query.id)
      if (this.id) return
      this.$router.push({ name: 'rank', query: { type: this.type, id: id } })
      this.id = id
    },
    changeId(id) {
      this.id = id
    }
  },
  components: {
    RankButton,
    PlayList
  }
}
</script>

<style lang="less" scoped>
.rank-continer {
  padding: 15px 0;
  .w {
    display: flex;
    .left {
      width: 251px;
      // height: 100vh;
      flex-shrink: 0;
      // background-color: pink;
      .typeMenu {
        display: flex;
        justify-content: space-around;
        align-items: center;
        // background-color: sandybrown;
        height: 50px;
        span {
          font-size: 13px;
          height: 20px;
          cursor: pointer;
        }
      }
      .buttons {
        li {
          margin-bottom: 5px;
          border-radius: 8px;
        }
      }
    }
    .right {
      width: 100%;
      min-width: 0;
      margin-left: 15px;
      // height: 100vh;
      // background-color: red;
    }
  }
}
.active {
  border-bottom: 2px solid red;
}
.xuanzhong {
  background-color: #dcdcdc;
}
</style>
