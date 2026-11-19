<script setup>
import { ref } from 'vue'

// 收货地址：父组件把"一本书"的包裹递进来
defineProps(['book'])

// 悬停高亮：组件内部自治的小状态
const hovered = ref(false)
</script>

<template>
  <article
    class="book-card"
    :class="{ 'card-hover': hovered, 'is-out': !book.inStock }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <span class="badge-new" v-if="book.isNew">新书</span>
    <div class="cover"></div>
    <h3>{{ book.title }}</h3>
    <p>作者：{{ book.author }}</p>
    <p class="price">¥{{ book.price.toFixed(2) }}</p>
    <!-- 组件自治：有货/缺货标记写在组件里，父组件不用管 -->
    <p class="in-stock" v-if="book.inStock">有货</p>
    <p class="out-stock" v-else>缺货</p>
    <button class="addBtn" :disabled="!book.inStock">加入购物车</button>
  </article>
</template>

<style scoped>
/* 卡片样式从全局 style.css 搬入，scoped 只作用于本组件 */
.book-card {
  flex: 0 0 280px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e0e3e8;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-align: center;
  position: relative;
}

.cover {
  height: 130px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #dce6f1 0%, #b6cbe4 100%);
  border: 1px solid #cfd6df;
  border-radius: 4px;
}

h3 {
  font-size: 15px;
  margin-bottom: 4px;
}

p {
  font-size: 13px;
  color: #666;
}

.price {
  margin-top: 6px;
  color: #e04444;
  font-size: 15px;
  font-weight: bold;
}

/* 新书角标 */
.badge-new {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  padding: 2px 10px;
  background: #e04444;
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
}

/* 有货标记 */
.in-stock {
  margin-top: 4px;
  color: #2e7d32 !important;
  font-size: 12px !important;
}

/* 缺货标记 */
.out-stock {
  margin-top: 4px;
  color: #999 !important;
  font-size: 12px !important;
}

/* 缺货卡片整体置灰（:class 与 inStock 配合） */
.is-out {
  opacity: 0.6;
  filter: grayscale(0.5);
}

/* 加入购物车按钮 */
.addBtn {
  margin-top: 8px;
  padding: 6px 16px;
  background: #2f5d8a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.addBtn:hover:not(:disabled) {
  background: #244a70;
}

.addBtn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 悬停高亮：由 :class 动态切换 */
.card-hover {
  border-color: #2f5d8a;
  box-shadow: 0 4px 12px rgba(47, 93, 138, 0.25);
  transform: translateY(-2px);
}

/* 暗色模式下卡片保持一致 */
body.dark .book-card {
  background: #253040;
  border-color: #4a5568;
}

body.dark .book-card p {
  color: #b0b8c4;
}

body.dark .cover {
  background: linear-gradient(135deg, #3a4a60 0%, #2a3a50 100%);
  border-color: #4a5568;
}

body.dark .addBtn {
  background: #3a6ea5;
}

body.dark .addBtn:hover:not(:disabled) {
  background: #2d5a8c;
}

/* 手机：单列 */
@media (max-width: 600px) {
  .book-card {
    flex: 1 1 100%;
    min-width: 0;
  }
}
</style>
