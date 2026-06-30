-- Fix NULL values that crash Entity Framework string mapping
UPDATE Books SET SubCategory = '' WHERE SubCategory IS NULL;
UPDATE Books SET Content = '' WHERE Content IS NULL;
