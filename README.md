# 校园图书屋 book-shop

Web 应用程序设计课程项目：图书首页从静态版一路升级到 Vue 组件化 + 组件通信 + **SQL Server 数据库版**。

## 技术栈

- 前端：Vue 3（组合式 API，`script setup`）+ Vite
- 后端：Node.js + Express + `mssql/msnodesqlv8`
- 数据库：SQL Server（本机实例 `localhost\SQLEXPRESS`，Windows 集成认证，无需账号密码）

## 运行方式（两个终端）

```bash
# 终端 1：前端
npm install
npm run dev          # http://localhost:5173

# 终端 2：后端接口
cd server
npm install
npm start            # http://localhost:3001/api/books
```

前端 `vite.config.js` 里把 `/api` 代理到 `3001`，所以页面里写 `fetch('/api/books')` 即可。

## 项目结构

```
book-shop/
├─ index.html
├─ package.json
├─ vite.config.js        前端配置（含 /api 代理）
├─ 01_数据库/
│  └─ init.sql           建库建表 + 插入 9 本书（在 SSMS 里执行）
├─ server/
│  ├─ index.js           Express 接口：GET /api/books（查 dbo.books）
│  └─ package.json
└─ src/
   ├─ main.js
   ├─ App.vue            管数据（books 从接口来 / cart 在内存）+ 拼装
   ├─ style.css          全局样式
   └─ components/
      ├─ BookCard.vue    props 收一本书，展示 + emit 上报加购
      └─ CartPanel.vue   props 收明细与总价，展示 + emit 上报移除
```

## 实验3：数据库初始化

在 SQL Server Management Studio 里连接到 `localhost\SQLEXPRESS`，打开 `01_数据库/init.sql`，点「执行」即可：

1. 建库 `bookshop`（已存在则跳过）
2. 建表 `dbo.books`（`id / title / author / price / in_stock / is_new / category`）
3. 插入 9 本书（实验要求的 6 本 + 第 7 次课加分项补的 3 本测试数据）
4. 最后 `SELECT` 一遍做验证

命令行等价写法（sqlcmd）：

```bash
sqlcmd -S "localhost\SQLEXPRESS" -E -C -f 65001 -i 01_数据库/init.sql
```

## 第 8 次课必做小实验：数据住在哪里

> 我认为书单数据住在 **SQL Server 的 `bookshop.dbo.books` 表里**，所以刷新页面书还在；
> 但购物车 `cart` 住在 **浏览器内存（Vue 的 ref）**，没有写 localStorage 也没有存数据库，所以 **刷新会丢**。

## 一次加购的完整链路（数据库版）

1. 页面加载时 `App.vue` 的 `onMounted` 里 `fetch('/api/books')` → 后端查 `dbo.books` → 返回 9 本书
2. 用户在 `BookCard` 里点「加入购物车」；
3. 子组件 `emit('add-to-cart', book)` 向上报事件（`defineEmits` 里先声明）；
4. 父组件 `App.vue` 用 `@add-to-cart="handleAdd"` 收到消息，在 `handleAdd` 里改数据：`find` 到已有书就 `qty++`，没有就 `{ ...book, qty: 1 }` 入车；
5. `cart` 一变，`computed` 的 `count` / `total` 自动重算，`CartPanel` 的 props 自动刷新，页面跟着更新；
6. 为什么要经过父组件：`props` 是单向只读的快递，数据只有一个主人（唯一入口 = 唯一排查点）；兄弟组件不直接对话，靠父组件这座桥传话，这就是「状态提升」。

## 数据库字段 → 前端字段

| 数据库列 | 前端字段 | 说明 |
|---|---|---|
| `id` | `id` | 主键，卡片 `:key` |
| `title` | `title` | 书名 |
| `author` | `author` | 作者 |
| `price` | `price` | `DECIMAL(10,2)` → 数字 |
| `in_stock` | `inStock` | BIT → 布尔，控制「有货/缺货」与整卡置灰 |
| `is_new` | `isNew` | BIT → 布尔，控制「新书」角标 |
| `category` | `category` | 扩展列，保留分类筛选 |

## 交互功能清单

- 书名关键字实时搜索（`v-model` + `computed` 过滤）
- 分类下拉 / 侧栏分类导航联动筛选
- 加入购物车（`emit` 上报 → 父组件改 `cart` → 件数与总价自动更新）
- 购物车明细、合计金额、空车提示、单本移除
- 缺货标记与整卡置灰、新书角标、悬停高亮
- 暗色模式切换、回到顶部
