namespace BookShopAPI.DTOs;

public class ChapterDto
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ChapterNumber { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class CreateChapterDto
{
    public int BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public int ChapterNumber { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class UpdateChapterDto
{
    public string Title { get; set; } = string.Empty;
    public int ChapterNumber { get; set; }
    public string Content { get; set; } = string.Empty;
}
