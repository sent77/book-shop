# 校园图书屋 book-shop

Web 应用程序设计课程项目：图书首页从静态版一路升级到 Vue 组件化 + 组件通信联动版。

## 技术栈

- Vue 3（组合式 API，`script setup`）
- Vite（开发服务器 + 构建）

## 运行方式

```bash
npm install
npm run dev     # 浏览器打开 http://localhost:5173
npm run build   # 生产构建
```

## 项目结构

```
book-shop/
├─ index.html          入口页面（Vue 挂载点 #app）
├─ package.json        项目清单
├─ vite.config.js      Vite 配置
└─ src/
   ├─ main.js         入口：创建 Vue 应用并挂载 App
   ├─ App.vue         根组件：管数据（books / cart）+ 拼装积木
   ├─ style.css       全局样式（布局、页头、检索区、侧栏等）
   └─ components/
      ├─ BookCard.vue 书卡组件：props 收一本书，负责展示 + 上报加购
      └─ CartPanel.vue 购物车面板：props 收明细与总价，负责展示 + 上报移除
```

## 第 8 次课必做小实验：数据住在哪里

> 我认为数据住在 **浏览器内存里（Vue 的 ref 响应式数据，只存在于当前页面实例中）**，所以刷新会丢。

`App.vue` 里的 `books` 和 `cart` 都是内存中的 `ref`，既没有写进 `localStorage`，也没有后端数据库。刷新页面 = 重新加载应用 = 内存清空，购物车自然回到空状态。

## 一次加购的完整链路（收官抽查版）

1. 用户在 `BookCard` 里点「加入购物车」；
2. 子组件 `emit('add-to-cart', book)` 向上报事件（`defineEmits` 里先声明）；
3. 父组件 `App.vue` 用 `@add-to-cart="handleAdd"` 收到消息，在 `handleAdd` 里改数据：`find` 到已有书就 `qty++`，没有就 `{ ...book, qty: 1 }` 入车；
4. `cart` 一变，`computed` 的 `count` / `total` 自动重算，`CartPanel` 的 props 自动刷新，页面跟着更新；
5. 为什么要经过父组件：`props` 是单向只读的快递，数据只有一个主人（唯一入口 = 唯一排查点）；兄弟组件不直接对话，靠父组件这座桥传话，这就是「状态提升」。

## 交互功能清单

- 书名关键字实时搜索（`v-model` + `computed` 过滤）
- 分类下拉 / 侧栏分类导航联动筛选
- 加入购物车（`emit` 上报 → 父组件改 `cart` → 件数与总价自动更新）
- 购物车明细、合计金额、空车提示、单本移除
- 缺货标记与整卡置灰、新书角标、悬停高亮
- 暗色模式切换、回到顶部
