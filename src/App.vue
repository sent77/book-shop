<script setup>
// ===== 行为：数据与函数（JS） =====
import { ref, computed, watch, onMounted } from 'vue'
// 首页 = 一堆积木：页头、搜索、书卡、购物车、侧栏、页脚，App.vue 只管拼装和管数据
import AppHeader from './components/AppHeader.vue'
import SearchBar from './components/SearchBar.vue'
import BookCard from './components/BookCard.vue'
import CartPanel from './components/CartPanel.vue'
import SideBar from './components/SideBar.vue'
import AppFooter from './components/AppFooter.vue'

// 书单数据：不再写死在页面里，改为来自 SQL Server（bookshop.dbo.books）
// 由后端 server/index.js 的 GET /api/books 提供，字段已转成前端用的驼峰命名
const books = ref([])
const loading = ref(true)
const loadError = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/api/books')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    books.value = await res.json()
  } catch (e) {
    loadError.value = e.message
  } finally {
    loading.value = false
  }
})

// 搜索与分类状态（v-model 双向绑定；状态仍然住在父组件）
const keyword = ref('')
const category = ref('全部')

// 计算属性：数据变 → 页面自动变（声明式，无需手动重渲染）
const filteredBooks = computed(() => {
  return books.value.filter((b) => {
    const matchKw = b.title.includes(keyword.value.trim())
    const matchCat = category.value === '全部' || b.category === category.value
    return matchKw && matchCat
  })
})

// ===== 状态提升：购物车明细放在父组件，BookCard 与 CartPanel 都从这取 =====
// 用数组不用数字：数组还能回答"哪几本、各几件"
const cart = ref([])

// 收到子组件的上报：已有这本书就数量加一，没有就复制一份入车
function handleAdd(book) {
  const found = cart.value.find((it) => it.id === book.id)
  if (found) {
    found.qty++
  } else {
    cart.value.push({ ...book, qty: 1 })
  }
  console.log('收到加购事件：', book.title, '当前购物车：', cart.value)
}

// 件数由明细派生：永远不会和明细对不上
const count = computed(() => cart.value.reduce((sum, it) => sum + it.qty, 0))

// 总价：computed 会缓存，cart 不变就不重算
const total = computed(() => cart.value.reduce((sum, it) => sum + it.price * it.qty, 0))

// 移除：子组件只上报 id，父组件用 filter 真正删除
function removeFromCart(id) {
  cart.value = cart.value.filter((it) => it.id !== id)
}

// ===== 暗色模式：切换 body 上的类名，颜色交给 CSS =====
const isDark = ref(false)
watch(isDark, (v) => {
  document.body.classList.toggle('dark', v)
})

// ===== 回到顶部 =====
function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- ===== 结构：只负责拼装（每个积木自己长什么样、穿什么衣服都在自己文件里） ===== -->
  <AppHeader :is-dark="isDark" @toggle-dark="isDark = !isDark" />

  <main>
    <!-- 搜索积木：组件上的 v-model:keyword 等价于 :keyword + @update:keyword -->
    <SearchBar v-model:keyword="keyword" v-model:category="category" :count="count" />

    <div class="content-wrap">
      <section class="book-list">
        <h2>新书推荐</h2>
        <div class="card-grid">
          <p class="empty" v-if="loading">正在从数据库加载书目…</p>
          <p class="empty" v-else-if="loadError">数据加载失败：{{ loadError }}（请确认后端已启动：cd server → npm start）</p>
          <div v-else class="cards-wrap">
            <p class="empty" v-if="filteredBooks.length === 0">没有找到相关图书</p>
            <!-- @add-to-cart 听自定义事件：子声明 emit，父 @ 监听并自己改数据 -->
            <BookCard v-for="b in filteredBooks" :key="b.id" :book="b" @add-to-cart="handleAdd" />
          </div>
        </div>
      </section>

      <!-- 右侧列：购物车面板（兄弟组件，与 BookCard 通过父组件这座桥联动） + 侧栏 -->
      <div class="side-column">
        <CartPanel :cart="cart" :total="total" @remove-from-cart="removeFromCart" />
        <SideBar @select-category="category = $event" />
      </div>
    </div>
  </main>

  <!-- 回到顶部按钮 -->
  <button id="topBtn" class="back-to-top" title="回到顶部" @click="scrollTop">↑</button>

  <AppFooter />
</template>

<style scoped>
/* 本组件只剩布局：各积木的样式都在自己文件里（scoped 隔离） */
/* display:contents 让这层包裹盒不参与布局，卡片直接排在 .card-grid 里 */
.cards-wrap {
  display: contents;
}
</style>
