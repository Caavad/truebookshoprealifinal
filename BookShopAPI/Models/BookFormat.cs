using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookShopAPI.Models;

public enum BookFormatType
{
    Ebook,
    Audiobook,
    Paperback,
    Hardcover
}

public class BookFormat
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public BookFormatType Format { get; set; }
    
    [Required]
    [MaxLength(10)]
    public string Language { get; set; } = "en";
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }
    
    [MaxLength(500)]
    public string CoverUrl { get; set; } = string.Empty;
    
    public int StockCount { get; set; }
    
    public int? FileSizeMB { get; set; }
    
    public int? Pages { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Foreign key
    [Required]
    public int BookId { get; set; }
    
    // Navigation property
    public virtual Book Book { get; set; } = null!;
}

