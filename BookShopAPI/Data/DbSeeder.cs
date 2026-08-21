using BookShopAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Data;

public static class DbSeeder
{
    public static async Task SeedAdminAsync(BookShopDbContext context, IConfiguration configuration)
    {
        var email = configuration["AdminUser:Email"];
        var password = configuration["AdminUser:Password"];

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return;

        var admin = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (admin == null)
        {
            admin = new User
            {
                Email = email,
                Username = configuration["AdminUser:Username"] ?? "admin",
                FirstName = configuration["AdminUser:FirstName"] ?? "Admin",
                LastName = configuration["AdminUser:LastName"] ?? "User",
                Role = UserRole.Admin,
                IsActive = true,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(admin);
            await context.SaveChangesAsync();
            Console.WriteLine($"✅ Admin user seeded: {email}");
            return;
        }

        if (admin.Role != UserRole.Admin || !admin.IsActive)
        {
            admin.Role = UserRole.Admin;
            admin.IsActive = true;
            admin.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync();
        }
    }
}
