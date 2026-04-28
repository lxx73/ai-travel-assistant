import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import "./styles/main.css"
import service, { request, Get, Post, Put, Delete } from "./utils/axios"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import pinia from "./store"

const app = createApp(App)

// 设置应用标题
if (import.meta.env.VITE_APP_TITLE) {
  document.title = import.meta.env.VITE_APP_TITLE
}

// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.use(pinia)
// 将axios实例挂载到全局
app.config.globalProperties.$axios = service
// 将简化的请求方法挂载到全局
app.config.globalProperties.$http = request
// 将全局请求函数挂载到全局
app.config.globalProperties.Get = Get
app.config.globalProperties.Post = Post
app.config.globalProperties.Put = Put
app.config.globalProperties.Delete = Delete
app.mount("#app")

// 导出axios实例和请求方法供其他地方使用
export { service as axios, request as http, Get, Post, Put, Delete }
