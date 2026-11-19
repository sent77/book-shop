<script setup>
// 页头积木：只管展示 logo、导航和暗色开关
defineProps(['isDark'])
const emit = defineEmits(['toggle-dark'])
</script>

<template>
  <header>
    <h1>校园图书屋</h1>
    <nav>
      <a href="#">首页</a>
      <a href="#">检索</a>
      <a href="#">关于</a>
      <button class="mode-btn" @click="emit('toggle-dark')">
        {{ isDark ? '☀️ 亮色' : '🌙 暗色' }}
      </button>
    </nav>
  </header>
</template>

<style scoped>
header {
  background: #2f5d8a;
  color: #fff;
  padding: 14px 20px;
  border-radius: 6px 6px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  font-size: 24px;
  letter-spacing: 2px;
}

nav {
  display: flex;
  gap: 24px;
  align-items: center;
}

nav a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  color: #ffd166;
  text-decoration: underline;
}

.mode-btn {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  cursor: pointer;
  font-size: 13px;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 暗色模式 */
body.dark header {
  background: #253040;
  color: #e5e7eb;
}

/* 手机：上下堆叠居中 */
@media (max-width: 600px) {
  header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  nav {
    gap: 16px;
  }
}
</style>
