-- ================================================================
-- 实验3 补充：给 books 表增加「库存数量 stock」与「已加购次数 sales」
-- 作用：网页点「加入购物车」时，前端 POST /api/books/:id/add，
--       后端在事务里把 stock - 1、sales + 1，数字真正写回数据库。
-- 用法：在 SSMS 里打开本文件执行（可重复执行，已存在的列会跳过）
-- ================================================================
USE bookshop;
GO

IF COL_LENGTH('dbo.books', 'stock') IS NULL
    ALTER TABLE dbo.books ADD stock INT NOT NULL CONSTRAINT DF_books_stock DEFAULT 5;
GO

IF COL_LENGTH('dbo.books', 'sales') IS NULL
    ALTER TABLE dbo.books ADD sales INT NOT NULL CONSTRAINT DF_books_sales DEFAULT 0;
GO

-- 表里原本标记为缺货的两本书（围城、时间简史），库存数量设为 0
UPDATE dbo.books SET stock = 0 WHERE in_stock = 0;
GO

-- 验证：库存与销量列
SELECT id, title, price, stock, sales, in_stock, category FROM dbo.books ORDER BY id;
GO
