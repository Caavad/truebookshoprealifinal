using AutoMapper;
using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class BookService : IBookService
{
    private readonly BookShopDbContext _context;
    private readonly IMapper _mapper;

    public BookService(BookShopDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
    {
        var books = await _context.Books
            .Include(b => b.Formats)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<BookDto?> GetBookByIdAsync(int id)
    {
        var book = await _context.Books
            .Include(b => b.Formats)
            .FirstOrDefaultAsync(b => b.Id == id);
        
        return book != null ? _mapper.Map<BookDto>(book) : null;
    }

    public async Task<BookReadDto?> GetBookReadAsync(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return null;

        return new BookReadDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Content = book.Content
        };
    }

    public async Task<IEnumerable<BookDto>> GetBooksByCategoryAsync(string category)
    {
        var books = await _context.Books
            .Include(b => b.Formats)
            .Where(b => b.Category.ToLower() == category.ToLower())
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<IEnumerable<BookDto>> SearchBooksAsync(string searchTerm)
    {
        var books = await _context.Books
            .Include(b => b.Formats)
            .Where(b => b.Title.Contains(searchTerm) || 
                       b.Author.Contains(searchTerm) || 
                       b.Description.Contains(searchTerm))
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<BookDto> CreateBookAsync(CreateBookDto createBookDto)
    {
        var book = _mapper.Map<Book>(createBookDto);
        book.CreatedAt = DateTime.UtcNow;
        book.UpdatedAt = DateTime.UtcNow;

        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        foreach (var formatDto in createBookDto.Formats)
        {
            var format = _mapper.Map<BookFormat>(formatDto);
            format.BookId = book.Id;
            format.CreatedAt = DateTime.UtcNow;
            format.UpdatedAt = DateTime.UtcNow;
            _context.BookFormats.Add(format);
        }

        await _context.SaveChangesAsync();

        return await GetBookByIdAsync(book.Id) ?? throw new InvalidOperationException("Failed to retrieve created book");
    }

    public async Task<BookDto?> UpdateBookAsync(int id, UpdateBookDto updateBookDto)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return null;

        _mapper.Map(updateBookDto, book);
        book.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetBookByIdAsync(id);
    }

    public async Task<bool> DeleteBookAsync(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return false;

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync()
    {
        return await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .ToListAsync();
    }

    // BookFormat methods
    public async Task<IEnumerable<BookFormatDto>> GetAllBookFormatsAsync()
    {
        var formats = await _context.BookFormats
            .Include(bf => bf.Book)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<BookFormatDto>>(formats);
    }

    public async Task<IEnumerable<BookFormatDto>> GetBookFormatsByBookIdAsync(int bookId)
    {
        var formats = await _context.BookFormats
            .Where(bf => bf.BookId == bookId)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<BookFormatDto>>(formats);
    }

    public async Task<BookFormatDto?> GetBookFormatByIdAsync(int id)
    {
        var format = await _context.BookFormats
            .Include(bf => bf.Book)
            .FirstOrDefaultAsync(bf => bf.Id == id);
        
        return format != null ? _mapper.Map<BookFormatDto>(format) : null;
    }

    public async Task<BookFormatDto> CreateBookFormatAsync(CreateBookFormatDto createBookFormatDto)
    {
        var format = _mapper.Map<BookFormat>(createBookFormatDto);
        format.CreatedAt = DateTime.UtcNow;
        format.UpdatedAt = DateTime.UtcNow;

        _context.BookFormats.Add(format);
        await _context.SaveChangesAsync();

        return await GetBookFormatByIdAsync(format.Id) ?? throw new InvalidOperationException("Failed to retrieve created book format");
    }

    public async Task<BookFormatDto?> UpdateBookFormatAsync(int id, UpdateBookFormatDto updateBookFormatDto)
    {
        var format = await _context.BookFormats.FindAsync(id);
        if (format == null) return null;

        _mapper.Map(updateBookFormatDto, format);
        format.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetBookFormatByIdAsync(id);
    }

    public async Task<bool> DeleteBookFormatAsync(int id)
    {
        var format = await _context.BookFormats.FindAsync(id);
        if (format == null) return false;

        _context.BookFormats.Remove(format);
        await _context.SaveChangesAsync();

        return true;
    }
}

