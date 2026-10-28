import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite 配置：让浏览器能直接编译运行 .vue 单文件组件
export default defineConfig({
  plugins: [vue()],
})
