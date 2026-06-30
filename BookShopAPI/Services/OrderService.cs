using AutoMapper;
using BookShopAPI.Data;
using BookShopAPI.DTOs;
using BookShopAPI.Models;
using BookShopAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookShopAPI.Services;

public class OrderService : IOrderService
{
    private readonly BookShopDbContext _context;
    private readonly IMapper _mapper;

    public OrderService(BookShopDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.BookFormat)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByUserIdAsync(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.BookFormat)
            .Where(o => o.UserId == userId)
            .ToListAsync();
        
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Book)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.BookFormat)
            .FirstOrDefaultAsync(o => o.Id == id);
        
        return order != null ? _mapper.Map<OrderDto>(order) : null;
    }

    public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";

        var order = _mapper.Map<Order>(createOrderDto);
        order.UserId = userId;
        order.OrderNumber = orderNumber;
        order.Status = OrderStatus.Pending;
        order.CreatedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        decimal totalAmount = 0;
        foreach (var itemDto in createOrderDto.OrderItems)
        {
            var bookFormat = await _context.BookFormats
                .Include(bf => bf.Book)
                .FirstOrDefaultAsync(bf => bf.Id == itemDto.BookFormatId && bf.BookId == itemDto.BookId);
            
            if (bookFormat == null)
                throw new InvalidOperationException($"Book format not found for book {itemDto.BookId}");

            if (bookFormat.StockCount < itemDto.Quantity)
                throw new InvalidOperationException($"Insufficient stock for {bookFormat.Book.Title}");

            var orderItem = _mapper.Map<OrderItem>(itemDto);
            orderItem.OrderId = order.Id;
            orderItem.UnitPrice = bookFormat.Price;
            orderItem.TotalPrice = bookFormat.Price * itemDto.Quantity;
            orderItem.CreatedAt = DateTime.UtcNow;

            totalAmount += orderItem.TotalPrice;

            _context.OrderItems.Add(orderItem);

            bookFormat.StockCount -= itemDto.Quantity;
            bookFormat.UpdatedAt = DateTime.UtcNow;
        }

        order.TotalAmount = totalAmount;
        await _context.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id) ?? throw new InvalidOperationException("Failed to retrieve created order");
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(int id, UpdateOrderStatusDto updateOrderStatusDto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return null;

        if (Enum.TryParse<OrderStatus>(updateOrderStatusDto.Status, true, out var newStatus))
        {
            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            if (newStatus == OrderStatus.Shipped)
                order.ShippedAt = DateTime.UtcNow;
            else if (newStatus == OrderStatus.Delivered)
                order.DeliveredAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        return await GetOrderByIdAsync(id);
    }

    public async Task<bool> DeleteOrderAsync(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return true;
    }
}

