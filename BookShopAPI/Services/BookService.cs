using AutoMapper;
using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Helpers;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class BookService : IBookService
{
    private readonly BookShopDbContext _context;
    private readonly IMapper _mapper;
    private readonly ICategoryService _categoryService;

    public BookService(BookShopDbContext context, IMapper mapper, ICategoryService categoryService)
    {
        _context = context;
        _mapper = mapper;
        _categoryService = categoryService;
    }

    public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
    {
        var books = await _context.Books
            .Include(b => b.Formats)
            .Include(b => b.Chapters)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<IEnumerable<BookDto>> GetBooksByAuthorIdAsync(int authorId)
    {
        var books = await _context.Books
            .Include(b => b.Formats)
            .Include(b => b.Chapters)
            .Where(b => b.AuthorId == authorId)
            .ToListAsync();

        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<bool> IsBookOwnedByAuthorAsync(int bookId, int authorId)
    {
        return await _context.Books.AnyAsync(b => b.Id == bookId && b.AuthorId == authorId);
    }

    public async Task<BookDto?> GetBookByIdAsync(int id)
    {
        var book = await _context.Books
            .Include(b => b.Formats)
            .Include(b => b.Chapters)
            .FirstOrDefaultAsync(b => b.Id == id);
        
        return book != null ? _mapper.Map<BookDto>(book) : null;
    }

    public async Task<BookReadDto?> GetBookReadAsync(int id)
    {
        var book = await _context.Books
            .Include(b => b.Chapters)
            .FirstOrDefaultAsync(b => b.Id == id);
        if (book == null) return null;

        var chapters = book.Chapters.OrderBy(c => c.ChapterNumber).ToList();
        var content = chapters.Count > 0
            ? string.Join("\n\n", chapters.Select(c => $"{c.Title}\n\n{c.Content}"))
            : book.Content;

        return new BookReadDto
        {
            Id = book.Id,
            Title = book.Title,
            Author = book.Author,
            Content = content,
            Chapters = _mapper.Map<List<ChapterDto>>(chapters)
        };
    }

    public async Task<IEnumerable<BookDto>> GetBooksByCategoryAsync(string category)
    {
        var needle = category.Trim().ToLower();
        var slug = SlugHelper.Slugify(category);
        var books = await _context.Books
            .Include(b => b.Formats)
            .Where(b => b.Category.ToLower() == needle)
            .ToListAsync();

        if (books.Count == 0 && !string.IsNullOrWhiteSpace(slug))
        {
            books = await _context.Books
                .Include(b => b.Formats)
                .ToListAsync();
            books = books
                .Where(b => SlugHelper.Slugify(b.Category) == slug)
                .ToList();
        }
        
        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<IEnumerable<BookDto>> SearchBooksAsync(string searchTerm)
    {
        var books = await _context.Books
            .Include(b => b.Formats)
            .Where(b => b.Title.Contains(searchTerm) || 
                       b.Author.Contains(searchTerm) || 
                       b.Description.Contains(searchTerm) ||
                       b.Category.Contains(searchTerm) ||
                       b.SubCategory.Contains(searchTerm))
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<BookDto>>(books);
    }

    public async Task<BookDto> CreateBookAsync(CreateBookDto createBookDto, int? authorId = null)
    {
        await _categoryService.EnsureCatalogEntryAsync(createBookDto.Category, createBookDto.SubCategory);

        var book = _mapper.Map<Book>(createBookDto);
        book.AuthorId = authorId;
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

        await _categoryService.EnsureCatalogEntryAsync(updateBookDto.Category, updateBookDto.SubCategory);

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

