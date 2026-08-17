using BookShopAPI.DTOs;
using BookShopAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookShopAPI.Controllers;

[ApiController]
[Route("api/library")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _libraryService;
    public LibraryController(ILibraryService libraryService) => _libraryService = libraryService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks() => Ok(await _libraryService.GetBooksAsync(UserId));

    [HttpPost("{bookId:int}")]
    public async Task<ActionResult<BookDto>> AddBook(int bookId)
    {
        var book = await _libraryService.AddBookAsync(UserId, bookId);
        return book == null ? NotFound() : Ok(book);
    }

    [HttpDelete("{bookId:int}")]
    public async Task<IActionResult> RemoveBook(int bookId)
    {
        return await _libraryService.RemoveBookAsync(UserId, bookId) ? NoContent() : NotFound();
    }

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
