using Microsoft.AspNetCore.Mvc;

namespace BookShopAPI.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new ProblemDetails
        {
            Status = exception switch
{
    UnauthorizedAccessException => 401,
    InvalidOperationException => 400,
    ArgumentNullException => 400,
    ArgumentException => 400,
    _ => 500
},
Title = exception switch
{
    UnauthorizedAccessException => "Unauthorized",
    InvalidOperationException => "Bad Request",
    ArgumentNullException => "Bad Request",
    ArgumentException => "Bad Request",
    _ => "Internal Server Error"
},

            // Status = exception switch
            // {
            //     UnauthorizedAccessException => 401,
            //     InvalidOperationException => 400,
            //     ArgumentException => 400,
            //     ArgumentNullException => 400,
            //     _ => 500
            // },
            // Title = exception switch
            // {
            //     UnauthorizedAccessException => "Unauthorized",
            //     InvalidOperationException => "Bad Request",
            //     ArgumentException => "Bad Request",
            //     ArgumentNullException => "Bad Request",
            //     _ => "Internal Server Error"
            // },
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        context.Response.StatusCode = response.Status ?? 500;

        await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
    }
}
