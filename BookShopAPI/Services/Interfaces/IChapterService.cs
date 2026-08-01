using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface IChapterService
{
    Task<IEnumerable<ChapterDto>> GetChaptersByBookIdAsync(int bookId);
    Task<ChapterDto?> GetChapterByIdAsync(int id);
    Task<ChapterDto> CreateChapterAsync(CreateChapterDto dto);
    Task<ChapterDto?> UpdateChapterAsync(int id, UpdateChapterDto dto);
    Task<bool> DeleteChapterAsync(int id);
    Task<bool> IsBookOwnedByUserAsync(int bookId, int userId);
}
