<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您，<span class="username">{{ user }}</span>
      [<nuxt-link to="/exit">
        退出
      </nuxt-link>]
    </template>
    <template v-else>
      <nuxt-link to="/login" class="login">
        立即登录
      </nuxt-link>
      <nuxt-link to="/register" class="register">
        立即注册
      </nuxt-link>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: ''
    }
  },
  async mounted(){
    //status是 axios 最外层包含的一个属性 data 里面的 user 才是我们想要获取的用户名
    const {status,data:{user}} = await this.$axios.get('/users/getUser')
    if(status===200){
      this.user=user
    }
  }
}
</script>

<style>

</style>
