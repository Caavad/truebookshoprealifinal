# 🚀 Быстрый старт - BookShop API

## Шаг 1: Проверка требований

Убедитесь, что установлены:
- ✅ .NET 8.0 SDK или выше
- ✅ SQL Server или SQL Server LocalDB

## Шаг 2: Настройка базы данных

### Вариант 1: SQL Server LocalDB (рекомендуется для разработки)

Строка подключения в `appsettings.json` уже настроена:
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookShopDB;Trusted_Connection=true;TrustServerCertificate=true"
```

### Вариант 2: SQL Server

Измените строку подключения в `appsettings.json`:
```json
"DefaultConnection": "Server=localhost;Database=BookShopDB;User Id=sa;Password=YourPassword;TrustServerCertificate=true"
```

## Шаг 3: Применение миграций

```bash
cd BookShopAPI
dotnet ef database update
```

Если нужно пересоздать миграции:
```bash
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## Шаг 4: Запуск API

```bash
dotnet run
```

API запустится на:
- 🌐 HTTP: http://localhost:5000
- 🔒 HTTPS: https://localhost:5001
- 📚 Swagger UI: https://localhost:5001

## Шаг 5: Тестирование API

### Через Swagger UI

1. Откройте https://localhost:5001 в браузере
2. Разверните раздел **Auth**
3. Выполните POST `/api/auth/register` для регистрации:
```json
{
  "email": "admin@bookshop.com",
  "username": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "password": "Admin123!"
}
```

4. Скопируйте полученный токен
5. Нажмите кнопку **Authorize** вверху страницы
6. Введите: `Bearer {ваш_токен}`
7. Теперь можете тестировать защищенные endpoints!

### Через Postman/curl

**Регистрация:**
```bash
curl -X POST https://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "password": "Test123!"
  }'
```

**Получение книг:**
```bash
curl https://localhost:5001/api/books
```

**Создание книги (требуется токен Admin):**
```bash
curl -X POST https://localhost:5001/api/books \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "description": "A Handbook of Agile Software Craftsmanship",
    "category": "Programming",
    "rating": 4.8,
    "stockCount": 50,
    "formats": [
      {
        "format": "Ebook",
        "language": "en",
        "price": 29.99,
        "stockCount": 50
      }
    ]
  }'
```

## Шаг 6: Создание админ-пользователя

По умолчанию все новые пользователи создаются с ролью "Customer". 
Для создания админа нужно:

1. Зарегистрировать пользователя через `/api/auth/register`
2. Вручную изменить роль в базе данных:

```sql
UPDATE Users 
SET Role = 1  -- 0 = Customer, 1 = Admin
WHERE Email = 'admin@bookshop.com'
```

Либо вы можете добавить seed data в `Program.cs` для автоматического создания админа при старте приложения.

## 📊 Структура базы данных

После применения миграций будут созданы таблицы:
- **Users** - Пользователи системы
- **Books** - Книги
- **BookFormats** - Форматы книг (Ebook, Audiobook, etc.)
- **Orders** - Заказы
- **OrderItems** - Элементы заказов
- **Reviews** - Отзывы на книги

## 🔧 Распространенные проблемы

### Ошибка подключения к базе данных

**Проблема:** Cannot connect to database

**Решение:**
1. Проверьте, запущен ли SQL Server
2. Проверьте строку подключения в `appsettings.json`
3. Убедитесь, что SQL Server LocalDB установлен

### Ошибка JWT

**Проблема:** Unauthorized 401

**Решение:**
1. Проверьте, что токен не истек (срок действия 24 часа)
2. Убедитесь, что токен передан в формате: `Bearer {token}`
3. Проверьте настройки JWT в `appsettings.json`

### Ошибка миграций

**Проблема:** Migration already applied

**Решение:**
```bash
dotnet ef database drop -f
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

## 📚 Дополнительные ресурсы

- [Swagger UI](https://localhost:5001) - Интерактивная документация API
- [README.md](README.md) - Полная документация проекта
- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core Docs](https://docs.microsoft.com/ef/core)

## 🎉 Готово!

Ваш BookShop API готов к использованию! 

Следующие шаги:
1. ✨ Создайте тестовые данные через Swagger UI
2. 🔌 Подключите фронтенд (React/Next.js)
3. 📈 Мониторьте логи в папке `logs/`

Удачи в разработке! 🚀

