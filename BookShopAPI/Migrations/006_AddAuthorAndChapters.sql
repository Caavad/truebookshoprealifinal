-- Add AuthorId to Books and create Chapters table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Books') AND name = 'AuthorId')
BEGIN
    ALTER TABLE Books ADD AuthorId INT NULL;
    ALTER TABLE Books ADD CONSTRAINT FK_Books_Author FOREIGN KEY (AuthorId) REFERENCES Users(Id) ON DELETE SET NULL;
    PRINT 'AuthorId column added to Books.';
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Chapters')
BEGIN
    CREATE TABLE Chapters (
        Id INT PRIMARY KEY IDENTITY(1,1),
        BookId INT NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        ChapterNumber INT NOT NULL DEFAULT 1,
        Content NVARCHAR(MAX) NOT NULL DEFAULT '',
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE CASCADE
    );

    CREATE INDEX IX_Chapters_BookId ON Chapters(BookId);
    PRINT 'Chapters table created.';
END
