-- ================================================================
-- 实验3：图书首页 - 数据库初始化脚本
-- 实例：LAPTOP-8BC9UT3C\SQLEXPRESS（本机实际实例；实验文档写的是 MSSQLSERVER1）
-- 用法：在 SSMS 里连接本机实例，打开本文件，点「执行」
-- ================================================================

-- 1. 建数据库（已存在就跳过）
IF DB_ID('bookshop') IS NULL
BEGIN
    CREATE DATABASE bookshop;
END
GO

USE bookshop;
GO

-- 2. 建图书表
--    stock：库存数量（网页加购时 -1，为 0 就自动算缺货）
--    sales：已加购次数（网页加购时 +1）
IF OBJECT_ID('dbo.books', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.books (
        id        INT IDENTITY(1,1) PRIMARY KEY,
        title     NVARCHAR(100) NOT NULL,
        author    NVARCHAR(50)  NOT NULL,
        price     DECIMAL(10,2) NOT NULL,
        in_stock  BIT NOT NULL DEFAULT 1,
        is_new    BIT NOT NULL DEFAULT 0,
        category  NVARCHAR(20) NOT NULL DEFAULT N'计算机',   -- 扩展列：保留首页分类筛选
        stock     INT NOT NULL DEFAULT 5,                     -- 扩展列：库存数量
        sales     INT NOT NULL DEFAULT 0                      -- 扩展列：已加购次数
    );
END
GO

-- 3. 插入九本书（实验3 要求的六本 + PPT 第7次课加分项补的 3 本测试数据）
IF NOT EXISTS (SELECT 1 FROM dbo.books)
BEGIN
    INSERT INTO dbo.books (title, author, price, in_stock, is_new, category, stock, sales) VALUES
        (N'深入理解计算机系统',      N'Randal E.Bryant',     59.00,  1, 1, N'计算机',   5, 0),
        (N'红楼梦',                  N'曹雪芹',              45.00,  1, 0, N'文学小说', 5, 0),
        (N'三体',                    N'刘慈欣',              72.00,  1, 0, N'文学小说', 5, 0),
        (N'JavaScript高级程序设计',  N'Nicholas C.Zakas',    89.00,  1, 1, N'计算机',   5, 0),
        (N'围城',                    N'钱钟书',              38.00,  0, 0, N'文学小说', 0, 0),
        (N'算法导论',                N'Thomas H.Cormen',     108.00, 1, 0, N'计算机',   5, 0),
        (N'万历十五年',              N'黄仁宇',              45.00,  1, 0, N'历史',     5, 0),
        (N'人类简史',                N'尤瓦尔·赫拉利',      68.00,  1, 1, N'科普',     5, 0),
        (N'时间简史',                N'史蒂芬·霍金',        56.00,  0, 0, N'科普',     0, 0);
END
GO

-- 4. 验证
SELECT id, title, author, price, stock, sales, in_stock, is_new, category FROM dbo.books;
GO
