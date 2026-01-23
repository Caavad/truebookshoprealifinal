# База данных SQL для BookShopAPI - Сводка

## ✅ Что было сделано

### 1. Настройка Entity Framework Core
- ✅ Обновлен `BookShopDbContext.cs` с полной конфигурацией модели
- ✅ Добавлены все связи между таблицами
- ✅ Настроены индексы для оптимизации поиска
- ✅ Установлены правила удаления (CASCADE/RESTRICT)

### 2. Создана структура SQL базы данных

#### Таблицы
1. **Users** - пользователи системы
2. **Books** - каталог книг
3. **BookFormats** - форматы книг (Ebook, Audiobook, Paperback, Hardcover)
4. **Orders** - заказы
5. **OrderItems** - позиции в заказе
6. **Reviews** - отзывы пользователей

#### Индексы
- Email и Username - уникальные для Users
- Title, Author, Category, Rating - для Books
- OrderNumber - уникальный для Orders
- UserId + BookId - уникальный составной для Reviews

### 3. Автоматическое создание базы данных
- ✅ Обновлен `Program.cs` для автоматического создания базы при запуске
- ✅ Используется `EnsureCreated()` для инициализации схемы

### 4. Документация и скрипты
- ✅ Создан SQL скрипт `Migrations/001_InitialCreate.sql`
- ✅ Создан README в папке Migrations
- ✅ Создан скрипт инициализации `init-database.ps1`
- ✅ Создана полная документация `DATABASE_SETUP.md`

## 📋 Структура файлов

```
BookShopAPI/
├── Data/
│   └── BookShopDbContext.cs          ✅ Обновлен с полной конфигурацией
├── Models/
│   ├── User.cs                      ✅ Уже существовал
│   ├── Book.cs                      ✅ Уже существовал
│   ├── BookFormat.cs                ✅ Уже существовал
│   ├── Order.cs                     ✅ Уже существовал
│   ├── OrderItem.cs                 ✅ Уже существовал
│   └── Review.cs                    ✅ Уже существовал
├── Migrations/
│   ├── 001_InitialCreate.sql        ✅ Создан SQL скрипт
│   └── README.md                    ✅ Создана документация
├── Program.cs                       ✅ Обновлен для авто-создания БД
├── appsettings.json                 ✅ Уже настроен
├── DATABASE_SETUP.md               ✅ Полная документация на русском
├── SQL_DATABASE_SUMMARY.md         ✅ Этот файл
└── init-database.ps1               ✅ Скрипт инициализации
```

## 🚀 Как использовать

### Вариант 1: Простой запуск (Рекомендуется)

Просто запустите API - база создастся автоматически:

```powershell
cd BookShopAPI
dotnet run
```

### Вариант 2: Через скрипт инициализации

```powershell
cd BookShopAPI
.\init-database.ps1
dotnet run
```

### Вариант 3: Через миграции Entity Framework

```powershell
cd BookShopAPI
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Вариант 4: Ручной SQL скрипт

```powershell
sqlcmd -S "(localdb)\mssqllocaldb" -i Migrations\001_InitialCreate.sql
```

## 🔗 Связи между таблицами

```
Users (1) ════════════════════ (M) Orders (M) ═══════════ OrderItems
                                       │
Users (1) ════════════════════ (M) Reviews

Books (1) ════════════════════ (M) BookFormats
Books (1) ════════════════════ (M) OrderItems
Books (1) ════════════════════ (M) Reviews
```

## 📊 Основные таблицы

### Users
- Id, Email (unique), Username (unique)
- FirstName, LastName, PasswordHash
- Role (Customer/Admin)
- IsActive, CreatedAt, UpdatedAt, LastLoginAt

### Books
- Id, Title, Author, Description
- Category, Rating, StockCount
- CoverUrl, Path
- CreatedAt, UpdatedAt

### BookFormats
- Id, Format (Ebook/Audiobook/Paperback/Hardcover)
- Language, Price, StockCount
- CoverUrl, FileSizeMB, Pages
- BookId → Books (CASCADE)

### Orders
- Id, OrderNumber (unique)
- UserId → Users (RESTRICT)
- TotalAmount, Status
- ShippingAddress, BillingAddress, PaymentMethod
- CreatedAt, UpdatedAt, ShippedAt, DeliveredAt

### OrderItems
- Id, OrderId → Orders (CASCADE)
- BookId → Books (RESTRICT)
- BookFormatId → BookFormats (RESTRICT)
- Quantity, UnitPrice, TotalPrice

### Reviews
- Id, UserId → Users (CASCADE)
- BookId → Books (CASCADE)
- Rating (1-5), Comment
- Unique: UserId + BookId

## 📝 Настройки подключения

В `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookShopDB;Trusted_Connection=true;TrustServerCertificate=true"
  }
}
```

## ✅ Готово к использованию

База данных полностью настроена и готова к использованию. Все таблицы будут автоматически созданы при первом запуске приложения.

### Проверка работоспособности

1. Запустите API: `dotnet run`
2. Откройте Swagger: `https://localhost:7000/swagger`
3. Проверьте доступность endpoints:
   - `/api/books`
   - `/api/users`
   - `/api/auth`
   - `/api/orders`
   - `/api/reviews`

## 🔧 Дополнительная информация

- См. `DATABASE_SETUP.md` для полной документации на русском
- См. `Migrations/README.md` для информации о миграциях
- SQL скрипт: `Migrations/001_InitialCreate.sql`

---

**База данных успешно создана! 🎉**

