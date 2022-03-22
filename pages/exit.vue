<template>
  <div class=""/>
</template>

<script>
export default {
  layout: 'blank',
  //这里用中间件去做  到达这个页面的时候自动去执行 也就是到达这个 exit 页面的时候触发这个接口
  middleware: async (ctx) => {
    let {status,data}=await ctx.$axios.get('/users/exit')
    if(status===200&&data&&data.code===0){
      window.location.href='/'  // 退出成功后跳转到首页(不显示用户名的状态)
    }
  }
}
</script>
