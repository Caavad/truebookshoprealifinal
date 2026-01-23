using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface IBookService
{
    Task<IEnumerable<BookDto>> GetAllBooksAsync();
    Task<BookDto?> GetBookByIdAsync(int id);
    Task<IEnumerable<BookDto>> GetBooksByCategoryAsync(string category);
    Task<IEnumerable<BookDto>> SearchBooksAsync(string searchTerm);
    Task<BookDto> CreateBookAsync(CreateBookDto createBookDto);
    Task<BookDto?> UpdateBookAsync(int id, UpdateBookDto updateBookDto);
    Task<bool> DeleteBookAsync(int id);
    Task<IEnumerable<string>> GetCategoriesAsync();
    
    // BookFormat methods
    Task<IEnumerable<BookFormatDto>> GetAllBookFormatsAsync();
    Task<IEnumerable<BookFormatDto>> GetBookFormatsByBookIdAsync(int bookId);
    Task<BookFormatDto?> GetBookFormatByIdAsync(int id);
    Task<BookFormatDto> CreateBookFormatAsync(CreateBookFormatDto createBookFormatDto);
    Task<BookFormatDto?> UpdateBookFormatAsync(int id, UpdateBookFormatDto updateBookFormatDto);
    Task<bool> DeleteBookFormatAsync(int id);
}

