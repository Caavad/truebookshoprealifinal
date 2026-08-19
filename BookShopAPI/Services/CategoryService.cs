using AutoMapper;
using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Helpers;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class CategoryService : ICategoryService
{
    private readonly BookShopDbContext _context;
    private readonly IMapper _mapper;

    private static readonly (string Name, string DisplayName, string Description, (string Name, string DisplayName, string Description)[] Subs)[] Defaults =
    [
        ("Programming", "Programming", "Books for software developers and computer science enthusiasts.",
        [
            ("frontend", "Frontend", "JavaScript, React, CSS and UI books"),
            ("backend", "Backend", "Node.js, APIs, databases and server-side books"),
            ("devops", "DevOps", "CI/CD, Docker, Kubernetes and infrastructure books"),
            ("testing", "Testing", "Books on software testing and test-driven development")
        ]),
        ("Self-help", "Self-help", "Books to improve productivity, habits, and mindset.",
        [
            ("productivity", "Productivity", "Books to help you get more done in less time."),
            ("habits", "Habits", "Master the science of habits and behavior change."),
            ("motivation", "Motivation", "Books to inspire and energize your life.")
        ]),
        ("Fiction", "Fiction", "Engaging novels, stories, and literary works.",
        [
            ("sci-fi", "Science Fiction", "Explore futuristic and speculative storytelling."),
            ("fantasy", "Fantasy", "Dive into magical worlds and mythical creatures."),
            ("mystery", "Mystery", "Solve thrilling puzzles and dark mysteries."),
            ("classics", "Classics", "Timeless literary masterpieces.")
        ]),
        ("History", "History", "Understand the past to shape the future.",
        [
            ("world", "World History", "Explore civilizations and key historical events."),
            ("biographies", "Biographies", "Life stories of remarkable people."),
            ("politics-war", "Politics & War", "Wars, revolutions, and political change.")
        ])
    ];

    public CategoryService(BookShopDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _context.Categories
            .Include(c => c.SubCategories)
            .OrderBy(c => c.DisplayName)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return categories.Select(MapCategory);
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var category = await GetOrCreateCategoryAsync(dto.Name, dto.Description, persist: true);
        return MapCategory(category);
    }

    public async Task<SubCategoryDto> CreateSubCategoryAsync(int categoryId, CreateSubCategoryDto dto)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == categoryId)
            ?? throw new KeyNotFoundException("Category not found");

        var sub = await GetOrCreateSubCategoryAsync(category, dto.Name, dto.Description, persist: true);
        return MapSubCategory(sub);
    }

    public async Task EnsureCatalogEntryAsync(string categoryName, string? subCategoryName)
    {
        var category = await GetOrCreateCategoryAsync(categoryName, null, persist: true);
        if (!string.IsNullOrWhiteSpace(subCategoryName))
            await GetOrCreateSubCategoryAsync(category, subCategoryName, null, persist: true);
    }

    public async Task SeedDefaultsAsync()
    {
        foreach (var item in Defaults)
        {
            var category = await GetOrCreateCategoryAsync(item.Name, item.Description, persist: true, displayName: item.DisplayName);
            foreach (var sub in item.Subs)
                await GetOrCreateSubCategoryAsync(category, sub.Name, sub.Description, persist: true, displayName: sub.DisplayName);
        }

        var bookGenres = await _context.Books
            .Select(b => new { b.Category, b.SubCategory })
            .Distinct()
            .ToListAsync();

        foreach (var genre in bookGenres)
        {
            if (string.IsNullOrWhiteSpace(genre.Category))
                continue;

            await EnsureCatalogEntryAsync(genre.Category, genre.SubCategory);
        }
    }

    private async Task<Category> GetOrCreateCategoryAsync(
        string name,
        string? description,
        bool persist,
        string? displayName = null)
    {
        var trimmed = name.Trim();
        if (string.IsNullOrWhiteSpace(trimmed))
            throw new ArgumentException("Category name is required");

        var slug = UniqueSlug(SlugHelper.Slugify(trimmed), trimmed);
        var existing = await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c =>
                c.Slug == slug ||
                c.Name.ToLower() == trimmed.ToLower());

        if (existing != null)
        {
            var changed = false;
            if (string.IsNullOrWhiteSpace(existing.DisplayName))
            {
                existing.DisplayName = displayName?.Trim() is { Length: > 0 } dn ? dn : trimmed;
                changed = true;
            }
            if (!string.IsNullOrWhiteSpace(description) && string.IsNullOrWhiteSpace(existing.Description))
            {
                existing.Description = description.Trim();
                changed = true;
            }
            if (changed && persist)
                await _context.SaveChangesAsync();

            return existing;
        }

        var category = new Category
        {
            Name = trimmed,
            Slug = slug,
            DisplayName = string.IsNullOrWhiteSpace(displayName) ? trimmed : displayName.Trim(),
            Description = description?.Trim() ?? $"Books in the {trimmed} category.",
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        if (persist)
            await _context.SaveChangesAsync();

        return category;
    }

    private async Task<SubCategory> GetOrCreateSubCategoryAsync(
        Category category,
        string name,
        string? description,
        bool persist,
        string? displayName = null)
    {
        var trimmed = name.Trim();
        if (string.IsNullOrWhiteSpace(trimmed))
            throw new ArgumentException("Subcategory name is required");

        var slug = UniqueSlug(SlugHelper.Slugify(trimmed), trimmed);
        await _context.Entry(category).Collection(c => c.SubCategories).LoadAsync();

        var existing = category.SubCategories.FirstOrDefault(s =>
            s.Slug == slug ||
            string.Equals(s.Name, trimmed, StringComparison.OrdinalIgnoreCase));

        if (existing != null)
        {
            var changed = false;
            if (string.IsNullOrWhiteSpace(existing.DisplayName))
            {
                existing.DisplayName = displayName?.Trim() is { Length: > 0 } dn ? dn : trimmed;
                changed = true;
            }
            if (!string.IsNullOrWhiteSpace(description) && string.IsNullOrWhiteSpace(existing.Description))
            {
                existing.Description = description.Trim();
                changed = true;
            }
            if (changed && persist)
                await _context.SaveChangesAsync();

            return existing;
        }

        var sub = new SubCategory
        {
            CategoryId = category.Id,
            Name = trimmed,
            Slug = slug,
            DisplayName = string.IsNullOrWhiteSpace(displayName) ? trimmed : displayName.Trim(),
            Description = description?.Trim() ?? $"Books in the {trimmed} subcategory.",
            CreatedAt = DateTime.UtcNow
        };

        category.SubCategories.Add(sub);
        _context.SubCategories.Add(sub);
        if (persist)
            await _context.SaveChangesAsync();

        return sub;
    }

    private static string UniqueSlug(string slug, string fallback)
    {
        if (!string.IsNullOrWhiteSpace(slug))
            return slug;

        var compact = new string(fallback.Where(char.IsLetterOrDigit).ToArray()).ToLowerInvariant();
        return string.IsNullOrWhiteSpace(compact) ? $"genre-{Guid.NewGuid():N}"[..16] : compact;
    }

    private CategoryDto MapCategory(Category category)
    {
        var dto = _mapper.Map<CategoryDto>(category);
        dto.SubCategories = category.SubCategories
            .OrderBy(s => s.DisplayName)
            .ThenBy(s => s.Name)
            .Select(MapSubCategory)
            .ToList();
        return dto;
    }

    private SubCategoryDto MapSubCategory(SubCategory sub) => _mapper.Map<SubCategoryDto>(sub);
}
