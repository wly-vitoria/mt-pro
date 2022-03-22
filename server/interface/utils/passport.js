import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users.js'

// passport 是所有node程序可以应用的
// koa-passport 是对koa适配、封装过的
// passport-local 是它本地的一个策略

passport.use(new LocalStrategy(async function (username, password, done) {
  const where = {
    username
  }
  const result = await UserModel.findOne(where)
  if (result != null) {
    if (result.password === password) {
      return done(null, result)
    } else {
      return done(null, false, '密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

// 让用户每次访问都自动通过 session 去验证  用序列化把用户数据存到session中
passport.serializeUser(function (user, done) {
  done(null, user)
})

// 反序列化
passport.deserializeUser(function (user, done) {
  return done(null, user)
})
// 解释：登录验证成功，把数据打到cookie中
// 因为http通信的是没有状态的，如果不把它存在session中（session是存在cookie中 放在浏览器端）
// 等下一次访问的时候，会把session信息从cookie中提出来跟服务端的session做验证对比
// 如果能找到，说明这个人是个登录状态，从而达到一个从无状态到有状态的一个转变

export default passport
