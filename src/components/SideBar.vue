<script setup>
// 侧栏积木：分类导航 + 热榜 + 须知，点击分类只上报，具体过滤还是父组件做
const emit = defineEmits(['select-category'])
const categories = ['计算机', '文学小说', '历史', '科普']
</script>

<template>
  <aside class="sidebar">
    <h3>分类导航</h3>
    <ul id="categoryNav">
      <li v-for="c in categories" :key="c" @click="emit('select-category', c)">{{ c }}</li>
    </ul>
    <h3>本周热榜</h3>
    <ul>
      <li>三体</li>
      <li>红楼梦</li>
    </ul>
    <h3>借阅须知</h3>
    <p>每本书借阅期限30天，请按时归还。</p>
  </aside>
</template>

<style scoped>
.sidebar {
  padding: 14px;
  background: #ffffff;
  border: 1px solid #dde2e8;
  border-radius: 6px;
}

h3 {
  margin: 10px 0 6px;
  padding-bottom: 4px;
  color: #2f5d8a;
  border-bottom: 1px dashed #c8ccd2;
}

ul {
  padding-left: 20px;
}

li {
  margin: 3px 0;
  cursor: pointer;
}

li:hover {
  color: #2f5d8a;
}

/* 暗色模式 */
body.dark .sidebar {
  background: #253040;
  border-color: #4a5568;
  color: #e5e7eb;
}

body.dark h3 {
  color: #7ab8ff;
  border-color: #7ab8ff;
}

body.dark li {
  color: #b0b8c4;
}
</style>
