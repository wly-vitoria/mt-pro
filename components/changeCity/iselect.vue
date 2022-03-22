<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <!-- 省份没有选择的时候，城市是不能进行选择的 :disabled -->
    <span class="name">&nbsp;&nbsp;&nbsp;城市:</span>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <!-- querySearchAsync() 表示当用户聚焦输入框时会触发这个方法 -->
    <!-- handleSelect() 表示当用户选择下拉框内的内容时会触发 -->
    <span class="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手动搜索:</span>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"
    />
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data(){
    return {
      province:[],
      pvalue:'',
      city:[],
      cvalue:'',
      input:'',
      cities:[] //全国的城市列表 用于直接搜索的
    }
  },
  watch:{
    pvalue:async function(newPvalue){
      let self=this;
      let {status,data:{city}}=await self.$axios.get(`/geo/province/${newPvalue}`)
      if(status===200){
        //改变一下数据结构 比如用自己的变量名
        self.city=city.map(item=>{
          return {
            value:item.id,
            label:item.name
          }
        })
        self.cvalue=''
      }
    }
  },
  mounted:async function(){
    let self=this;
    let {status,data:{province}}=await self.$axios.get('/geo/province')
    if(status===200){
      self.province=province.map(item=>{
        return {
          value:item.id,
          label:item.name
        }
      })
    }
  },
  methods:{
    //直接搜索框
    querySearchAsync:_.debounce(async function(query,cb){
      let self=this;
      if(self.cities.length){
        cb(self.cities.filter(item => item.value.indexOf(query)>-1))
      }else{
        //如果没有数据就请求数据，再返回
        let {status,data:{city}}=await self.$axios.get('/geo/city')
        if(status===200){
          self.cities=city.map(item=>{return {
            value:item.name
          }})
          //表示 只要城市名字里只要符合 query 就直接返回  query时直接搜索框的输入内容
          cb(self.cities.filter(item => item.value.indexOf(query)>-1))
        }else{
          cb([])
        }
      }
    },200),
    handleSelect:function(item){
      //选中之后直接跳转到首页(带有选中城市的) 此处没有实现 location.href('')
      console.log(item.value);
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/iselect.scss";
</style>
