<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col
        :span="3"
        class="left"
      >
        <img
          src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
          alt="美团"
        >
      </el-col>
      <el-col
        :span="15"
        class="center"
      >
        <div class="wrapper">
          <el-input
            v-model="search"
            placeholder="搜索商家或地点"
            @focus="focus"
            @blur="blur"
            @input="input"
          />
          <button class="el-button el-button--primary">
            <i class="el-icon-search" />
          </button>
          <dl
            v-if="isHotPlace"
            class="hotPlace"
          >
            <dt>热门搜索</dt>
            <!-- 由于数据库数据较少 目前用 city=海南 做测试 -->
            <!-- slice() 是为了防止装不下，呈现换行的效果 -->
            <dd v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)" :key="idx">
            <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
          <dl
            v-if="isSearchList"
            class="searchList"
          >
            <dd
              v-for="(item,idx) in searchList"
              :key="idx"
            >
              <a :href="'/products?keyword='+encodeURIComponent(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <!-- <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a>
          <a href="#">故宫博物院</a> -->
          <a
            v-for="(item,idx) in $store.state.home.hotPlace.slice(0,5)"
            :key="idx"
            :href="'/products?keyword='+encodeURIComponent(item.name)"
            >{{ item.name }}</a>
        </p>
        <ul class="nav">
          <li>
            <nuxt-link
              to="/"
              class="takeout"
            >
              美团外卖
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="movie"
            >
              猫眼电影
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="hotel"
            >
              美团酒店
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="apartment"
            >
              民宿/公寓
            </nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="business"
            >
              商家入驻
            </nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col
        :span="6"
        class="right"
      >
        <ul class="security">
          <li>
            <i class="refund" /><p class="txt">
              随时退
            </p>
          </li>
          <li>
            <i class="single" /><p class="txt">
              不满意免单
            </p>
          </li>
          <li>
            <i class="overdue" /><p class="txt">
              过期退
            </p>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      search: '',
      isFocus: false,
      // hotPlace: ['火锅', '火锅', '火锅'],
      // searchList: ['故宫', '故宫', '故宫'],
      hotPlace: ['海南'],
      searchList: []
    }
  },
  computed: {
    isHotPlace () {
      return this.isFocus && !this.search
    },
    isSearchList () {
      return this.isFocus && this.search
    }
  },
  methods: {
    focus () {
      this.isFocus = true
    },
    blur () {
      const self = this
      // 加上延迟是因为 如果想点击显示列表里的链接，那必定会先对input失去焦点，失去焦点后列表变成隐藏了，所以来个延迟
      setTimeout(function () {
        self.isFocus = false
      }, 200)
    },
    input:_.debounce(async function(){
      let self=this;
      console.log('city :>> ', self.$store.state.geo.position.city);
      // let city=self.$store.state.geo.position.city.replace('市','')  //获取当前的城市
      let city = '三亚'
      self.searchList=[]
      let {status,data:{top}}=await self.$axios.get('/search/top',{
        params:{
          input:self.search,
          city
        }
      })
      console.log(top.slice(0,10));
      self.searchList=top.slice(0,10)
    },300)
  }
}
</script>

<style>

</style>
