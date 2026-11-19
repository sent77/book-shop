// ================================================================
// 校园图书屋 —— 数据库版后端（Node.js + Express + SQL Server）
// 接口：
//   GET  /api/books        读书单（含库存 stock、已加购 sales）
//   POST /api/books/:id/add  加购：库存 -1、销量 +1（事务写回数据库）
// 运行：node index.js   （默认端口 3001）
// ================================================================
const express = require('express')
const cors = require('cors')
const sql = require('mssql/msnodesqlv8')

const app = express()
app.use(cors())
app.use(express.json())

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
// inStock 以库存数量为准：stock > 0 才算有货
app.get('/api/books', async (req, res) => {
  try {
    const p = await getPool()
    const result = await p
      .request()
      .query(`SELECT id, title, author, price, in_stock, is_new, category, stock, sales
              FROM dbo.books ORDER BY id`)
    const rows = result.recordset.map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author,
      price: Number(r.price),
      inStock: Number(r.stock) > 0,
      isNew: Boolean(r.is_new),
      category: r.category,
      stock: Number(r.stock),
      sales: Number(r.sales),
    }))
    res.json(rows)
  } catch (err) {
    console.error('[api/books]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// 加购：数据库里库存 -1、销量 +1（用事务，保证两个数字一起变或都不变）
app.post('/api/books/:id/add', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'id 不合法' })
  }

  let tx = null
  try {
    const p = await getPool()
    tx = new sql.Transaction(p)
    await tx.begin()

    // 只有库存 > 0 才允许扣减，避免扣成负数
    const upd = await new sql.Request(tx)
      .input('id', sql.Int, id)
      .query(`UPDATE dbo.books
              SET stock = stock - 1, sales = sales + 1
              WHERE id = @id AND stock > 0`)

    if (upd.rowsAffected[0] === 0) {
      await tx.rollback()
      return res.status(409).json({ error: '这本书库存不足（或不存在），无法加购' })
    }

    const row = await new sql.Request(tx)
      .input('id', sql.Int, id)
      .query('SELECT id, title, stock, sales FROM dbo.books WHERE id = @id')

    await tx.commit()

    const r = row.recordset[0]
    res.json({ id: r.id, title: r.title, stock: Number(r.stock), sales: Number(r.sales) })
  } catch (err) {
    if (tx) {
      try {
        await tx.rollback()
      } catch (e) {
        /* 已回滚则忽略 */
      }
    }
    console.error('[api/books/add]', err.message)
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API 已启动：http://localhost:${PORT}/api/books`)
})
