using BookShopAPI.DTOs;
using BookShopAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookShopAPI.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        return Ok(await _categoryService.GetAllAsync());
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Author")]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto dto)
    {
        try
        {
            var category = await _categoryService.CreateCategoryAsync(dto);
            return Ok(category);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("{categoryId:int}/subcategories")]
    [Authorize(Roles = "Admin,Author")]
    public async Task<ActionResult<SubCategoryDto>> CreateSubCategory(int categoryId, [FromBody] CreateSubCategoryDto dto)
    {
        try
        {
            var sub = await _categoryService.CreateSubCategoryAsync(categoryId, dto);
            return Ok(sub);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
