using BookShopAPI.DTOs;
using BookShopAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookShopAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookFormatsController : ControllerBase
{
    private readonly IBookService _bookService;
    private readonly ILogger<BookFormatsController> _logger;

    public BookFormatsController(IBookService bookService, ILogger<BookFormatsController> logger)
    {
        _bookService = bookService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookFormatDto>>> GetAllBookFormats()
    {
        try
        {
            var formats = await _bookService.GetAllBookFormatsAsync();
            return Ok(formats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all book formats");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("book/{bookId}")]
    public async Task<ActionResult<IEnumerable<BookFormatDto>>> GetBookFormatsByBookId(int bookId)
    {
        try
        {
            var formats = await _bookService.GetBookFormatsByBookIdAsync(bookId);
            return Ok(formats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving book formats for book {BookId}", bookId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookFormatDto>> GetBookFormat(int id)
    {
        try
        {
            var format = await _bookService.GetBookFormatByIdAsync(id);
            if (format == null)
                return NotFound();

            return Ok(format);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving book format with ID {FormatId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

  
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookFormatDto>> CreateBookFormat(CreateBookFormatDto createBookFormatDto)
    {
        try
        {
            var format = await _bookService.CreateBookFormatAsync(createBookFormatDto);
            return CreatedAtAction(nameof(GetBookFormat), new { id = format.Id }, format);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating book format");
            return StatusCode(500, "Internal server error");
        }
    }

 
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<BookFormatDto>> UpdateBookFormat(int id, UpdateBookFormatDto updateBookFormatDto)
    {
        try
        {
            var format = await _bookService.UpdateBookFormatAsync(id, updateBookFormatDto);
            if (format == null)
                return NotFound();

            return Ok(format);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating book format with ID {FormatId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

  
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBookFormat(int id)
    {
        try
        {
            var result = await _bookService.DeleteBookFormatAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting book format with ID {FormatId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}