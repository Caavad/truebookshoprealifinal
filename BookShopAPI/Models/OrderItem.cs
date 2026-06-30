using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookShopAPI.Models;

public class OrderItem
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int OrderId { get; set; }
    
    [Required]
    public int BookId { get; set; }
    
    [Required]
    public int BookFormatId { get; set; }
    
    public int Quantity { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal UnitPrice { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalPrice { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual Order Order { get; set; } = null!;
    public virtual Book Book { get; set; } = null!;
    public virtual BookFormat BookFormat { get; set; } = null!;
}

