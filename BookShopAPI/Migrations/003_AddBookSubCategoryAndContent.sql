-- Add SubCategory and Content columns to Books table
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Books') AND name = 'SubCategory')
BEGIN
    ALTER TABLE Books ADD SubCategory NVARCHAR(50) NOT NULL DEFAULT '';
    PRINT 'SubCategory column added.';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Books') AND name = 'Content')
BEGIN
    ALTER TABLE Books ADD Content NVARCHAR(MAX) NOT NULL DEFAULT '';
    PRINT 'Content column added.';
END
