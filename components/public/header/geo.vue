<template>
  <div class="m-geo">
    <!-- '北京市' 应该写成：{{ $store.state.geo.position.city }} -->
    <i class="el-icon-location">{{ $store.state.geo.position.city }}</i>
    <nuxt-link class="changeCity" to="/changeCity" @click="checkVuex">
      切换城市
    </nuxt-link>
    [香河 廊坊 天津]
  </div>
</template>

<script>
export default {
  methods:{
    checkVuex(){
      console.log($store.state.geo.position);
    }
  }
}
</script>

<style>

</style>
