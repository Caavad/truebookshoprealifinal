using BookShopAPI.DTOs;
using BookShopAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BookShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;
    private readonly ILogger<BooksController> _logger;

    public BooksController(IBookService bookService, ILogger<BooksController> logger)
    {
        _bookService = bookService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
    {
        try
        {
            var books = await _bookService.GetAllBooksAsync();
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving books");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("my-books")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetMyBooks()
    {
        try
        {
            // Administrators manage chapters for any book; authors only see books they own.
            if (GetCurrentUserRole() == "Admin")
                return Ok(await _bookService.GetAllBooksAsync());

            var books = await _bookService.GetBooksByAuthorIdAsync(GetCurrentUserId());
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving author books");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}/read")]
    public async Task<ActionResult<BookReadDto>> GetBookRead(int id)
    {
        try
        {
            var book = await _bookService.GetBookReadAsync(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving book content with ID {BookId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookDto>> GetBook(int id)
    {
        try
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving book with ID {BookId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("category/{category}")]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetBooksByCategory(string category)
    {
        try
        {
            var books = await _bookService.GetBooksByCategoryAsync(category);
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving books by category {Category}", category);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<BookDto>>> SearchBooks([FromQuery] string q)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Search query cannot be empty");

            var books = await _bookService.SearchBooksAsync(q);
            return Ok(books);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching books with query {Query}", q);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        try
        {
            var categories = await _bookService.GetCategoriesAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving categories");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Author")]
    public async Task<ActionResult<BookDto>> CreateBook(CreateBookDto createBookDto)
    {
        try
        {
            int? authorId = null;
            if (GetCurrentUserRole() == "Author")
                authorId = GetCurrentUserId();

            var book = await _bookService.CreateBookAsync(createBookDto, authorId);
            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating book");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<ActionResult<BookDto>> UpdateBook(int id, UpdateBookDto updateBookDto)
    {
        try
        {
            if (!await CanManageBookAsync(id))
                return Forbid();

            var book = await _bookService.UpdateBookAsync(id, updateBookDto);
            if (book == null)
                return NotFound();

            return Ok(book);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating book with ID {BookId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        try
        {
            if (!await CanManageBookAsync(id))
                return Forbid();

            var result = await _bookService.DeleteBookAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting book with ID {BookId}", id);
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
