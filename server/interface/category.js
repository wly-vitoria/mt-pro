import Router from 'koa-router';
// import axios from './utils/axios.js'
// import Province from '../dbs/models/province.js'
import Category from '../dbs/models/category.js'

let router = new Router({prefix: '/category'})

// 列表产品页的 '全部'和'分类'
router.get('/crumbs',async (ctx)=>{
  console.log('test:',ctx.query.city);// 输出：三亚
  //由于数据库没有三亚的相关数据，我们这里用'丽江'代替
  let result = await Category.findOne({city: ctx.query.city || '北京'})
  console.log(result);
  if (result) {
    ctx.body = {
      areas: result.areas,
      types: result.types
    }
  } else {
    ctx.body = {
      areas: [],
      types: []
    }
  }
  // 访问线上数据
  // let {status,data:{areas,types}} = await axios.get('http://cp-tools.cn/categroy/crumbs',{
  //   params:{
  //     city:ctx.query.city.replace('市','') || "北京",
  //     sign
  //   }
  // })
  // ctx.body={
  //   areas: status===200?areas:[],
  //   types: status===200?types:[]
  // }
})


export default router;
