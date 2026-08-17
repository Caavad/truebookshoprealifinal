using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface ILibraryService
{
    Task<IEnumerable<BookDto>> GetBooksAsync(int userId);
    Task<BookDto?> AddBookAsync(int userId, int bookId);
    Task<bool> RemoveBookAsync(int userId, int bookId);
}
