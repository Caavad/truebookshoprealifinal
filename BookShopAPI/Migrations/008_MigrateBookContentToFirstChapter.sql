-- Preserve legacy Books.Content as chapter 1. The script is safe to run at every startup:
-- it adds a chapter only for a book that does not have any chapters yet.
INSERT INTO Chapters (BookId, Title, ChapterNumber, Content, CreatedAt, UpdatedAt)
SELECT
    b.Id,
    N'Chapter 1',
    1,
    b.Content,
    SYSUTCDATETIME(),
    SYSUTCDATETIME()
FROM Books b
WHERE NULLIF(LTRIM(RTRIM(b.Content)), N'') IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM Chapters c
      WHERE c.BookId = b.Id
  );
