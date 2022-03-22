export default {
  dbs: 'mongodb://127.0.0.1:27017/student',
  redis: {
    get host () {
      return '127.0.0.1'
    },
    get port () {
      // 端口号 默认的 不建议改
      return 6379
    }
  },
  smtp: {
    get host () {
      // 固定写法
      return 'smtp.qq.com'
    },
    get user () {
      return '543119794@qq.com'
    },
    get pass () {
      return 'yjqvbvfqkswvbdgd'
    },
    // 生成一个随机的验证码 4位数的随机值
    get code () {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase()
      }
    },
    // 验证码过期时间 获取 当前时间 + 一分钟
    get expire () {
      return () => {
        return new Date().getTime() + 60 * 60 * 1000
      }
    }
  }
}
