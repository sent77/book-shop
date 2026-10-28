<script setup>
// ===== 行为：数据与函数（JS） =====
// 本阶段先搭结构，数据与交互在后续提交中加入
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
        <input type="text" id="kw" name="keyword" required placeholder="请输入书名" />

        <label for="type">图书分类</label>
        <select id="type" name="type">
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
      <!-- 新书推荐：书卡由 JS 从数据渲染（下一步接入） -->
      <section class="book-list">
        <h2>新书推荐</h2>
        <div id="bookContainer" class="card-grid"></div>
      </section>

      <!-- 侧边栏 -->
      <aside class="sidebar">
        <h3>分类导航</h3>
        <ul id="categoryNav">
          <li data-category="计算机">计算机</li>
          <li data-category="文学小说">文学小说</li>
          <li data-category="历史">历史</li>
          <li data-category="科普">科普</li>
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
