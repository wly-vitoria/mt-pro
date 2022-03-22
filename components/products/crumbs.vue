<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <!-- 如果要把'市'去掉：$store.state.geo.position.city.replace('市','') -->
      <el-breadcrumb-item :to="{ path: '/' }">{{ $store.state.geo.position.city }}美团</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">{{ $store.state.geo.position.city }}{{ decodeURIComponent(keyword) }}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      default: ''
    }
  }
}
</script>
