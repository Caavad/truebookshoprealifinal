using Microsoft.EntityFrameworkCore;
using BookShopAPI.Models;

namespace BookShopAPI.Data
{
    public class BookShopDbContext : DbContext
    {
        public BookShopDbContext(DbContextOptions<BookShopDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<BookFormat> BookFormats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Book configuration
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasIndex(e => e.Title);
                entity.HasIndex(e => e.Author);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Rating);
                
                entity.Property(e => e.Rating)
                    .HasPrecision(3, 2);
            });

            // BookFormat configuration
            modelBuilder.Entity<BookFormat>(entity =>
            {
                entity.Property(e => e.Format)
                    .HasConversion<string>();

                entity.HasOne(d => d.Book)
                    .WithMany(p => p.Formats)
                    .HasForeignKey(d => d.BookId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Role)
                    .HasConversion<string>();

                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(e => e.Status)
                    .HasConversion<string>();

                entity.HasIndex(e => e.OrderNumber).IsUnique();
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // OrderItem configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Book)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(d => d.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(d => d.BookFormat)
                    .WithMany()
                    .HasForeignKey(d => d.BookFormatId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Review configuration
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasOne(d => d.User)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Book)
                    .WithMany(p => p.Reviews)
                    .HasForeignKey(d => d.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                // One review per user per book
                entity.HasIndex(e => new { e.UserId, e.BookId }).IsUnique();
            });
        }
    }
}


// using Microsoft.EntityFrameworkCore;
// using BookShopAPI.Models;

// namespace BookShopAPI.Data;

// public class BookShopDbContext : DbContext
// {
//    /* public BookShopDbContext(DbContextOptions<BookShopDbContext> options) : base(options)
//     {
        
//     }*/

//     public DbSet<Book> Books { get; set; }
//     public DbSet<BookFormat> BookFormats { get; set; }
//     public DbSet<User> Users { get; set; }
//     public DbSet<Order> Orders { get; set; }
//     public DbSet<OrderItem> OrderItems { get; set; }
//     public DbSet<Review> Reviews { get; set; }

//     protected override void OnModelCreating(ModelBuilder modelBuilder)
//     {
//         base.OnModelCreating(modelBuilder);

//         modelBuilder.Entity<Book>(entity =>
//         {
//             entity.HasIndex(e => e.Title);
//             entity.HasIndex(e => e.Author);
//             entity.HasIndex(e => e.Category);
//             entity.HasIndex(e => e.Rating);
            
//             entity.Property(e => e.Rating)
//                 .HasPrecision(3, 2);
//         });

//         modelBuilder.Entity<BookFormat>(entity =>
//         {
//             entity.HasOne(d => d.Book)
//                 .WithMany(p => p.Formats)
//                 .HasForeignKey(d => d.BookId)
//                 .OnDelete(DeleteBehavior.Cascade);
//         });

//         modelBuilder.Entity<User>(entity =>
//         {
//             entity.HasIndex(e => e.Email).IsUnique();
//             entity.HasIndex(e => e.Username).IsUnique();
//         });

//         modelBuilder.Entity<Order>(entity =>
//         {
//             entity.HasIndex(e => e.OrderNumber).IsUnique();
//             entity.HasOne(d => d.User)
//                 .WithMany(p => p.Orders)
//                 .HasForeignKey(d => d.UserId)
//                 .OnDelete(DeleteBehavior.Restrict);
//         });

//         modelBuilder.Entity<OrderItem>(entity =>
//         {
//             entity.HasOne(d => d.Order)
//                 .WithMany(p => p.OrderItems)
//                 .HasForeignKey(d => d.OrderId)
//                 .OnDelete(DeleteBehavior.Cascade);

//             entity.HasOne(d => d.Book)
//                 .WithMany(p => p.OrderItems)
//                 .HasForeignKey(d => d.BookId)
//                 .OnDelete(DeleteBehavior.Restrict);

//             entity.HasOne(d => d.BookFormat)
//                 .WithMany()
//                 .HasForeignKey(d => d.BookFormatId)
//                 .OnDelete(DeleteBehavior.Restrict);
//         });

//         modelBuilder.Entity<Review>(entity =>
//         {
//             entity.HasOne(d => d.User)
//                 .WithMany(p => p.Reviews)
//                 .HasForeignKey(d => d.UserId)
//                 .OnDelete(DeleteBehavior.Cascade);

//             entity.HasOne(d => d.Book)
//                 .WithMany(p => p.Reviews)
//                 .HasForeignKey(d => d.BookId)
//                 .OnDelete(DeleteBehavior.Cascade);

//             entity.HasIndex(e => new { e.UserId, e.BookId }).IsUnique();
//         });
//     }
// }