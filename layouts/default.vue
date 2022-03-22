<template>
  <el-container class="layout-default">
    <my-header />
    <el-main>
      <nuxt />
    </el-main>
    <el-footer height="100%">
      <my-footer />footer
    </el-footer>
  </el-container>
</template>

<script>
import MyHeader from '@/components/public/header/index.vue'
import MyFooter from '@/components/public/footer/index.vue'
export default {
  components: {
    MyHeader,
    MyFooter
  }
}
</script>
