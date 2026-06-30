import { Book } from "@/helpers/interfaces/books";

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
}

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    books: `${API_BASE_URL}/api/books`,
    users: `${API_BASE_URL}/api/users`,
    auth: `${API_BASE_URL}/api/auth`,
    orders: `${API_BASE_URL}/api/orders`,
  },
};

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
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
