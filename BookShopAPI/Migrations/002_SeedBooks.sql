-- -- =============================================
-- -- BookShopAPI - Seed Books Data
-- -- =============================================

-- -- Clear existing data (optional - comment out if you want to keep existing books)
-- -- DELETE FROM BookFormats;
-- -- DELETE FROM Books;

-- -- Insert sample books
-- IF NOT EXISTS (SELECT * FROM Books)
-- BEGIN
--     -- Book 1: The Pragmatic Programmer
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         'The Pragmatic Programmer',
--         'Andy Hunt & Dave Thomas',
--         'Classic guide for software developers covering timeless principles.',
--         'https://covers.openlibrary.org/b/id/8091016-L.jpg',
--         '/docs/programming/the-pragmatic-programmer',
--         'Programming',
--         5,
--         12
--     );

--     -- Book 2: Clean Code
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         'Clean Code',
--         'Robert C. Martin',
--         'A handbook of agile software craftsmanship.',
--         'https://covers.openlibrary.org/b/id/9642212-L.jpg',
--         '/docs/programming/clean-code',
--         'Programming',
--         4,
--         8
--     );

--     -- Book 3: Atomic Habits
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         'Atomic Habits',
--         'James Clear',
--         'An easy and proven way to build good habits and break bad ones.',
--         'https://covers.openlibrary.org/b/id/9871297-L.jpg',
--         '/docs/self-help/atomic-habits',
--         'Self-help',
--         5,
--         20
--     );

--     -- Book 4: Sapiens
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         'Sapiens: A Brief History of Humankind',
--         'Yuval Noah Harari',
--         'An exploration of the history and impact of Homo sapiens.',
--         'https://covers.openlibrary.org/b/id/10595809-L.jpg',
--         '/docs/history/sapiens-a-briefhistory-of-humankind',
--         'History',
--         4,
--         5
--     );

--     -- Book 5: 1984
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         '1984',
--         'George Orwell',
--         'A dystopian novel about totalitarianism and surveillance.',
--         'https://covers.openlibrary.org/b/id/11110286-L.jpg',
--         '/docs/fiction/1984',
--         'Fiction',
--         5,
--         30
--     );

--     -- Book 6: React: Up & Running
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         'React: Up & Running',
--         'Stoyan Stefanov',
--         'Building Web Applications with React and Redux.',
--         'https://via.placeholder.com/300x400/1f2937/ffffff?text=React',
--         '/docs/programming/react-up-running',
--         'Programming',
--         4,
--         15
--     );

--     -- Book 7: Docker in Action
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         'Docker in Action',
--         'Jeff Nickoloff',
--         'Learn containerization with Docker.',
--         'https://via.placeholder.com/300x400/1f2937/ffffff?text=Docker',
--         '/docs/programming/docker-in-action',
--         'Programming',
--         4,
--         10
--     );

--     -- Book 8: Deep Work
--     INSERT INTO Books (Title, Author, Description, CoverUrl, [Path], Category, Rating, StockCount)
--     VALUES (
--         'Deep Work',
--         'Cal Newport',
--         'Rules for focused success in a distracted world.',
--         'https://via.placeholder.com/300x400/1f2937/ffffff?text=Deep+Work',
--         '/docs/self-help/deep-work',
--         'Self-help',
--         5,
--         18
--     );

--     PRINT 'Sample books inserted successfully.';
-- END
-- ELSE
-- BEGIN
--     PRINT 'Books already exist. Skipping insert.';
-- END
-- GO

-- -- Insert book formats
-- DECLARE @BookId INT;

-- -- The Pragmatic Programmer formats
-- SELECT @BookId = Id FROM Books WHERE Title = 'The Pragmatic Programmer';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Ebook', 'en', 15, 'https://covers.openlibrary.org/b/id/8091016-L.jpg', 10, 5, NULL, @BookId),
--         ('Paperback', 'en', 25, 'https://covers.openlibrary.org/b/id/8091016-L.jpg', 2, NULL, 320, @BookId);
-- END

-- -- Clean Code formats
-- SELECT @BookId = Id FROM Books WHERE Title = 'Clean Code';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Ebook', 'en', 12, 'https://covers.openlibrary.org/b/id/9642212-L.jpg', 6, 4, NULL, @BookId),
--         ('Hardcover', 'en', 35, 'https://covers.openlibrary.org/b/id/9642212-L.jpg', 2, NULL, 464, @BookId);
-- END

-- -- Atomic Habits formats
-- SELECT @BookId = Id FROM Books WHERE Title = 'Atomic Habits';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Ebook', 'en', 10, 'https://covers.openlibrary.org/b/id/9871297-L.jpg', 15, 3, NULL, @BookId),
--         ('Audiobook', 'en', 20, 'https://covers.openlibrary.org/b/id/9871297-L.jpg', 5, NULL, NULL, @BookId);
-- END

-- -- Sapiens formats
-- SELECT @BookId = Id FROM Books WHERE Title = 'Sapiens: A Brief History of Humankind';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Paperback', 'en', 18, 'https://covers.openlibrary.org/b/id/10595809-L.jpg', 5, NULL, 512, @BookId);
-- END

-- -- 1984 formats
-- SELECT @BookId = Id FROM Books WHERE Title = '1984';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Ebook', 'en', 8, 'https://covers.openlibrary.org/b/id/11110286-L.jpg', 20, 2, NULL, @BookId),
--         ('Paperback', 'en', 15, 'https://covers.openlibrary.org/b/id/11110286-L.jpg', 10, NULL, 328, @BookId);
-- END

-- -- React: Up & Running formats
-- SELECT @BookId = Id FROM Books WHERE Title = 'React: Up & Running';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Ebook', 'en', 20, 'https://via.placeholder.com/300x400/1f2937/ffffff?text=React', 12, 8, NULL, @BookId);
-- END

-- -- Docker in Action formats
-- SELECT @BookId = Id FROM Books WHERE Title = 'Docker in Action';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Ebook', 'en', 25, 'https://via.placeholder.com/300x400/1f2937/ffffff?text=Docker', 8, 12, NULL, @BookId);
-- END

-- -- Deep Work formats
-- SELECT @BookId = Id FROM Books WHERE Title = 'Deep Work';
-- IF @BookId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM BookFormats WHERE BookId = @BookId)
-- BEGIN
--     INSERT INTO BookFormats (Format, Language, Price, CoverUrl, StockCount, FileSizeMB, Pages, BookId)
--     VALUES 
--         ('Ebook', 'en', 14, 'https://via.placeholder.com/300x400/1f2937/ffffff?text=Deep+Work', 15, 6, NULL, @BookId);
-- END

-- PRINT '=========================================';
-- PRINT 'Seed data inserted successfully!';
-- PRINT '=========================================';

