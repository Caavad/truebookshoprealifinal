using System.ComponentModel.DataAnnotations;

namespace BookShopAPI.Models;

public class Chapter
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int BookId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public int ChapterNumber { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual Book Book { get; set; } = null!;
}
