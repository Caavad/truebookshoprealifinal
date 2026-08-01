using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class ReadingBookmarkService : IReadingBookmarkService
{
    private readonly BookShopDbContext _context;

    public ReadingBookmarkService(BookShopDbContext context)
    {
        _context = context;
    }

    public async Task<ReadingBookmarkDto?> GetBookmarkAsync(int userId, int bookId)
    {
        return await _context.ReadingBookmarks
            .Where(b => b.UserId == userId && b.BookId == bookId)
            .Select(b => new ReadingBookmarkDto
            {
                BookId = b.BookId,
                ChapterId = b.ChapterId,
                ChapterNumber = b.Chapter.ChapterNumber
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ReadingBookmarkDto> SetBookmarkAsync(int userId, int bookId, int chapterId)
    {
        var chapter = await _context.Chapters
            .FirstOrDefaultAsync(c => c.Id == chapterId && c.BookId == bookId)
            ?? throw new InvalidOperationException("The chapter does not belong to this book.");

        var bookmark = await _context.ReadingBookmarks
            .FirstOrDefaultAsync(b => b.UserId == userId && b.BookId == bookId);

        if (bookmark == null)
        {
            bookmark = new ReadingBookmark
            {
                UserId = userId,
                BookId = bookId,
                ChapterId = chapterId
            };
            _context.ReadingBookmarks.Add(bookmark);
        }
        else
        {
            bookmark.ChapterId = chapterId;
            bookmark.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return new ReadingBookmarkDto
        {
            BookId = bookId,
            ChapterId = chapterId,
            ChapterNumber = chapter.ChapterNumber
        };
    }

    public async Task RemoveBookmarkForChapterAsync(int chapterId)
    {
        var bookmarks = await _context.ReadingBookmarks
            .Where(b => b.ChapterId == chapterId)
            .ToListAsync();
        _context.ReadingBookmarks.RemoveRange(bookmarks);
        await _context.SaveChangesAsync();
    }

    public Task UpdateBookmarksAfterChapterDeleteAsync(int bookId, int deletedChapterId, int deletedChapterNumber)
        => RemoveBookmarkForChapterAsync(deletedChapterId);
}
