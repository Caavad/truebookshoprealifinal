using System.ComponentModel.DataAnnotations;

namespace BookShopAPI.Models;

public class LibraryItem
{
    [Key]
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    public virtual User User { get; set; } = null!;
    public virtual Book Book { get; set; } = null!;
}
