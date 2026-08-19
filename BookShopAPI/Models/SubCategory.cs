using System.ComponentModel.DataAnnotations;

namespace BookShopAPI.Models;

public class SubCategory
{
    [Key]
    public int Id { get; set; }

    public int CategoryId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(80)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(80)]
    public string DisplayName { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual Category Category { get; set; } = null!;
}
