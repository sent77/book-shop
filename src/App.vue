<script setup>
// ===== 行为：数据与函数（JS） =====
import { ref, computed, watch, onMounted } from 'vue'
// 组件化：两个积木——书卡与购物车面板
import BookCard from './components/BookCard.vue'
import CartPanel from './components/CartPanel.vue'

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

// 搜索与分类状态（v-model 双向绑定）
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
  <!-- ===== 结构：页面长什么样（HTML） ===== -->
  <!-- 页头：logo 与导航两端对齐 -->
  <header>
    <h1>校园图书屋</h1>
    <nav>
      <a href="#">首页</a>
      <a href="#">检索</a>
      <a href="#">关于</a>
      <button class="mode-btn" @click="isDark = !isDark">{{ isDark ? '☀️ 亮色' : '🌙 暗色' }}</button>
    </nav>
  </header>

  <main>
    <!-- 检索区 -->
    <section class="search-area">
      <form action="/search" method="get" @submit.prevent>
        <label for="kw">书名关键字</label>
        <input type="text" id="kw" name="keyword" required placeholder="请输入书名" v-model="keyword" />

        <label for="type">图书分类</label>
        <select id="type" name="type" v-model="category">
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

    <!-- 关键词实时显示：输入框一变这里立刻跟着变（v-model 的直观证据） -->
    <p class="kw-tip" v-if="keyword">当前关键词：<strong>{{ keyword }}</strong></p>

    <div class="content-wrap">
      <!-- 新书推荐：v-for 作用在组件标签上，每本书自动打一个包裹递给 BookCard -->
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

        <aside class="sidebar">
          <h3>分类导航</h3>
          <ul id="categoryNav">
            <li @click="category = '计算机'">计算机</li>
            <li @click="category = '文学小说'">文学小说</li>
            <li @click="category = '历史'">历史</li>
            <li @click="category = '科普'">科普</li>
          </ul>
          <h3>本周热榜</h3>
          <ul>
            <li>三体</li>
            <li>红楼梦</li>
          </ul>
          <h3>借阅须知</h3>
          <p>每本书借阅期限30天，请按时归还。</p>
        </aside>
      </div>
    </div>
  </main>

  <!-- 回到顶部按钮 -->
  <button id="topBtn" class="back-to-top" title="回到顶部" @click="scrollTop">↑</button>

  <!-- 页脚 -->
  <footer>
    <p>版权所有 © 2026</p>
  </footer>
</template>

<style scoped>
/* 卡片样式在 BookCard.vue、购物车样式在 CartPanel.vue（scoped 隔离），本组件只负责拼装 */
/* display:contents 让这层包裹盒不参与布局，卡片直接排在 .card-grid 里 */
.cards-wrap {
  display: contents;
}
</style>
