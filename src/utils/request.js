/**
 * 请求模块
 */
import axios from 'axios'
import store from '../store/index.js'
import JSONBig from 'json-bigint'

const request = axios.create({
  // baseURL: 'http://toutiao.itheima.net/', // 接口的基准路径
  baseURL: 'https://toutiao.itheima.net', // 线上

  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 如果请求出错 - 抛出异常
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器

export default request
