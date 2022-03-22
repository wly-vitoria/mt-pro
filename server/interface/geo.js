import Router from 'koa-router'
import axios from './utils/axios.js'
import Province from '../dbs/models/province.js'
import City from '../dbs/models/city.js'
import Menu from '../dbs/models/menu.js'

let router = new Router({prefix: '/geo'})

// 获取当前的 省 和 城市
router.get('/getPosition', async (ctx) => {
  let {
    status,
    data: {
      province,
      city
    } //请求一个接口 如果成功就把省份和城市返回
  } = await axios.get(`http://cp-tools.cn/geo/getPosition`)
  if (status === 200) {
    ctx.body = {
      province,
      city
    }
  } else {
    ctx.body = {
      province: '海南',
      city: '三亚'
    }
  }
  // console.log();
})

router.get('/province',async(ctx)=>{
  // 访问数据库
  let province = await Province.find()
  ctx.body = {
      province: province.map(item => {
      return {
          id: item.id,
          name: item.value[0]
      }
      })
  }
  //访问线上服务
  // let {status, data: {
  //     province
  //   }} = await axios.get(`http://cp-tools.cn/geo/province?sign=${sign}`)
  // ctx.body = {
  //   province: status === 200
  //     ? province
  //     : []
  // }
})

router.get('/province/:id', async (ctx) => {
  let city = await City.findOne({id: ctx.params.id})
  
  ctx.body = {
    code: 0,
    city: city.value.map(item => {
      return {province: item.province, id: item.id, name: item.name}
    })
  }
  // 线上数据
  // let {status, data: {
  //     city
  //   }} = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`)
  // if (status === 200) {
  //   ctx.body = {
  //     city
  //   }
  // } else {
  //   ctx.body = {
  //     city: []
  //   }
  // }
})

//此接口没有使用 Vuex 传递数据
router.get('/city', async (ctx) => {
  let city = []
  let result = await City.find()
  result.forEach(item => {
    city = city.concat(item.value)
  })
  ctx.body = {
    code: 0,
    city: city.map(item => {
      return {
        province: item.province,
        id: item.id,
        name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
          ? item.province
          : item.name
      }
    })
  }
  // let {status, data: {
  //     city
  //   }} = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`);
  // if (status === 200) {
  //   ctx.body = {
  //     city
  //   }
  // } else {
  //   ctx.body = {
  //     city: []
  //   }
  // }
})

router.get('/hotCity', async (ctx) => {
  let list = [
    '北京市',
    '上海市',
    '广州市',
    '深圳市',
    '天津市',
    '西安市',
    '杭州市',
    '南京市',
    '武汉市',
    '成都市'
  ]
  let result = await City.find()
  let nList = []
  result.forEach(item => {
    nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  })
  ctx.body = {
    hots: nList
  }
  // let {status, data: {
  //     hots
  //   }} = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  // if (status === 200) {
  //   ctx.body = {
  //     hots
  //   }
  // } else {
  //   ctx.body = {
  //     hots: []
  //   }
  // }
})

// 获取首页菜单
router.get('/menu',async(ctx) => {
  const result = await Menu.findOne()
  ctx.body = {
    menu: result.menu
  }
  // let{status,data:{menu}} = await axios.get('http://cp-tools.cn/geo/menu');
  // if(status === 200){
  //     ctx.body = {
  //         menu
  //     }
  // }else{
  //     menu:[]
  // }
})

export default router;