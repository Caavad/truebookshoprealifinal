export interface BookFormat {
  id: number;
  format: string; // Will be "Ebook", "Audiobook", "Paperback", "Hardcover"
  language: string;
  fileSizeMB?: number;
  pages?: number;
  price: number;
  coverUrl: string;
  stockCount: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  path: string;
  category: string;
  subcategory?: string;
  rating: number;
  quantity?: number; // Optional for compatibility
  stockCount: number;
  formats?: BookFormat[];
  createdAt?: string; // ISO string from API
  updatedAt?: string; // ISO string from API
}