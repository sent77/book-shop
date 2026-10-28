<script setup>
// ===== 行为：数据与函数（JS） =====
import { ref, computed } from 'vue'

// 书单数据：一个变量装下整个页面（数据驱动）
const books = ref([
  { title: '深入理解计算机系统', author: 'Randal E.Bryant', price: 59.0,  category: '计算机',   isNew: true,  inStock: true  },
  { title: '红楼梦',             author: '曹雪芹',          price: 45.0,  category: '文学小说', isNew: false, inStock: true  },
  { title: '三体',               author: '刘慈欣',          price: 72.0,  category: '文学小说', isNew: false, inStock: true  },
  { title: 'JavaScript高级程序设计', author: 'Nicholas C.Zakas', price: 89.0, category: '计算机', isNew: true,  inStock: true  },
  { title: '围城',               author: '钱钟书',          price: 38.0,  category: '文学小说', isNew: false, inStock: false },
  { title: '算法导论',           author: 'Thomas H.Cormen', price: 108.0, category: '计算机',   isNew: false, inStock: true  },
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
      <button class="mode-btn">🌙 暗色</button>
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
      <span class="cart">购物车 (0)</span>
    </section>

    <div class="content-wrap">
      <!-- 新书推荐：v-for 一张卡模板套所有书 -->
      <section class="book-list">
        <h2>新书推荐</h2>
        <div class="card-grid">
          <p class="empty" v-if="filteredBooks.length === 0">没有找到相关图书</p>
          <article class="book-card" v-for="b in filteredBooks" :key="b.title">
            <span class="badge-new" v-if="b.isNew">新书</span>
            <div class="cover"></div>
            <h3>{{ b.title }}</h3>
            <p>作者：{{ b.author }}</p>
            <p class="price">¥{{ b.price.toFixed(2) }}</p>
            <p class="out-stock" v-if="!b.inStock">暂无库存</p>
            <button class="addBtn" :disabled="!b.inStock">加入购物车</button>
          </article>
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
  <button id="topBtn" class="back-to-top" title="回到顶部">↑</button>

  <!-- 页脚 -->
  <footer>
    <p>版权所有 © 2026</p>
  </footer>
</template>

<style scoped>
/* 样式已整体引入全局 style.css，本组件无需重复书写 */
</style>
