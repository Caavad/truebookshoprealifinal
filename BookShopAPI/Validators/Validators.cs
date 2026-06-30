using FluentValidation;

namespace BookShopAPI.Validators;

public class CreateUserDtoValidator : AbstractValidator<DTOs.CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required")
            .Length(3, 50).WithMessage("Username must be between 3 and 50 characters")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("Username can only contain letters, numbers, and underscores");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long")
            .MaximumLength(100).WithMessage("Password cannot exceed 100 characters");
    }
}

public class LoginDtoValidator : AbstractValidator<DTOs.LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}

public class CreateBookDtoValidator : AbstractValidator<DTOs.CreateBookDto>
{
    public CreateBookDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.Author)
            .NotEmpty().WithMessage("Author is required")
            .MaximumLength(100).WithMessage("Author cannot exceed 100 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(50).WithMessage("Category cannot exceed 50 characters");

        RuleFor(x => x.SubCategory)
            .MaximumLength(50).WithMessage("SubCategory cannot exceed 50 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.CoverUrl)
            .MaximumLength(500).WithMessage("Cover URL cannot exceed 500 characters");

        RuleFor(x => x.Path)
            .NotEmpty().WithMessage("Path is required")
            .MaximumLength(100).WithMessage("Path cannot exceed 100 characters");

        RuleFor(x => x.Rating)
            .InclusiveBetween(0, 5).WithMessage("Rating must be between 0 and 5");

        RuleFor(x => x.StockCount)
            .GreaterThanOrEqualTo(0).WithMessage("Stock count cannot be negative");

        RuleForEach(x => x.Formats)
            .SetValidator(new CreateBookFormatDtoValidator());
    }
}

public class CreateBookFormatDtoValidator : AbstractValidator<DTOs.CreateBookFormatDto>
{
    public CreateBookFormatDtoValidator()
    {
        RuleFor(x => x.Format)
            .NotEmpty().WithMessage("Format is required")
            .Must(format => Enum.TryParse<Models.BookFormatType>(format, true, out _))
            .WithMessage("Invalid format type");

        RuleFor(x => x.Language)
            .NotEmpty().WithMessage("Language is required")
            .MaximumLength(10).WithMessage("Language cannot exceed 10 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.CoverUrl)
            .MaximumLength(500).WithMessage("Cover URL cannot exceed 500 characters");

        RuleFor(x => x.StockCount)
            .GreaterThanOrEqualTo(0).WithMessage("Stock count cannot be negative");

        RuleFor(x => x.FileSizeMB)
            .GreaterThan(0).When(x => x.FileSizeMB.HasValue)
            .WithMessage("File size must be greater than 0");

        RuleFor(x => x.Pages)
            .GreaterThan(0).When(x => x.Pages.HasValue)
            .WithMessage("Pages must be greater than 0");
    }
}

public class CreateOrderDtoValidator : AbstractValidator<DTOs.CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        RuleFor(x => x.ShippingAddress)
            .NotEmpty().WithMessage("Shipping address is required")
            .MaximumLength(200).WithMessage("Shipping address cannot exceed 200 characters");

        RuleFor(x => x.BillingAddress)
            .NotEmpty().WithMessage("Billing address is required")
            .MaximumLength(200).WithMessage("Billing address cannot exceed 200 characters");

        RuleFor(x => x.PaymentMethod)
            .NotEmpty().WithMessage("Payment method is required")
            .MaximumLength(100).WithMessage("Payment method cannot exceed 100 characters");

        RuleFor(x => x.OrderItems)
            .NotEmpty().WithMessage("Order must contain at least one item");

        RuleForEach(x => x.OrderItems)
            .SetValidator(new CreateOrderItemDtoValidator());
    }
}

public class CreateOrderItemDtoValidator : AbstractValidator<DTOs.CreateOrderItemDto>
{
    public CreateOrderItemDtoValidator()
    {
        RuleFor(x => x.BookId)
            .GreaterThan(0).WithMessage("Book ID must be greater than 0");

        RuleFor(x => x.BookFormatId)
            .GreaterThan(0).WithMessage("Book format ID must be greater than 0");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0");
    }
}

public class CreateReviewDtoValidator : AbstractValidator<DTOs.CreateReviewDto>
{
    public CreateReviewDtoValidator()
    {
        RuleFor(x => x.BookId)
            .GreaterThan(0).WithMessage("Book ID must be greater than 0");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

        RuleFor(x => x.Comment)
            .MaximumLength(1000).WithMessage("Comment cannot exceed 1000 characters");
    }
}
