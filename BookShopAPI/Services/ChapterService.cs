using AutoMapper;
using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class ChapterService : IChapterService
{
    private readonly BookShopDbContext _context;
    private readonly IMapper _mapper;

    public ChapterService(BookShopDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ChapterDto>> GetChaptersByBookIdAsync(int bookId)
    {
        var chapters = await _context.Chapters
            .Where(c => c.BookId == bookId)
            .OrderBy(c => c.ChapterNumber)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ChapterDto>>(chapters);
    }

    public async Task<ChapterDto?> GetChapterByIdAsync(int id)
    {
        var chapter = await _context.Chapters.FindAsync(id);
        return chapter != null ? _mapper.Map<ChapterDto>(chapter) : null;
    }

    public async Task<ChapterDto> CreateChapterAsync(CreateChapterDto dto)
    {
        var chapter = _mapper.Map<Chapter>(dto);
        chapter.CreatedAt = DateTime.UtcNow;
        chapter.UpdatedAt = DateTime.UtcNow;

        _context.Chapters.Add(chapter);
        await _context.SaveChangesAsync();

        return _mapper.Map<ChapterDto>(chapter);
    }

    public async Task<ChapterDto?> UpdateChapterAsync(int id, UpdateChapterDto dto)
    {
        var chapter = await _context.Chapters.FindAsync(id);
        if (chapter == null) return null;

        _mapper.Map(dto, chapter);
        chapter.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return _mapper.Map<ChapterDto>(chapter);
    }

    public async Task<bool> DeleteChapterAsync(int id)
    {
        var chapter = await _context.Chapters.FindAsync(id);
        if (chapter == null) return false;

        _context.Chapters.Remove(chapter);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsBookOwnedByUserAsync(int bookId, int userId)
    {
        return await _context.Books.AnyAsync(b => b.Id == bookId && b.AuthorId == userId);
    }
}
