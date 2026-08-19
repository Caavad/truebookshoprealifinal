using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto);
    Task<SubCategoryDto> CreateSubCategoryAsync(int categoryId, CreateSubCategoryDto dto);
    Task EnsureCatalogEntryAsync(string categoryName, string? subCategoryName);
    Task SeedDefaultsAsync();
}
