<template>
  <div>
    <song-list :list="list"></song-list>
  </div>
</template>

<script>
import songList from '@/components/songList/song-list.vue'
export default {
  props: ['list'],
  components: {
    songList
  }
}
</script>

<style></style>
