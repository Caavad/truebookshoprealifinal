using AutoMapper;
using BookShopAPI.Models;
using BookShopAPI.DTOs;

namespace BookShopAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>().ReverseMap();
            
            // Book mappings
            CreateMap<Book, BookDto>()
                .ForMember(dest => dest.Formats, opt => opt.MapFrom(src => src.Formats));
            
            // BookFormat mappings
            CreateMap<BookFormat, BookFormatDto>()
                .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()));
            
            CreateMap<CreateBookFormatDto, BookFormat>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.BookId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Book, opt => opt.Ignore())
                .ForMember(dest => dest.Format, opt => opt.MapFrom(src => Enum.Parse<BookFormatType>(src.Format, true)));
            
            // Order mappings
            CreateMap<Order, OrderDto>().ReverseMap();
            
            // Review mappings
            CreateMap<Review, ReviewDto>().ReverseMap();
        }
    }
}

// using AutoMapper;
// using BookShopAPI.DTOs;
// using BookShopAPI.Models;

// namespace BookShopAPI.Mappings;

// public class MappingProfile : Profile
// {
//     public MappingProfile()
//     {
//         // Book mappings
//         CreateMap<Book, BookDto>()
//             .ForMember(dest => dest.Formats, opt => opt.MapFrom(src => src.Formats));
        
//         CreateMap<BookFormat, BookFormatDto>()
//             .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()));
        
//         CreateMap<CreateBookDto, Book>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.Formats, opt => opt.Ignore())
//             .ForMember(dest => dest.OrderItems, opt => opt.Ignore())
//             .ForMember(dest => dest.Reviews, opt => opt.Ignore());
        
//         CreateMap<CreateBookFormatDto, BookFormat>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.BookId, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.Book, opt => opt.Ignore())
//             .ForMember(dest => dest.Format, opt => opt.MapFrom(src => Enum.Parse<BookFormatType>(src.Format, true)));
        
//         CreateMap<UpdateBookDto, Book>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.Formats, opt => opt.Ignore())
//             .ForMember(dest => dest.OrderItems, opt => opt.Ignore())
//             .ForMember(dest => dest.Reviews, opt => opt.Ignore());

//         // User mappings
//         CreateMap<User, UserDto>()
//             .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));
        
//         CreateMap<CreateUserDto, User>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
//             .ForMember(dest => dest.Role, opt => opt.Ignore())
//             .ForMember(dest => dest.IsActive, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
//             .ForMember(dest => dest.Orders, opt => opt.Ignore())
//             .ForMember(dest => dest.Reviews, opt => opt.Ignore());
        
//         CreateMap<UpdateUserDto, User>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
//             .ForMember(dest => dest.Role, opt => opt.Ignore())
//             .ForMember(dest => dest.IsActive, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
//             .ForMember(dest => dest.Orders, opt => opt.Ignore())
//             .ForMember(dest => dest.Reviews, opt => opt.Ignore());

//         // Order mappings
//         CreateMap<Order, OrderDto>()
//             .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
//             .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems));
        
//         CreateMap<OrderItem, OrderItemDto>()
//             .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Book.Title))
//             .ForMember(dest => dest.BookFormat, opt => opt.MapFrom(src => src.BookFormat.Format.ToString()));
        
//         CreateMap<CreateOrderDto, Order>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.OrderNumber, opt => opt.Ignore())
//             .ForMember(dest => dest.UserId, opt => opt.Ignore())
//             .ForMember(dest => dest.TotalAmount, opt => opt.Ignore())
//             .ForMember(dest => dest.Status, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.ShippedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.DeliveredAt, opt => opt.Ignore())
//             .ForMember(dest => dest.User, opt => opt.Ignore())
//             .ForMember(dest => dest.OrderItems, opt => opt.Ignore());
        
//         CreateMap<CreateOrderItemDto, OrderItem>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.OrderId, opt => opt.Ignore())
//             .ForMember(dest => dest.UnitPrice, opt => opt.Ignore())
//             .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.Order, opt => opt.Ignore())
//             .ForMember(dest => dest.Book, opt => opt.Ignore())
//             .ForMember(dest => dest.BookFormat, opt => opt.Ignore());

//         // Review mappings
//         CreateMap<Review, ReviewDto>()
//             .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username));
        
//         CreateMap<CreateReviewDto, Review>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.UserId, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.User, opt => opt.Ignore())
//             .ForMember(dest => dest.Book, opt => opt.Ignore());
        
//         CreateMap<UpdateReviewDto, Review>()
//             .ForMember(dest => dest.Id, opt => opt.Ignore())
//             .ForMember(dest => dest.UserId, opt => opt.Ignore())
//             .ForMember(dest => dest.BookId, opt => opt.Ignore())
//             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
//             .ForMember(dest => dest.User, opt => opt.Ignore())
//             .ForMember(dest => dest.Book, opt => opt.Ignore());
//     }
// }

