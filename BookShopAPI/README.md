# BookShop API - ASP.NET Core Web API

Полнофункциональное REST API для системы управления книжным магазином, построенное на ASP.NET Core.

## 🚀 Возможности

- **JWT Аутентификация** - Безопасная аутентификация пользователей
- **Entity Framework Core** - ORM для работы с SQL Server
- **AutoMapper** - Автоматическое маппинг между моделями и DTO
- **FluentValidation** - Валидация входных данных
- **Serilog** - Структурированное логирование
- **Swagger/OpenAPI** - Автоматическая документация API

## 📋 Требования

- .NET 8.0 или выше
- SQL Server или SQL Server LocalDB
- Visual Studio 2022 / VS Code / Rider

## 🏗️ Структура проекта

```
BookShopAPI/
├── Controllers/        # API контроллеры
├── Models/            # Модели данных
├── DTOs/              # Data Transfer Objects
├── Services/          # Бизнес-логика
│   └── Interfaces/    # Интерфейсы сервисов
├── Data/              # DbContext
├── Mappings/          # AutoMapper профили
├── Validators/        # FluentValidation валидаторы
└── Program.cs         # Точка входа
```

## 🛠️ Установка и запуск

### 1. Клонирование проекта

```bash
cd BookShopAPI
```

### 2. Восстановление пакетов

```bash
dotnet restore
```

### 3. Настройка базы данных

Отредактируйте `appsettings.json` и настройте строку подключения:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookShopDB;Trusted_Connection=true;TrustServerCertificate=true"
  }
}
```

### 4. Создание миграций (опционально)

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 5. Запуск приложения

```bash
dotnet run
```

API будет доступен по адресу:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001` (в режиме разработки)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Вход пользователя
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/validate` - Проверка токена

### Books
- `GET /api/books` - Получить все книги
- `GET /api/books/{id}` - Получить книгу по ID
- `GET /api/books/category/{category}` - Получить книги по категории
- `GET /api/books/search?q={query}` - Поиск книг
- `GET /api/books/categories` - Получить все категории
- `POST /api/books` - Создать книгу (Admin)
- `PUT /api/books/{id}` - Обновить книгу (Admin)
- `DELETE /api/books/{id}` - Удалить книгу (Admin)

### Orders
- `GET /api/orders` - Получить все заказы (Admin)
- `GET /api/orders/my-orders` - Получить заказы текущего пользователя
- `GET /api/orders/{id}` - Получить заказ по ID
- `POST /api/orders` - Создать новый заказ
- `PUT /api/orders/{id}/status` - Обновить статус заказа (Admin)
- `DELETE /api/orders/{id}` - Удалить заказ (Admin)

### Reviews
- `GET /api/reviews/book/{bookId}` - Получить отзывы для книги
- `GET /api/reviews/{id}` - Получить отзыв по ID
- `POST /api/reviews` - Создать отзыв (требуется авторизация)
- `PUT /api/reviews/{id}` - Обновить отзыв (требуется авторизация)
- `DELETE /api/reviews/{id}` - Удалить отзыв (требуется авторизация)

## 🔐 Аутентификация

API использует JWT токены для аутентификации. После регистрации или входа, вы получите токен, который нужно включать в заголовок запросов:

```
Authorization: Bearer {ваш_токен}
```

## 🗃️ Модели данных

### User
- Email, Username, FirstName, LastName
- Password (хешируется с BCrypt)
- Role (Customer/Admin)

### Book
- Title, Author, Description
- Category, Rating, StockCount
- Formats (множественные форматы: Ebook, Audiobook, Paperback, Hardcover)

### Order
- OrderNumber, TotalAmount
- Status (Pending, Processing, Shipped, Delivered, Cancelled)
- OrderItems (связь с книгами)

### Review
- Rating (1-5 звезд)
- Comment
- Связь с пользователем и книгой

## ⚙️ Конфигурация

### JWT Settings (appsettings.json)

```json
{
  "JwtSettings": {
    "SecretKey": "ВашСуперСекретныйКлюч",
    "Issuer": "BookShopAPI",
    "Audience": "BookShopUsers",
    "ExpiryHours": "24"
  }
}
```

### CORS

По умолчанию разрешены запросы с `http://localhost:3000` (для фронтенда React/Next.js)

## 📝 Логи

Логи сохраняются в папку `logs/` с ротацией по дням.

## 🧪 Тестирование

Вы можете протестировать API используя:
- **Swagger UI** - доступен по корневому URL в режиме разработки
- **Postman** - импортируйте коллекцию из Swagger
- **curl** - примеры команд в документации

## 📦 Используемые пакеты

- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.AspNetCore.Authentication.JwtBearer
- BCrypt.Net-Next
- AutoMapper
- FluentValidation.AspNetCore
- Serilog.AspNetCore
- Swashbuckle.AspNetCore

## 🤝 Вклад

Проект создан как демонстрационное приложение для изучения ASP.NET Core Web API.

## 📄 Лицензия

MIT License

## 👥 Автор

BookShop Team

