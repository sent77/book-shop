<script setup>
// ===== 行为：数据与函数（JS） =====
import { ref, computed, watch } from 'vue'
// 组件化第二步：import 进来，模板里就能当标签用（script setup 中 import 即注册）
import BookCard from './components/BookCard.vue'

// 书单数据：一个变量装下整个页面（数据是唯一真相）
const books = ref([
  { id: 1, title: '深入理解计算机系统', author: 'Randal E.Bryant', price: 59.0,  category: '计算机',   isNew: true,  inStock: true  },
  { id: 2, title: '红楼梦',             author: '曹雪芹',          price: 45.0,  category: '文学小说', isNew: false, inStock: true  },
  { id: 3, title: '三体',               author: '刘慈欣',          price: 72.0,  category: '文学小说', isNew: false, inStock: true  },
  { id: 4, title: 'JavaScript高级程序设计', author: 'Nicholas C.Zakas', price: 89.0, category: '计算机', isNew: true,  inStock: true  },
  { id: 5, title: '围城',               author: '钱钟书',          price: 38.0,  category: '文学小说', isNew: false, inStock: false },
  { id: 6, title: '算法导论',           author: 'Thomas H.Cormen', price: 108.0, category: '计算机',   isNew: false, inStock: true  },
  // 加分项：补 3 本测试数据
  { id: 7, title: '万历十五年',         author: '黄仁宇',          price: 45.0,  category: '历史',     isNew: false, inStock: true  },
  { id: 8, title: '人类简史',           author: '尤瓦尔·赫拉利',   price: 68.0,  category: '科普',     isNew: true,  inStock: true  },
  { id: 9, title: '时间简史',           author: '史蒂芬·霍金',     price: 56.0,  category: '科普',     isNew: false, inStock: false },
])

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

// 购物车件数（第 8 次课通过 emit 接通）
const count = ref(0)

// 谁的数据谁负责改：count 住在 App.vue，处理函数也写在这里
function handleAdd(book) {
  count.value++
  console.log('收到加购事件：', book.title, '当前件数：', count.value)
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

    <div class="content-wrap">
      <!-- 新书推荐：v-for 作用在组件标签上，每本书自动打一个包裹递给 BookCard -->
      <section class="book-list">
        <h2>新书推荐</h2>
        <div class="card-grid">
          <p class="empty" v-if="filteredBooks.length === 0">没有找到相关图书</p>
          <!-- @add-to-cart 听自定义事件，写法与 @click 一样；事件名统一用短横线 -->
          <BookCard v-for="b in filteredBooks" :key="b.id" :book="b" @add-to-cart="handleAdd" />
        </div>
      </section>

      <!-- 侧边栏 -->
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
  </main>

  <!-- 回到顶部按钮 -->
  <button id="topBtn" class="back-to-top" title="回到顶部" @click="scrollTop">↑</button>

  <!-- 页脚 -->
  <footer>
    <p>版权所有 © 2026</p>
  </footer>
</template>

<style scoped>
/* 卡片样式已搬入 BookCard.vue（scoped 隔离），本组件只负责拼装 */
</style>
