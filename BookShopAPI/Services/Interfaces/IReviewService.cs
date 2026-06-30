using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetAllReviewsAsync();
    Task<ReviewDto?> GetReviewByIdAsync(int id);
    Task<IEnumerable<ReviewDto>> GetReviewsByBookIdAsync(int bookId);
    Task<IEnumerable<ReviewDto>> GetReviewsByUserIdAsync(int userId);
    Task<ReviewDto> CreateReviewAsync(int userId, CreateReviewDto createReviewDto);
    Task<ReviewDto?> UpdateReviewAsync(int id, int userId, UpdateReviewDto updateReviewDto);
    Task<bool> DeleteReviewAsync(int id, int userId);
    Task<bool> UserHasReviewedBookAsync(int userId, int bookId);
}

