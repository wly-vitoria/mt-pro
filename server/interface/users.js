import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users.js'
import Email from '../dbs/config.js'
import Passport from './utils/passport.js'
import axios from './utils/axios.js'

// 写接口 (路由)
const router = new Router({
  prefix: '/users' // 从这个接口进去的都要加一个前缀
})

const Store = new Redis().client

// 用户注册
router.post('/signup', async (ctx) => {
  const {
    username,
    password,
    email,
    code // 网页中写入的验证码
  } = ctx.request.body

  // 验证填写的验证码
  if (code) {
    // 跟redis相关 设置redis 存验证码的格式 跟username要绑定
    const saveCode = await Store.hget(`nodemail:${username}`, 'code')
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else { // 验证码填写不一致
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }

  // 验证 填写的用户名
  const user = await User.find({ username })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '已被注册'
    }
    return
  }

  // 确认 验证码和用户名都通过后 进行写库的操作 存入数据库
  const nuser = await User.create({ username, password, email })
  if (nuser) { // 存入数据库之后 执行一个 自动登录的操作，并返回 "注册成功"和用户名
    const res = await axios.post('/users/signin', { username, password })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = { // 登录不成功
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

// 用户登录
router.post('/signin', async (ctx, next) => {
  // 这里调 passport的local策略
  const ress = await Passport.authenticate('local', function (err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else if (user) {
      ctx.body = {
        code: 0,
        msg: '登录成功',
        user
      }
      return ctx.login(user) // 做一个登录的动作
    } else {
      ctx.body = {
        code: 1,
        msg: info
      }
    }
  })(ctx, next) // 这里是固定写法
  return ress
})

// 验证码的一个拦截 避免用户不停的刷新这个接口
router.post('/verify', async (ctx, next) => {
  const username = ctx.request.body.username
  // 获取验证码过期时间
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  // 发送的对象
  const transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 要接收的信息
  const ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email, // 给谁发
    user: ctx.request.body.username
  }

  // 邮件中要显示的内容
  const mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: '《慕课网高仿美团网全栈实战》注册码',
    html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的验证码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

// 退出接口
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  // 检查是否是 登录状态
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', (ctx) => {
  // 检查是否是 登录状态
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user
    ctx.body = { // 给客户端返回取出来的信息
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
