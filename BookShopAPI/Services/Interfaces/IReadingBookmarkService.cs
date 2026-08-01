using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface IReadingBookmarkService
{
    Task<ReadingBookmarkDto?> GetBookmarkAsync(int userId, int bookId);
    Task<ReadingBookmarkDto> SetBookmarkAsync(int userId, int bookId, int chapterId);
    Task RemoveBookmarkForChapterAsync(int chapterId);
    Task UpdateBookmarksAfterChapterDeleteAsync(int bookId, int deletedChapterId, int deletedChapterNumber);
}
