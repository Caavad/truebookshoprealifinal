IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'ReadingBookmarks')
BEGIN
    CREATE TABLE ReadingBookmarks (
        Id INT PRIMARY KEY IDENTITY(1,1),
        UserId INT NOT NULL,
        BookId INT NOT NULL,
        ChapterId INT NOT NULL,
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (BookId) REFERENCES Books(Id) ON DELETE CASCADE,
        FOREIGN KEY (ChapterId) REFERENCES Chapters(Id) ON DELETE NO ACTION
    );

    CREATE UNIQUE INDEX IX_ReadingBookmarks_User_Book ON ReadingBookmarks(UserId, BookId);
    CREATE INDEX IX_ReadingBookmarks_BookId ON ReadingBookmarks(BookId);
END
GO
