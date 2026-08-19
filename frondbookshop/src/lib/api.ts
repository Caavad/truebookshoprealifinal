import { Book, Chapter } from "@/helpers/interfaces/books";
import { CategoryDto, SubCategoryDto } from "@/helpers/interfaces/categories";

export interface UserDto {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface OrderItemDto {
  id: number;
  bookId: number;
  bookTitle: string;
  bookFormat: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  id: number;
  orderNumber: string;
  userId: number;
  totalAmount: number;
  status: string;
  orderItems: OrderItemDto[];
}

export interface BookReadDto {
  id: number;
  title: string;
  author: string;
  content: string;
  chapters: Chapter[];
}

export interface ReadingBookmark {
  bookId: number;
  chapterId: number;
  chapterNumber: number;
}

export interface ReviewDto {
  id: number;
  userId: number;
  bookId: number;
  username: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChapterPayload {
  bookId: number;
  title: string;
  chapterNumber: number;
  content: string;
}

export type UpdateChapterPayload = Omit<CreateChapterPayload, "bookId">;

export interface CreateBookPayload {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  path: string;
  category: string;
  subCategory: string;
  content: string;
  rating: number;
  stockCount: number;
  formats: {
    format: string;
    language: string;
    price: number;
    coverUrl: string;
    stockCount: number;
    fileSizeMB?: number;
    pages?: number;
  }[];
}

export type UpdateBookPayload = Omit<CreateBookPayload, "formats">;

import { getApiBaseUrl } from "@/lib/api-config";

const API_BASE_URL = getApiBaseUrl();

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    books: `${API_BASE_URL}/api/books`,
    users: `${API_BASE_URL}/api/users`,
    auth: `${API_BASE_URL}/api/auth`,
    orders: `${API_BASE_URL}/api/orders`,
    chapters: `${API_BASE_URL}/api/chapters`,
    readingBookmarks: `${API_BASE_URL}/api/reading-bookmarks`,
    reviews: `${API_BASE_URL}/api/reviews`,
    library: `${API_BASE_URL}/api/library`,
    categories: `${API_BASE_URL}/api/categories`,
  },
};

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API call failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiCallAuth<T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  return apiCall<T>(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

export const booksApi = {
  getAll: () => apiCall<Book[]>(apiConfig.endpoints.books),
  getById: (id: number) => apiCall<Book>(`${apiConfig.endpoints.books}/${id}`),
  getRead: (id: number) =>
    apiCall<BookReadDto>(`${apiConfig.endpoints.books}/${id}/read`),
  getMyBooks: (token: string) =>
    apiCallAuth<Book[]>(`${apiConfig.endpoints.books}/my-books`, token),
  create: (token: string, book: CreateBookPayload) =>
    apiCallAuth<Book>(apiConfig.endpoints.books, token, {
      method: "POST",
      body: JSON.stringify(book),
    }),
  update: (token: string, id: number, book: UpdateBookPayload) =>
    apiCallAuth<Book>(`${apiConfig.endpoints.books}/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(book),
    }),
  delete: (token: string, id: number) =>
    apiCallAuth<void>(`${apiConfig.endpoints.books}/${id}`, token, {
      method: "DELETE",
    }),
};

export const usersApi = {
  getAll: (token: string) =>
    apiCallAuth<UserDto[]>(apiConfig.endpoints.users, token),
  delete: (token: string, id: number) =>
    apiCallAuth<void>(`${apiConfig.endpoints.users}/${id}`, token, {
      method: "DELETE",
    }),
  getOrders: (token: string, userId: number) =>
    apiCallAuth<OrderDto[]>(
      `${apiConfig.endpoints.users}/${userId}/orders`,
      token
    ),
};

export const chaptersApi = {
  getByBook: (bookId: number) =>
    apiCall<Chapter[]>(`${apiConfig.endpoints.chapters}/book/${bookId}`),
  create: (token: string, chapter: CreateChapterPayload) =>
    apiCallAuth<Chapter>(apiConfig.endpoints.chapters, token, {
      method: "POST",
      body: JSON.stringify(chapter),
    }),
  update: (token: string, id: number, chapter: UpdateChapterPayload) =>
    apiCallAuth<Chapter>(`${apiConfig.endpoints.chapters}/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(chapter),
    }),
  delete: (token: string, id: number) =>
    apiCallAuth<void>(`${apiConfig.endpoints.chapters}/${id}`, token, {
      method: "DELETE",
    }),
};

export const readingBookmarksApi = {
  get: (token: string, bookId: number) =>
    apiCallAuth<ReadingBookmark | null>(
      `${apiConfig.endpoints.readingBookmarks}/book/${bookId}`,
      token
    ),
  set: (token: string, bookId: number, chapterId: number) =>
    apiCallAuth<ReadingBookmark>(
      `${apiConfig.endpoints.readingBookmarks}/book/${bookId}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ chapterId }),
      }
    ),
};

export const reviewsApi = {
  getByBook: (bookId: number) =>
    apiCall<ReviewDto[]>(`${apiConfig.endpoints.reviews}/book/${bookId}`),
  create: (token: string, bookId: number, rating: number) =>
    apiCallAuth<ReviewDto>(apiConfig.endpoints.reviews, token, {
      method: "POST",
      body: JSON.stringify({ bookId, rating }),
    }),
  update: (token: string, reviewId: number, rating: number) =>
    apiCallAuth<ReviewDto>(`${apiConfig.endpoints.reviews}/${reviewId}`, token, {
      method: "PUT",
      body: JSON.stringify({ rating }),
    }),
};

export const libraryApi = {
  get: (token: string) => apiCallAuth<Book[]>(apiConfig.endpoints.library, token),
  add: (token: string, bookId: number) =>
    apiCallAuth<Book>(`${apiConfig.endpoints.library}/${bookId}`, token, { method: "POST" }),
};

export const categoriesApi = {
  getAll: () => apiCall<CategoryDto[]>(apiConfig.endpoints.categories),
  create: (token: string, payload: { name: string; description?: string }) =>
    apiCallAuth<CategoryDto>(apiConfig.endpoints.categories, token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createSub: (
    token: string,
    categoryId: number,
    payload: { name: string; description?: string }
  ) =>
    apiCallAuth<SubCategoryDto>(
      `${apiConfig.endpoints.categories}/${categoryId}/subcategories`,
      token,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    ),
};
