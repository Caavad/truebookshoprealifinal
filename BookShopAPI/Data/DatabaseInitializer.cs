using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;

namespace BookShopAPI.Data;

public static class DatabaseInitializer
{
    private static readonly string[] MigrationFiles =
    [
        "001_InitialCreate.sql",
        "002_SeedBooks.sql"
    ];

    public static async Task InitializeAsync(IServiceProvider serviceProvider, IWebHostEnvironment environment)
    {
        using var scope = serviceProvider.CreateScope();
        var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection not configured");

        await EnsureDatabaseExistsAsync(connectionString, logger);

        if (!await TableExistsAsync(connectionString, "Books"))
        {
            logger.LogInformation("Applying SQL migrations from Migrations folder...");
            var migrationsPath = Path.Combine(environment.ContentRootPath, "Migrations");

            foreach (var file in MigrationFiles)
            {
                var filePath = Path.Combine(migrationsPath, file);
                if (!File.Exists(filePath))
                {
                    logger.LogWarning("Migration file not found: {FilePath}", filePath);
                    continue;
                }

                var sql = await File.ReadAllTextAsync(filePath);
                await ExecuteSqlScriptAsync(connectionString, sql, logger, file);
                logger.LogInformation("Applied migration: {File}", file);
            }
        }
        else
        {
            logger.LogInformation("Database schema already exists");
        }

        await SeedAdminUserAsync(scope.ServiceProvider, logger);
        await ApplySchemaUpdatesAsync(connectionString, environment, logger);
        await SeedCategoriesAsync(scope.ServiceProvider, logger);
    }

    private static async Task ApplySchemaUpdatesAsync(
        string connectionString,
        IWebHostEnvironment environment,
        ILogger logger)
    {
        var migrationsPath = Path.Combine(environment.ContentRootPath, "Migrations");

        if (!await ColumnExistsAsync(connectionString, "Books", "SubCategory"))
        {
            var filePath = Path.Combine(migrationsPath, "003_AddBookSubCategoryAndContent.sql");
            if (File.Exists(filePath))
            {
                var sql = await File.ReadAllTextAsync(filePath);
                await ExecuteSqlScriptAsync(connectionString, sql, logger, "003_AddBookSubCategoryAndContent.sql");
                logger.LogInformation("Applied schema update: 003_AddBookSubCategoryAndContent.sql");
            }
        }

        var seedPath = Path.Combine(migrationsPath, "004_SeedBookContent.sql");
        if (File.Exists(seedPath))
        {
            var sql = await File.ReadAllTextAsync(seedPath);
            await ExecuteSqlScriptAsync(connectionString, sql, logger, "004_SeedBookContent.sql");
            logger.LogInformation("Applied seed update: 004_SeedBookContent.sql");
        }

        var fixNullsPath = Path.Combine(migrationsPath, "005_FixNullBookFields.sql");
        if (File.Exists(fixNullsPath))
        {
            var sql = await File.ReadAllTextAsync(fixNullsPath);
            await ExecuteSqlScriptAsync(connectionString, sql, logger, "005_FixNullBookFields.sql");
            logger.LogInformation("Applied fix: 005_FixNullBookFields.sql");
        }

        if (!await TableExistsAsync(connectionString, "Chapters"))
        {
            var authorPath = Path.Combine(migrationsPath, "006_AddAuthorAndChapters.sql");
            if (File.Exists(authorPath))
            {
                var sql = await File.ReadAllTextAsync(authorPath);
                await ExecuteSqlScriptAsync(connectionString, sql, logger, "006_AddAuthorAndChapters.sql");
                logger.LogInformation("Applied schema update: 006_AddAuthorAndChapters.sql");
            }
        }

        if (!await TableExistsAsync(connectionString, "ReadingBookmarks"))
        {
            var bookmarksPath = Path.Combine(migrationsPath, "007_AddReadingBookmarks.sql");
            if (File.Exists(bookmarksPath))
            {
                var sql = await File.ReadAllTextAsync(bookmarksPath);
                await ExecuteSqlScriptAsync(connectionString, sql, logger, "007_AddReadingBookmarks.sql");
                logger.LogInformation("Applied schema update: 007_AddReadingBookmarks.sql");
            }
        }

        // Existing books stored their text in Books.Content. Preserve that text
        // by exposing it as chapter 1, so every existing book uses the chapter reader.
        var chapterContentMigrationPath = Path.Combine(migrationsPath, "008_MigrateBookContentToFirstChapter.sql");
        if (File.Exists(chapterContentMigrationPath))
        {
            var sql = await File.ReadAllTextAsync(chapterContentMigrationPath);
            await ExecuteSqlScriptAsync(connectionString, sql, logger, "008_MigrateBookContentToFirstChapter.sql");
            logger.LogInformation("Applied content-to-chapter update: 008_MigrateBookContentToFirstChapter.sql");
        }

        if (!await TableExistsAsync(connectionString, "LibraryItems"))
        {
            var libraryPath = Path.Combine(migrationsPath, "009_AddLibraryItems.sql");
            if (File.Exists(libraryPath))
            {
                var sql = await File.ReadAllTextAsync(libraryPath);
                await ExecuteSqlScriptAsync(connectionString, sql, logger, "009_AddLibraryItems.sql");
                logger.LogInformation("Applied schema update: 009_AddLibraryItems.sql");
            }
        }

        if (!await TableExistsAsync(connectionString, "Categories"))
        {
            var categoriesPath = Path.Combine(migrationsPath, "010_AddCategories.sql");
            if (File.Exists(categoriesPath))
            {
                var sql = await File.ReadAllTextAsync(categoriesPath);
                await ExecuteSqlScriptAsync(connectionString, sql, logger, "010_AddCategories.sql");
                logger.LogInformation("Applied schema update: 010_AddCategories.sql");
            }
        }
    }

    private static async Task<bool> ColumnExistsAsync(string connectionString, string tableName, string columnName)
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = @TableName AND COLUMN_NAME = @ColumnName
            """;
        command.Parameters.AddWithValue("@TableName", tableName);
        command.Parameters.AddWithValue("@ColumnName", columnName);

        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result) > 0;
    }

    private static async Task SeedCategoriesAsync(IServiceProvider serviceProvider, ILogger logger)
    {
        try
        {
            var categoryService = serviceProvider.GetRequiredService<ICategoryService>();
            await categoryService.SeedDefaultsAsync();
            logger.LogInformation("Genre catalog seeded");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to seed genre catalog");
        }
    }

    private static async Task SeedAdminUserAsync(IServiceProvider serviceProvider, ILogger logger)
    {
        var context = serviceProvider.GetRequiredService<BookShopDbContext>();

        if (await context.Users.AnyAsync(u => u.Email == "admin@bookshop.com"))
        {
            logger.LogInformation("Admin user already exists");
            return;
        }

        var admin = new User
        {
            Email = "admin@bookshop.com",
            Username = "admin",
            FirstName = "Admin",
            LastName = "User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();
        logger.LogInformation("Default admin user created: admin@bookshop.com");
    }

    private static async Task EnsureDatabaseExistsAsync(string connectionString, ILogger logger)
    {
        var builder = new SqlConnectionStringBuilder(connectionString);
        var databaseName = builder.InitialCatalog;
        builder.InitialCatalog = "master";

        await using var connection = new SqlConnection(builder.ConnectionString);
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        command.CommandText = $"""
            IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'{databaseName}')
            BEGIN
                CREATE DATABASE [{databaseName}];
            END
            """;
        await command.ExecuteNonQueryAsync();
        logger.LogInformation("Database {DatabaseName} is ready", databaseName);
    }

    private static async Task<bool> TableExistsAsync(string connectionString, string tableName)
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = @TableName
            """;
        command.Parameters.AddWithValue("@TableName", tableName);

        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result) > 0;
    }

    private static async Task ExecuteSqlScriptAsync(string connectionString, string sql, ILogger logger, string fileName)
    {
        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var batches = sql.Split(
            ["\r\nGO\r\n", "\r\nGO\n", "\nGO\n", "\nGO\r\n"],
            StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        foreach (var batch in batches)
        {
            if (string.IsNullOrWhiteSpace(batch))
                continue;

            await using var command = connection.CreateCommand();
            command.CommandText = batch;
            command.CommandTimeout = 120;

            try
            {
                await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error executing migration batch from {FileName}", fileName);
                throw;
            }
        }
    }
}
