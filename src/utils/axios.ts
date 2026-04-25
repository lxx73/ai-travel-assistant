import axios from "axios"

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量获取API地址
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 处理响应数据
    const res = response.data
    if (res.code !== 200 && res.code !== 201) {
      // 处理错误
      console.error("Error:", res.message || "Request failed")
      return Promise.reject(new Error(res.message || "Request failed"))
    } else {
      // 登录成功时，自动提取并存储access_token和user_id
      if (res.data && res.data.access_token) {
        const token = res.data.access_token
        const userId = res.data.user_id
        localStorage.setItem('token', token)
        localStorage.setItem('need_flush_user_page', 'true')
        if (userId) {
          localStorage.setItem('user_id', userId.toString())
          console.log('Token和用户ID已保存到localStorage')
        } else {
          console.log('Token已保存到localStorage')
        }
      }
      return res
    }
  },
  (error) => {
    // 处理响应错误
    console.error("Error:", error.message)
    return Promise.reject(error)
  },
)

// 全局请求函数
const Get = (url: string, params?: any) => {
  return service.get(url, { params })
}

const Post = (url: string, data?: any, params?: any) => {
  return service.post(url, data, { params })
}

const Put = (url: string, data?: any, params?: any) => {
  return service.put(url, data, { params })
}

const Delete = (url: string, params?: any) => {
  return service.delete(url, { params })
}

// 简化的请求方法对象
const request = {
  get: Get,
  post: Post,
  put: Put,
  delete: Delete,
}

export default service
export { request, Get, Post, Put, Delete }
