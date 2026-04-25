import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  css: {
    // CSS 预处理器
    preprocessorOptions: {
      // 定义全局 SCSS 变量
      scss: {
        api: "modern-compiler", // "modern-compiler" or "modern", "legacy"
        silenceDeprecations: ["legacy-js-api"], // 重点：解决sass警告问题
        javascriptEnabled: true,
      },
    },
  },
})
