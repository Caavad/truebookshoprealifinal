# Инструкция по настройке BookShop Application

## Обзор изменений

Frontend теперь полностью использует данные из BookShopAPI вместо локального хранилища.

## Настройка окружения

### 1. Создайте файл `.env.local` в папке `frondbookshop/`

Создайте файл `frondbookshop/.env.local` со следующим содержимым:

```env
# API Configuration
API_HOST=http://localhost:5130
NEXT_PUBLIC_API_URL=http://localhost:5130
NEXT_PUBLIC_API_HOST=http://localhost:5130

# NextAuth Configuration (если нужно)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Google OAuth (опционально)
GOOGLE_ID=
GOOGLE_SECRET=

# GitHub OAuth (опционально)
GITHUB_ID=
GITHUB_SECRET=
```

## Учётная запись администратора

Админ создаётся автоматически при старте API из секции `AdminUser` конфигурации
(`appsettings.Development.json` или переменные окружения):

```
AdminUser__Email=admin@bookshop.com
AdminUser__Username=admin
AdminUser__Password=Admin123!
```

Если секция не задана, админ не создаётся. Пароль по умолчанию нужно сменить перед деплоем.

## Запуск приложения

### 1. Запуск BookShopAPI (Backend)

```bash
cd BookShopAPI
dotnet ef database update
dotnet run
```

API запустится на `http://localhost:5130`

### 2. Наполнение базы данных тестовыми данными (опционально)

Если база пустая, выполните SQL скрипт:

```bash
# В SQL Server Management Studio или через sqlcmd
sqlcmd -S "(localdb)\MSSQLLocalDB" -d BookShopDB -i Migrations/002_SeedBooks.sql
```

Или через PowerShell:

```powershell
sqlcmd -S "(localdb)\MSSQLLocalDB" -d BookShopDB -i Migrations\002_SeedBooks.sql
```

### 3. Запуск frondbookshop (Frontend)

В новом терминале:

```bash
cd frondbookshop
npm install
npm run dev
```

Frontend запустится на `http://localhost:3000`

## Проверка работы

1. Откройте http://localhost:3000 в браузере
2. Проверьте, что главная страница отображает книги из API
3. Попробуйте открыть страницу любой книги
4. Проверьте поиск и фильтрацию по категориям

## Важные изменения

### Backend (BookShopAPI)
- ✅ Исправлен AutoMapper для BookFormat (enum to string)
- ✅ Добавлен SQL скрипт для seed данных

### Frontend (frondbookshop)
- ✅ Интерфейс Book обновлён для соответствия API DTO (id: number вместо string)
- ✅ Все страницы используют API вместо локальных данных:
  - Главная страница (main.tsx)
  - Страница всех книг (/docs)
  - Категории (/docs/[category])
  - Детали книги (/docs/[category]/[href] и /books/[path])
  - Поиск
  - API routes (/api/books, /api/items, /api/docs/[category])

### Структура данных

API теперь возвращает:
- `id: number` (вместо string)
- `formats` с `format: string` ("Ebook", "Audiobook", "Paperback", "Hardcover" вместо enum)
- `createdAt` и `updatedAt` поля

## Устранение проблем

### Книги не отображаются

1. Проверьте, что BookShopAPI запущен на порту 5130
2. Проверьте, что база данных содержит книги (выполните seed скрипт)
3. Проверьте, что `.env.local` настроен правильно

### Ошибки подключения к API

1. Убедитесь, что `API_HOST=http://localhost:5130` в `.env.local`
2. Проверьте, что firewall не блокирует соединения
3. Проверьте консоль браузера на ошибки CORS

### Ошибки типов в TypeScript

Если видите ошибки типа "Type 'string' is not assignable to type 'number'":
1. Убедитесь, что интерфейс Book использует `id: number`
2. Перезапустите TypeScript сервер в IDE

## Дополнительная информация

- Документация BookShopAPI: `BookShopAPI/README.md`
- Быстрый старт: `BookShopAPI/QUICK_START.md`
- Диаграмма базы данных: `BookShopAPI/SQL_DATABASE_SUMMARY.md`

