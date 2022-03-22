import axios from 'axios'

// create 方法就是用来创建一个实例
const instance = axios.create({
  // 获取主机号和端口号 如果没有默认localhost
  baseURL: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
  timeout: 30000, // 超时设置为1000毫秒
  headers: {

  }
})

export default instance
