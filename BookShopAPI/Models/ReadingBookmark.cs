using System.ComponentModel.DataAnnotations;

namespace BookShopAPI.Models;

public class ReadingBookmark
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    public int BookId { get; set; }

    public int ChapterId { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;
    public virtual Book Book { get; set; } = null!;
    public virtual Chapter Chapter { get; set; } = null!;
}
