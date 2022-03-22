<template>
  <div class="m-header">
    <!-- 城市、用户、导航  geo、user、nav -->
    <el-row>
      <el-col>
        <top-bar />
      </el-col>
    </el-row>
    <!-- 搜索框 -->
    <el-row>
      <el-col>
        <search-bar />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import topBar from './topbar.vue'
import searchBar from './searchbar.vue'
export default {
  components: {
    topBar,
    searchBar
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/public/header/index.scss";
</style>
