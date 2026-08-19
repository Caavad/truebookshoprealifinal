IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Categories')
BEGIN
    CREATE TABLE Categories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL,
        Slug NVARCHAR(80) NOT NULL,
        DisplayName NVARCHAR(80) NOT NULL CONSTRAINT DF_Categories_DisplayName DEFAULT '',
        Description NVARCHAR(300) NOT NULL CONSTRAINT DF_Categories_Description DEFAULT '',
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Categories_CreatedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE UNIQUE INDEX IX_Categories_Slug ON Categories(Slug);
    CREATE UNIQUE INDEX IX_Categories_Name ON Categories(Name);
END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SubCategories')
BEGIN
    CREATE TABLE SubCategories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CategoryId INT NOT NULL,
        Name NVARCHAR(50) NOT NULL,
        Slug NVARCHAR(80) NOT NULL,
        DisplayName NVARCHAR(80) NOT NULL CONSTRAINT DF_SubCategories_DisplayName DEFAULT '',
        Description NVARCHAR(300) NOT NULL CONSTRAINT DF_SubCategories_Description DEFAULT '',
        CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_SubCategories_CreatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_SubCategories_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX IX_SubCategories_Category_Slug ON SubCategories(CategoryId, Slug);
    CREATE UNIQUE INDEX IX_SubCategories_Category_Name ON SubCategories(CategoryId, Name);
END
