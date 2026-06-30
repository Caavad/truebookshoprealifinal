# Database Migrations

## Overview
This folder contains SQL scripts for setting up the BookShop database schema.

## Initial Setup

### Option 1: Using Entity Framework Migrations (Recommended)
```powershell
# Navigate to BookShopAPI directory
cd BookShopAPI

# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update
```

### Option 2: Manual SQL Script
Run the SQL script `001_InitialCreate.sql` directly in SQL Server Management Studio or Azure Data Studio against your database.

## Database Connection
The connection string is configured in `appsettings.json`:
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookShopDB;Trusted_Connection=true;TrustServerCertificate=true"
```

## Tables Created
1. **Users** - User accounts and authentication
2. **Books** - Book catalog and inventory
3. **BookFormats** - Available formats for each book (Ebook, Audiobook, Paperback, Hardcover)
4. **Orders** - Customer orders
5. **OrderItems** - Items within each order
6. **Reviews** - User reviews and ratings

## Database Schema

### Users
- User authentication and profile information
- Unique constraints on Email and Username
- Roles: Customer, Admin

### Books
- Title, Author, Description
- Category classification
- Rating and stock count
- Full-text search indexes on Title, Author, Category, Rating

### BookFormats
- Foreign key to Books (Cascade delete)
- Format types: Ebook, Audiobook, Paperback, Hardcover
- Price, stock, and format-specific attributes (FileSize, Pages)

### Orders
- Order tracking and status
- Shipping and billing addresses
- Payment information
- Foreign key to Users (Restrict delete)

### OrderItems
- Line items for each order
- Foreign keys to Orders (Cascade), Books (Restrict), and BookFormats (Restrict)

### Reviews
- User reviews for books
- Rating (1-5) and optional comments
- Unique constraint: one review per user per book
- Foreign keys to Users and Books (Cascade delete)

