namespace BookShopAPI.DTOs;

public class UpdateBookFormatDto
{
    public string Format { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CoverUrl { get; set; } = string.Empty;
    public int StockCount { get; set; }
    public int? FileSizeMB { get; set; }
    public int? Pages { get; set; }
}
