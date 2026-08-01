using BookShopAPI.DTOs;
using BookShopAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookShopAPI.Controllers;

[ApiController]
[Route("api/reading-bookmarks")]
[Authorize]
public class ReadingBookmarksController : ControllerBase
{
    private readonly IReadingBookmarkService _bookmarkService;

    public ReadingBookmarksController(IReadingBookmarkService bookmarkService)
    {
        _bookmarkService = bookmarkService;
    }

    [HttpGet("book/{bookId}")]
    public async Task<ActionResult<ReadingBookmarkDto?>> GetBookmark(int bookId)
    {
        return Ok(await _bookmarkService.GetBookmarkAsync(GetCurrentUserId(), bookId));
    }

    [HttpPut("book/{bookId}")]
    public async Task<ActionResult<ReadingBookmarkDto>> SetBookmark(int bookId, SetReadingBookmarkDto dto)
    {
        try
        {
            return Ok(await _bookmarkService.SetBookmarkAsync(GetCurrentUserId(), bookId, dto.ChapterId));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private int GetCurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (int.TryParse(value, out var userId)) return userId;
        throw new UnauthorizedAccessException("User ID not found in token");
    }
}
