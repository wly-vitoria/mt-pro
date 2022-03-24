import Router from 'koa-router';
// import axios from './utils/axios'
import Poi from '../dbs/models/poi.js'
// import sign from './utils/sign'

let router = new Router({prefix: '/search'})


router.get('/top', async (ctx) => {
  try {
    let top = await Poi.find({
      'name': new RegExp(ctx.query.input),
      city: ctx.query.city
    })
    ctx.body = {
      code: 0,
      top: top.map(item => {
        return {
          name: item.name,
          type: item.type
        }
      }),
      type: top.length ? top[0].type : ''
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      top: []
    }
  }
  // let {status, data: {
  //     top
  //   }} = await axios.get(`http://cp-tools.cn/search/top`, {
  //   params: {
  //     input: ctx.query.input,
  //     city: ctx.query.city,
  //     sign
  //   }
  // })
  // ctx.body = {
  //   top: status === 200
  //     ? top
  //     : []
  // }
})

router.get('/hotPlace', async (ctx) => {
  // let city = ctx.store ? ctx.store.geo.position.city : ctx.query.city  //获取当前的城市
  let city = '三亚'  //由于无法请求线上数据 此处假设为三亚
  console.log('----',city);
  try {
    let result = await Poi.find({
      city,
      type: ctx.query.type || '丽人'
    }).limit(10)
  
    ctx.body = {
      code: 0,
      result: result.map(item => {
        return {
          name: item.name,
          type: item.type
        }
      })
    }
  } catch (e) {
    ctx.body = {
      code: -1,
      result: []
    }
  }
  // let city = ctx.store
  //   ? ctx.store.geo.position.city
  //   : ctx.query.city
  // let {status, data: {
  //     result
  //   }} = await axios.get(`http://cp-tools.cn/search/hotPlace`, {
  //   params: {
  //     sign,
  //     city
  //   }
  // })
  // ctx.body = {
  //   result: status === 200
  //     ? result
  //     : []
  // }
})

// 获取首页最下方部分 artistic.vue 有图有文字 由于要求线上数据 这里不使用接口 直接写假数据做简单展示
//-------------------------------------------
router.get('/resultsByKeywords', async (ctx) => {
  const {city, keyword} = ctx.query; //解构赋值
  let {
    status,
    data: {
      count,
      pois
    }
  } = await axios.get('http://cp-tools.cn/search/resultsByKeywords', {
    params: {
      city,
      keyword,
      sign
    }
  })
  ctx.body = {
    count: status === 200 ? count : 0,
    pois: status === 200
      ? pois
      : []
  }
})

//这是详情页的接口
//------------------------------------------------------------
router.get('/products', async (ctx) => {


  //访问线上数据
  // let {
  //   status,
  //   data: {
  //     product,
  //     more
  //   }
  // } = await axios.get('http://cp-tools.cn/search/products', {
  //   params: {
  //     keyword,
  //     city,
  //     sign
  //   }
  // })
  // if (status === 200) {
  //   ctx.body = {
  //     product,
  //     more: ctx.isAuthenticated() ? more: [],
  //     login: ctx.isAuthenticated()
  //   }
  // }else{
  //   ctx.body = {
  //     product: {},
  //     more: ctx.isAuthenticated() ? more: [], //判断是否登录
  //     login: ctx.isAuthenticated()
  //   }
  // }
})

export default router
