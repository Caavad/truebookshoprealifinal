# BookShop Full-Stack Application

Полнофункциональное приложение книжного магазина, состоящее из ASP.NET Core API и Next.js фронтенда.

## 🏗️ Архитектура

- **Backend**: ASP.NET Core Web API (BookShopAPI)
- **Frontend**: Next.js с TypeScript (frondbookshop)
- **Database**: SQL Server LocalDB

## 🚀 Быстрый старт

### Вариант 1: Использование npm scripts (рекомендуется)

1. **Установите зависимости:**
   ```bash
   npm install
   npm run install:all
   ```

2. **Запустите оба сервиса одновременно:**
   ```bash
   npm run dev
   ```

### Вариант 2: Использование скриптов

**Для Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

**Для Linux/Mac:**
```bash
./start-dev.sh
```

### Вариант 3: Ручной запуск

1. **Запустите API:**
   ```bash
   cd BookShopAPI
   dotnet run --urls=https://localhost:7000
   ```

2. **В новом терминале запустите фронтенд:**
   ```bash
   cd frondbookshop
   npm run dev
   ```

## 🌐 Доступные URL

- **Frontend**: http://localhost:3000
- **API**: https://localhost:7000
- **API Documentation (Swagger)**: https://localhost:7000/swagger

## 📁 Структура проекта

```
BookShopAll/
├── BookShopAPI/          # ASP.NET Core API
│   ├── Controllers/      # API контроллеры
│   ├── Services/        # Бизнес-логика
│   ├── Models/          # Модели данных
│   └── Data/            # DbContext
├── frondbookshop/       # Next.js Frontend
│   ├── src/
│   │   ├── app/         # App Router страницы
│   │   ├── components/  # React компоненты
│   │   └── lib/         # Утилиты и API клиент
│   └── public/          # Статические файлы
├── start-dev.ps1        # PowerShell скрипт запуска
├── start-dev.sh         # Bash скрипт запуска
└── package.json         # Корневой package.json
```

## 🔧 Настройка

### Переменные окружения

Создайте файл `.env.local` в папке `frondbookshop/`:

```env
NEXT_PUBLIC_API_URL=https://localhost:7000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### База данных

API использует SQL Server LocalDB. Убедитесь, что у вас установлен SQL Server LocalDB.

## 📝 Доступные команды

- `npm run dev` - Запуск обеих частей приложения
- `npm run dev:api` - Запуск только API
- `npm run dev:frontend` - Запуск только фронтенда
- `npm run build` - Сборка обеих частей
- `npm run clean` - Очистка сборки

## 🛠️ Разработка

### API (ASP.NET Core)
- Порт: 7000 (HTTPS)
- Swagger UI доступен по адресу `/swagger`
- CORS настроен для работы с фронтендом

### Frontend (Next.js)
- Порт: 3000
- Hot reload включен
- TypeScript поддержка

## 🔍 Отладка

1. **API**: Используйте Visual Studio или VS Code с C# расширением
2. **Frontend**: Используйте браузерные инструменты разработчика
3. **Network**: Проверьте CORS настройки если возникают проблемы с запросами

## 📚 Дополнительная информация

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
