namespace BookShopAPI.DTOs;

public class ReadingBookmarkDto
{
    public int BookId { get; set; }
    public int ChapterId { get; set; }
    public int ChapterNumber { get; set; }
}

public class SetReadingBookmarkDto
{
    public int ChapterId { get; set; }
}

public class ChapterListItemDto
{
    public int Id { get; set; }
    public int ChapterNumber { get; set; }
    public string Title { get; set; } = string.Empty;
}

public class BookChapterReadDto
{
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public bool HasStructuredChapters { get; set; }
    public ChapterDto? CurrentChapter { get; set; }
    public List<ChapterListItemDto> Chapters { get; set; } = [];
    public int? PrevChapterNumber { get; set; }
    public int? NextChapterNumber { get; set; }
    public string? FlatContent { get; set; }
}
