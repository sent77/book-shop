// ================================================================
// 校园图书屋 —— 数据库版后端（Node.js + Express + SQL Server）
// 作用：把 dbo.books 表里的书，通过 /api/books 接口交给前端
// 运行：node index.js   （默认端口 3001）
// ================================================================
const express = require('express')
const cors = require('cors')
const sql = require('mssql/msnodesqlv8')

const app = express()
app.use(cors())

// 本机实例是 LAPTOP-8BC9UT3C\SQLEXPRESS，用 Windows 集成认证（免账号密码）
const config = {
  connectionString:
    'Driver={ODBC Driver 18 for SQL Server};' +
    'Server=localhost\\SQLEXPRESS;' +
    'Database=bookshop;' +
    'Trusted_Connection=Yes;' +
    'TrustServerCertificate=Yes;',
}

let pool = null
async function getPool() {
  if (!pool) {
    pool = await sql.connect(config)
  }
  return pool
}

// 健康检查
app.get('/api/health', async (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

// 图书列表：数据库列名（in_stock/is_new）→ 前端字段（inStock/isNew）
app.get('/api/books', async (req, res) => {
  try {
    const p = await getPool()
    const result = await p
      .request()
      .query(`SELECT id, title, author, price, in_stock, is_new, category
              FROM dbo.books ORDER BY id`)
    const rows = result.recordset.map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author,
      price: Number(r.price),
      inStock: Boolean(r.in_stock),
      isNew: Boolean(r.is_new),
      category: r.category,
    }))
    res.json(rows)
  } catch (err) {
    console.error('[api/books]', err.message)
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API 已启动：http://localhost:${PORT}/api/books`)
})
