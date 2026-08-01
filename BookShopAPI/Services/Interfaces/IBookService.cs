using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface IBookService
{
    Task<IEnumerable<BookDto>> GetAllBooksAsync();
    Task<IEnumerable<BookDto>> GetBooksByAuthorIdAsync(int authorId);
    Task<BookDto?> GetBookByIdAsync(int id);
    Task<BookReadDto?> GetBookReadAsync(int id);
    Task<IEnumerable<BookDto>> GetBooksByCategoryAsync(string category);
    Task<IEnumerable<BookDto>> SearchBooksAsync(string searchTerm);
    Task<BookDto> CreateBookAsync(CreateBookDto createBookDto, int? authorId = null);
    Task<BookDto?> UpdateBookAsync(int id, UpdateBookDto updateBookDto);
    Task<bool> DeleteBookAsync(int id);
    Task<bool> IsBookOwnedByAuthorAsync(int bookId, int authorId);
    Task<IEnumerable<string>> GetCategoriesAsync();
    
    // BookFormat methods
    Task<IEnumerable<BookFormatDto>> GetAllBookFormatsAsync();
    Task<IEnumerable<BookFormatDto>> GetBookFormatsByBookIdAsync(int bookId);
    Task<BookFormatDto?> GetBookFormatByIdAsync(int id);
    Task<BookFormatDto> CreateBookFormatAsync(CreateBookFormatDto createBookFormatDto);
    Task<BookFormatDto?> UpdateBookFormatAsync(int id, UpdateBookFormatDto updateBookFormatDto);
    Task<bool> DeleteBookFormatAsync(int id);
}

