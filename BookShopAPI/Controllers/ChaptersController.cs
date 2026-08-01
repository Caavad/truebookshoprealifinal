using BookShopAPI.DTOs;
using BookShopAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChaptersController : ControllerBase
{
    private readonly IChapterService _chapterService;
    private readonly IBookService _bookService;
    private readonly IReadingBookmarkService _bookmarkService;
    private readonly ILogger<ChaptersController> _logger;

    public ChaptersController(
        IChapterService chapterService,
        IBookService bookService,
        IReadingBookmarkService bookmarkService,
        ILogger<ChaptersController> logger)
    {
        _chapterService = chapterService;
        _bookService = bookService;
        _bookmarkService = bookmarkService;
        _logger = logger;
    }

    [HttpGet("book/{bookId}")]
    public async Task<ActionResult<IEnumerable<ChapterDto>>> GetChaptersByBook(int bookId)
    {
        try
        {
            var chapters = await _chapterService.GetChaptersByBookIdAsync(bookId);
            return Ok(chapters);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving chapters for book {BookId}", bookId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Author")]
    public async Task<ActionResult<ChapterDto>> CreateChapter(CreateChapterDto dto)
    {
        try
        {
            if (!await CanManageBookAsync(dto.BookId))
                return Forbid();

            var chapter = await _chapterService.CreateChapterAsync(dto);
            return CreatedAtAction(nameof(GetChaptersByBook), new { bookId = dto.BookId }, chapter);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating chapter");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<ActionResult<ChapterDto>> UpdateChapter(int id, UpdateChapterDto dto)
    {
        try
        {
            var existing = await _chapterService.GetChapterByIdAsync(id);
            if (existing == null) return NotFound();

            if (!await CanManageBookAsync(existing.BookId))
                return Forbid();

            var chapter = await _chapterService.UpdateChapterAsync(id, dto);
            return Ok(chapter);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating chapter {ChapterId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> DeleteChapter(int id)
    {
        try
        {
            var existing = await _chapterService.GetChapterByIdAsync(id);
            if (existing == null) return NotFound();

            if (!await CanManageBookAsync(existing.BookId))
                return Forbid();

            await _bookmarkService.RemoveBookmarkForChapterAsync(id);
            await _chapterService.DeleteChapterAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting chapter {ChapterId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    private async Task<bool> CanManageBookAsync(int bookId)
    {
        var role = GetCurrentUserRole();
        if (role == "Admin") return true;
        if (role == "Author")
            return await _bookService.IsBookOwnedByAuthorAsync(bookId, GetCurrentUserId());
        return false;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;

        throw new UnauthorizedAccessException("User ID not found in token");
    }

    private string GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? "Customer";
    }
}
