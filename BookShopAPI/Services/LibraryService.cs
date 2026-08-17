using AutoMapper;
using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class LibraryService : ILibraryService
{
    private readonly BookShopDbContext _context;
    private readonly IMapper _mapper;

    public LibraryService(BookShopDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookDto>> GetBooksAsync(int userId)
    {
        var books = await _context.LibraryItems
            .Where(item => item.UserId == userId)
            .OrderByDescending(item => item.AddedAt)
            .Select(item => item.Book)
            .Include(book => book.Formats)
            .Include(book => book.Chapters)
            .ToListAsync();
        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<BookDto?> AddBookAsync(int userId, int bookId)
    {
        var book = await _context.Books
            .Include(item => item.Formats)
            .Include(item => item.Chapters)
            .FirstOrDefaultAsync(item => item.Id == bookId);
        if (book == null) return null;

        var exists = await _context.LibraryItems.AnyAsync(item => item.UserId == userId && item.BookId == bookId);
        if (!exists)
        {
            _context.LibraryItems.Add(new LibraryItem { UserId = userId, BookId = bookId });
            await _context.SaveChangesAsync();
        }

        return _mapper.Map<BookDto>(book);
    }

    public async Task<bool> RemoveBookAsync(int userId, int bookId)
    {
        var item = await _context.LibraryItems.FirstOrDefaultAsync(item => item.UserId == userId && item.BookId == bookId);
        if (item == null) return false;
        _context.LibraryItems.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }
}
