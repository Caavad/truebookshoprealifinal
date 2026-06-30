using BookShopAPI.DTOs;

namespace BookShopAPI.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<AuthResponseDto> RegisterAsync(CreateUserDto createUserDto);
    string GenerateJwtToken(UserDto user);
    Task<bool> ValidateTokenAsync(string token);
}

