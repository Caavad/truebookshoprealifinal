# 🎯 НАЧНИТЕ ЗДЕСЬ - BookShop API

## 🚀 Быстрый запуск (3 команды)

```bash
# 1. Перейдите в папку проекта
cd BookShopAPI

# 2. Примените миграции базы данных
dotnet ef database update

# 3. Запустите приложение
dotnet run
```

## 🌐 Откройте в браузере

После запуска откройте:
**https://localhost:5001**

Вы увидите Swagger UI - интерактивную документацию API!

## ✨ Первые шаги

### 1. Зарегистрируйтесь

В Swagger UI найдите раздел **Auth** → **POST /api/auth/register**

Нажмите "Try it out" и используйте:
```json
{
  "email": "admin@test.com",
  "username": "admin",
  "firstName": "Admin",
  "lastName": "User",
  "password": "Admin123!"
}
```

### 2. Скопируйте токен

Из ответа скопируйте значение поля `token`

### 3. Авторизуйтесь в Swagger

1. Нажмите кнопку **Authorize** (замочек) вверху страницы
2. Введите: `Bearer {ваш_токен}`
3. Нажмите **Authorize**

### 4. Протестируйте API

Теперь можете тестировать все эндпоинты! Попробуйте:
- **GET /api/books** - получить все книги
- **POST /api/books** - создать новую книгу (нужна роль Admin)
- **POST /api/orders** - создать заказ

## 📚 Документация

- **README.md** - Полная документация
- **QUICK_START.md** - Подробная инструкция по запуску
- **PROJECT_SUMMARY.md** - Обзор всего проекта

## ❓ Проблемы?

### База данных не подключается?

Проверьте `appsettings.json` - строка подключения:
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookShopDB;Trusted_Connection=true;TrustServerCertificate=true"
```

Если не работает, попробуйте:
```bash
dotnet ef database drop -f
dotnet ef database update
```

### Нужна помощь?

1. Проверьте логи в папке `logs/`
2. Прочитайте QUICK_START.md
3. Посмотрите ошибки в консоли

## 🎉 Готово!

Всё работает? Отлично! 

**Что дальше?**
- 🔌 Подключите фронтенд
- 📊 Добавьте тестовые данные
- 🛠️ Настройте под свои нужды

**Приятной разработки!** 🚀

---

💡 **Совет**: Откройте сразу 3 файла:
1. START_HERE.md (этот файл) - быстрый старт
2. QUICK_START.md - подробная инструкция
3. README.md - полная документация

