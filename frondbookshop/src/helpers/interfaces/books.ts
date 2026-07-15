export interface BookFormat {
  id: number;
  format: string;
  language: string;
  fileSizeMB?: number;
  pages?: number;
  price: number;
  coverUrl: string;
  stockCount: number;
}

export interface Chapter {
  id: number;
  bookId: number;
  title: string;
  chapterNumber: number;
  content: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  path: string;
  category: string;
  subCategory?: string;
  content?: string;
  authorId?: number;
  chapters?: Chapter[];
  rating: number;
  quantity?: number;
  stockCount: number;
  formats?: BookFormat[];
  createdAt?: string;
  updatedAt?: string;
}
