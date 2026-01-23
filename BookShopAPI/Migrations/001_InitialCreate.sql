-- -- =============================================
-- -- BookShopAPI - Initial Database Schema
-- -- =============================================

-- -- Create Users Table
-- IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
-- BEGIN
--     CREATE TABLE Users (
--         Id INT PRIMARY KEY IDENTITY(1,1),
--         Email NVARCHAR(100) NOT NULL,
--         Username NVARCHAR(50) NOT NULL,
--         FirstName NVARCHAR(100) NOT NULL,
--         LastName NVARCHAR(100) NOT NULL,
--         PasswordHash NVARCHAR(100) NOT NULL,
--         Role NVARCHAR(50) NOT NULL DEFAULT 'Customer',
--         IsActive BIT NOT NULL DEFAULT 1,
--         CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         LastLoginAt DATETIME2 NULL
--     );

--     -- Unique constraints
--     CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);
--     CREATE UNIQUE INDEX IX_Users_Username ON Users(Username);
    
--     PRINT 'Users table created successfully.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'Users table already exists.';
-- END

-- -- Create Books Table
-- IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Books')
-- BEGIN
--     CREATE TABLE Books (
--         Id INT PRIMARY KEY IDENTITY(1,1),
--         Title NVARCHAR(200) NOT NULL,
--         Author NVARCHAR(100) NOT NULL,
--         Description NVARCHAR(1000) NULL,
--         CoverUrl NVARCHAR(500) NULL,
--         [Path] NVARCHAR(100) NOT NULL,
--         Category NVARCHAR(50) NOT NULL,
--         Rating DECIMAL(3,2) NOT NULL DEFAULT 0,
--         StockCount INT NOT NULL DEFAULT 0,
--         CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
--     );

--     -- Indexes for search optimization
--     CREATE INDEX IX_Books_Title ON Books(Title);
--     CREATE INDEX IX_Books_Author ON Books(Author);
--     CREATE INDEX IX_Books_Category ON Books(Category);
--     CREATE INDEX IX_Books_Rating ON Books(Rating);
    
--     PRINT 'Books table created successfully.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'Books table already exists.';
-- END

-- -- Create BookFormats Table
-- IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BookFormats')
-- BEGIN
--     CREATE TABLE BookFormats (
--         Id INT PRIMARY KEY IDENTITY(1,1),
--         Format NVARCHAR(50) NOT NULL,
--         Language NVARCHAR(10) NOT NULL DEFAULT 'en',
--         Price DECIMAL(10,2) NOT NULL,
--         CoverUrl NVARCHAR(500) NULL,
--         StockCount INT NOT NULL DEFAULT 0,
--         FileSizeMB INT NULL,
--         Pages INT NULL,
--         CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         BookId INT NOT NULL,
--         FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE CASCADE
--     );

--     CREATE INDEX IX_BookFormats_BookId ON BookFormats(BookId);
    
--     PRINT 'BookFormats table created successfully.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'BookFormats table already exists.';
-- END

-- -- Create Orders Table
-- IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
-- BEGIN
--     CREATE TABLE Orders (
--         Id INT PRIMARY KEY IDENTITY(1,1),
--         OrderNumber NVARCHAR(50) NOT NULL,
--         UserId INT NOT NULL,
--         TotalAmount DECIMAL(10,2) NOT NULL,
--         Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
--         ShippingAddress NVARCHAR(200) NULL,
--         BillingAddress NVARCHAR(200) NULL,
--         PaymentMethod NVARCHAR(100) NULL,
--         CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         ShippedAt DATETIME2 NULL,
--         DeliveredAt DATETIME2 NULL,
--         FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION
--     );

--     CREATE UNIQUE INDEX IX_Orders_OrderNumber ON Orders(OrderNumber);
--     CREATE INDEX IX_Orders_UserId ON Orders(UserId);
    
--     PRINT 'Orders table created successfully.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'Orders table already exists.';
-- END

-- -- Create OrderItems Table
-- IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
-- BEGIN
--     CREATE TABLE OrderItems (
--         Id INT PRIMARY KEY IDENTITY(1,1),
--         OrderId INT NOT NULL,
--         BookId INT NOT NULL,
--         BookFormatId INT NOT NULL,
--         Quantity INT NOT NULL,
--         UnitPrice DECIMAL(10,2) NOT NULL,
--         TotalPrice DECIMAL(10,2) NOT NULL,
--         CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
--         FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE NO ACTION,
--         FOREIGN KEY (BookFormatId) REFERENCES BookFormats(Id) ON DELETE NO ACTION
--     );

--     CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId);
--     CREATE INDEX IX_OrderItems_BookId ON OrderItems(BookId);
    
--     PRINT 'OrderItems table created successfully.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'OrderItems table already exists.';
-- END

-- -- Create Reviews Table
-- IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reviews')
-- BEGIN
--     CREATE TABLE Reviews (
--         Id INT PRIMARY KEY IDENTITY(1,1),
--         UserId INT NOT NULL,
--         BookId INT NOT NULL,
--         Rating INT NOT NULL,
--         Comment NVARCHAR(1000) NULL,
--         CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
--         FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
--         FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE CASCADE
--     );

--     -- One review per user per book
--     CREATE UNIQUE INDEX IX_Reviews_User_Book ON Reviews(UserId, BookId);
--     CREATE INDEX IX_Reviews_BookId ON Reviews(BookId);
    
--     PRINT 'Reviews table created successfully.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'Reviews table already exists.';
-- END

-- PRINT '=========================================';
-- PRINT 'All tables created successfully!';
-- PRINT '=========================================';

