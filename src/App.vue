<script setup>
// 行为：数据与函数（JS）
import { ref } from 'vue'

const shopName = ref('校园图书屋')
</script>

<template>
  <!-- 结构：页面长什么样（HTML） -->
  <h1>{{ shopName }}</h1>
  <p>Vue 项目已创建成功，正在改造图书首页……</p>
</template>

<style scoped>
/* 样式：只作用于本组件（CSS） */
h1 {
  color: #0e3f8c;
}
</style>
