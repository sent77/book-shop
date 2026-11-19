<script setup>
// 搜索积木：数据不归它管（keyword/category 住在 App.vue），
// 它只负责"把框里的值报上去" + "把传进来的值显示出来"。
// 组件上的 v-model:keyword 本质就是 :keyword + @update:keyword，和 input 的 v-model 同理。
defineProps({
  keyword: { type: String, default: '' },
  category: { type: String, default: '全部' },
  count: { type: Number, default: 0 },
})
const emit = defineEmits(['update:keyword', 'update:category'])
</script>

<template>
  <section class="search-area">
    <form action="/search" method="get" @submit.prevent>
      <label for="kw">书名关键字</label>
      <!-- :value + @input 就是 v-model 拆开的样子 -->
      <input
        type="text"
        id="kw"
        name="keyword"
        required
        placeholder="请输入书名"
        :value="keyword"
        @input="emit('update:keyword', $event.target.value)"
      />

      <label for="type">图书分类</label>
      <select
        id="type"
        name="type"
        :value="category"
        @change="emit('update:category', $event.target.value)"
      >
        <option value="全部">全部</option>
        <option value="计算机">计算机</option>
        <option value="文学小说">文学小说</option>
        <option value="历史">历史</option>
        <option value="科普">科普</option>
      </select>

      <button type="submit">检索</button>
    </form>
    <span class="cart">购物车 ({{ count }})</span>
  </section>

  <!-- 关键词实时显示：框里一变这里立刻跟着变（v-model 的直观证据） -->
  <p class="kw-tip" v-if="keyword">当前关键词：<strong>{{ keyword }}</strong></p>
</template>

<style scoped>
.search-area {
  padding: 14px;
  margin: 14px 0;
  background: #ffffff;
  border: 1px solid #dde2e8;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

label {
  margin: 0 8px;
  color: #555;
}

input,
select,
button {
  padding: 6px 10px;
  border: 1px solid #c8ccd2;
  border-radius: 4px;
  font-size: 14px;
}

button {
  background: #2f5d8a;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #244a70;
}

.cart {
  padding: 4px 12px;
  background: #e04444;
  color: #fff;
  border-radius: 14px;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
}

.kw-tip {
  margin: -6px 0 12px;
  padding-left: 8px;
  color: #2f5d8a;
  font-size: 13px;
}

/* 暗色模式 */
body.dark .search-area {
  background: #253040;
  border-color: #4a5568;
  color: #e5e7eb;
}

body.dark label {
  color: #b0b8c4;
}

body.dark button {
  background: #3a6ea5;
}

body.dark button:hover {
  background: #2d5a8c;
}

body.dark .cart {
  background: #b03030;
}
</style>
