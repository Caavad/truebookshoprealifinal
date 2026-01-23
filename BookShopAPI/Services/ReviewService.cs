using AutoMapper;
using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class ReviewService : IReviewService
{
    private readonly BookShopDbContext _context;
    private readonly IMapper _mapper;

    public ReviewService(BookShopDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ReviewDto>> GetAllReviewsAsync()
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }

    public async Task<IEnumerable<ReviewDto>> GetReviewsByBookIdAsync(int bookId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.BookId == bookId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }

    public async Task<IEnumerable<ReviewDto>> GetReviewsByUserIdAsync(int userId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
    }

    public async Task<ReviewDto?> GetReviewByIdAsync(int id)
    {
        var review = await _context.Reviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);
        
        return review != null ? _mapper.Map<ReviewDto>(review) : null;
    }

    public async Task<ReviewDto> CreateReviewAsync(int userId, CreateReviewDto createReviewDto)
    {
        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == createReviewDto.BookId);
        
        if (existingReview != null)
            throw new InvalidOperationException("User has already reviewed this book");

        var book = await _context.Books.FindAsync(createReviewDto.BookId);
        if (book == null)
            throw new InvalidOperationException("Book not found");

        var review = _mapper.Map<Review>(createReviewDto);
        review.UserId = userId;
        review.CreatedAt = DateTime.UtcNow;
        review.UpdatedAt = DateTime.UtcNow;

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        await UpdateBookRatingAsync(createReviewDto.BookId);

        return await GetReviewByIdAsync(review.Id) ?? throw new InvalidOperationException("Failed to retrieve created review");
    }

    public async Task<ReviewDto?> UpdateReviewAsync(int id, int userId, UpdateReviewDto updateReviewDto)
    {
        var review = await _context.Reviews
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        
        if (review == null) return null;

        _mapper.Map(updateReviewDto, review);
        review.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await UpdateBookRatingAsync(review.BookId);

        return await GetReviewByIdAsync(id);
    }

    public async Task<bool> DeleteReviewAsync(int id, int userId)
    {
        var review = await _context.Reviews
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        
        if (review == null) return false;

        var bookId = review.BookId;
        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        await UpdateBookRatingAsync(bookId);

        return true;
    }

    public async Task<bool> UserHasReviewedBookAsync(int userId, int bookId)
    {
        return await _context.Reviews
            .AnyAsync(r => r.UserId == userId && r.BookId == bookId);
    }

    private async Task UpdateBookRatingAsync(int bookId)
    {
        var averageRating = await _context.Reviews
            .Where(r => r.BookId == bookId)
            .AverageAsync(r => (decimal?)r.Rating) ?? 0;

        var book = await _context.Books.FindAsync(bookId);
        if (book != null)
        {
            book.Rating = Math.Round(averageRating, 1);
            book.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }
}

