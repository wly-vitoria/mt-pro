import Koa from 'koa'

import mongoose from 'mongoose'
// 跟 passport 相关，如果没有这个 passport就获取不到
import bodyParser from 'koa-bodyparser'
// 从seesion拿东西或者写东西 都是用这个包实现
import session from 'koa-generic-session'
import Redis from 'koa-redis'
// 服务端向客户端发回应 response  json格式美化的一个效果
import json from 'koa-json'

import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import config from '../nuxt.config.js'

// 跟数据库相关
import dbConfig from './dbs/config.js'
import passport from './interface/utils/passport.js'

//导入接口
import users from './interface/users.js'
import geo from './interface/geo.js'
import search from './interface/search.js'
import category from './interface/category.js'


const app = new Koa()
// const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

// session配置
app.keys = ['mt', 'keyskeys'] // 密钥
app.proxy = true
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))
// post处理
app.use(bodyParser({
  extendTypes: ['json', 'form', 'text']
}))
app.use(json())

// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})
app.use(passport.initialize())
app.use(passport.session())

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // 连接路由
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods()) 
  app.use(category.routes()).use(category.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

export default start()
