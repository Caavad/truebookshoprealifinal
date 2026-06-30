namespace BookShopAPI.DTOs;

public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public int StockCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<BookFormatDto> Formats { get; set; } = new();
}

public class BookReadDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class BookFormatDto
{
    public int Id { get; set; }
    public string Format { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CoverUrl { get; set; } = string.Empty;
    public int StockCount { get; set; }
    public int? FileSizeMB { get; set; }
    public int? Pages { get; set; }
}

public class CreateBookDto
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public int StockCount { get; set; }
    public List<CreateBookFormatDto> Formats { get; set; } = new();
}

public class CreateBookFormatDto
{
    public string Format { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CoverUrl { get; set; } = string.Empty;
    public int StockCount { get; set; }
    public int? FileSizeMB { get; set; }
    public int? Pages { get; set; }
}

public class UpdateBookDto
{
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public int StockCount { get; set; }
}
