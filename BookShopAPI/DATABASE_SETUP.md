# База данных BookShop - Настройка

## Обзор

База данных SQL для BookShopAPI настроена с использованием Entity Framework Core и SQL Server LocalDB.

## Структура базы данных

### Таблицы

#### 1. Users (Пользователи)
- Хранение учетных данных пользователей
- Электронная почта (уникальная)
- Имя пользователя (уникальное)
- Роли: Customer, Admin
- Хеши паролей

#### 2. Books (Книги)
- Каталог книг
- Название, автор, описание
- Категория, рейтинг
- Ссылка на обложку
- Количество на складе

#### 3. BookFormats (Форматы книг)
- Различные форматы для каждой книги:
  - Ebook (Электронная книга)
  - Audiobook (Аудиокнига)
  - Paperback (Мягкая обложка)
  - Hardcover (Твердая обложка)
- Цена для каждого формата
- Количество на складе
- Размер файла (для цифровых форматов)
- Количество страниц (для печатных форматов)

#### 4. Orders (Заказы)
- Информация о заказах
- Номер заказа (уникальный)
- Статус: Pending, Processing, Shipped, Delivered, Cancelled
- Адрес доставки и оплаты
- Метод оплаты
- Общая сумма
- Даты создания, отправки, доставки

#### 5. OrderItems (Позиции заказа)
- Товары в каждом заказе
- Количество
- Цена за единицу
- Общая цена позиции

#### 6. Reviews (Отзывы)
- Отзывы пользователей о книгах
- Рейтинг (1-5)
- Комментарий
- Один отзыв на пользователя для каждой книги

## Настройка базы данных

### Способ 1: Автоматическое создание (Рекомендуется)

При запуске приложения база данных будет создана автоматически:

```powershell
cd BookShopAPI
dotnet run
```

### Способ 2: Миграции Entity Framework

```powershell
# Создать миграцию
dotnet ef migrations add InitialCreate

# Применить миграцию
dotnet ef database update
```

### Способ 3: SQL Script

Запустите SQL скрипт вручную:

```powershell
# Используя sqlcmd
sqlcmd -S "(localdb)\mssqllocaldb" -i Migrations\001_InitialCreate.sql
```

## Подключение

### Строка подключения (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookShopDB;Trusted_Connection=true;TrustServerCertificate=true"
  }
}
```

### Проверка подключения

```sql
-- Подключитесь к SQL Server Management Studio
-- Server: (localdb)\mssqllocaldb
-- Database: BookShopDB

-- Проверьте существование таблиц
SELECT * FROM sys.tables;
```

## Индексы

### Users
- Email (уникальный)
- Username (уникальный)

### Books
- Title (поиск)
- Author (поиск)
- Category (поиск)
- Rating (поиск и сортировка)

### BookFormats
- BookId (связь с Books)

### Orders
- OrderNumber (уникальный)
- UserId (связь с Users)

### OrderItems
- OrderId (связь с Orders)
- BookId (связь с Books)

### Reviews
- UserId + BookId (уникальный составной ключ - один отзыв на книгу от пользователя)
- BookId (поиск)

## Связи между таблицами

```
Users (1) ──────────────── (M) Orders
                            (1) ── (M) OrderItems
                                    |
Users (1) ──────────────── (M) Reviews

Books (1) ──────────────── (M) BookFormats
Books (1) ──────────────── (M) OrderItems
Books (1) ──────────────── (M) Reviews
```

### Правила удаления

- **BookFormats → Books**: CASCADE (удаление книги удаляет форматы)
- **Orders → Users**: RESTRICT (нельзя удалить пользователя с заказами)
- **OrderItems → Orders**: CASCADE (удаление заказа удаляет позиции)
- **OrderItems → Books**: RESTRICT (нельзя удалить книгу из заказа)
- **Reviews → Users/Books**: CASCADE (удаление пользователя/книги удаляет отзывы)

## Заполнение тестовыми данными

После создания базы данных вы можете добавить тестовые данные через API или напрямую в SQL.

## Устранение неполадок

### Ошибка подключения

```
Cannot open database "BookShopDB"
```

**Решение**: Убедитесь, что SQL Server LocalDB запущен:
```powershell
sqllocaldb start mssqllocaldb
```

### Ошибка миграций

```
No project found
```

**Решение**: Запустите команду из папки BookShopAPI:
```powershell
cd BookShopAPI
dotnet ef migrations add InitialCreate
```

### Проверка базы данных

```powershell
# Посмотреть все базы данных
sqllocaldb info

# Информация о конкретной базе
sqllocaldb info mssqllocaldb
```

## Дополнительная информация

- См. `Migrations/README.md` для подробностей о миграциях
- Swagger UI доступен по адресу: `https://localhost:7000/swagger`
- API endpoints: `/api/books`, `/api/users`, `/api/auth`, `/api/orders`, `/api/reviews`
