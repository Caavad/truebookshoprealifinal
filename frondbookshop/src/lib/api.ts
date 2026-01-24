import { BookDto, LoginDto, RegisterDto } from "@/typs/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    books: `${API_BASE_URL}/api/books`,
    users: `${API_BASE_URL}/api/users`,
    auth: `${API_BASE_URL}/api/auth`,
    orders: `${API_BASE_URL}/api/orders`,
    reviews: `${API_BASE_URL}/api/reviews`,
    bookFormats: `${API_BASE_URL}/api/bookformats`,
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
    throw new Error(
      `API call failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export const booksApi = {
  getAll: () => apiCall<BookDto[]>(apiConfig.endpoints.books),

  getById: (id: string) =>
    apiCall<BookDto>(`${apiConfig.endpoints.books}/${id}`),

  create: (book: BookDto) =>
    apiCall<BookDto>(apiConfig.endpoints.books, {
      method: "POST",
      body: JSON.stringify(book),
    }),

  update: (id: string, book: BookDto) =>
    apiCall<BookDto>(`${apiConfig.endpoints.books}/${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    }),

  delete: (id: string) =>
    apiCall<void>(`${apiConfig.endpoints.books}/${id}`, {
      method: "DELETE",
    }),
};

export const authApi = {
  login: (credentials: LoginDto) =>
    apiCall<{ token: string }>(
      `${apiConfig.endpoints.auth}/login`,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      }
    ),

  register: (userData: RegisterDto) =>
    apiCall<void>(`${apiConfig.endpoints.auth}/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

// // API configuration for connecting to backend
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7000';

// export const apiConfig = {
//     baseUrl: API_BASE_URL,
//     endpoints: {
//         books: `${API_BASE_URL}/api/books`,
//         users: `${API_BASE_URL}/api/users`,
//         auth: `${API_BASE_URL}/api/auth`,
//         orders: `${API_BASE_URL}/api/orders`,
//         reviews: `${API_BASE_URL}/api/reviews`,
//         bookFormats: `${API_BASE_URL}/api/bookformats`,
//     }
// };

// // Helper function to make API calls
// export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
//     const response = await fetch(endpoint, {
//         headers: {
//             'Content-Type': 'application/json',
//             ...options?.headers,
//         },
//         ...options,
//     });

//     if (!response.ok) {
//         throw new Error(`API call failed: ${response.status} ${response.statusText}`);
//     }

//     return response.json();
// }

// // Specific API functions
// export const booksApi = {
//     getAll: () => apiCall(apiConfig.endpoints.books),
//     getById: (id: string) => apiCall(`${apiConfig.endpoints.books}/${id}`),
//     create: (book: any) => apiCall(apiConfig.endpoints.books, {
//         method: 'POST',
//         body: JSON.stringify(book),
//     }),
//     update: (id: string, book: any) => apiCall(`${apiConfig.endpoints.books}/${id}`, {
//         method: 'PUT',
//         body: JSON.stringify(book),
//     }),
//     delete: (id: string) => apiCall(`${apiConfig.endpoints.books}/${id}`, {
//         method: 'DELETE',
//     }),
// };

// export const authApi = {
//     login: (credentials: { email: string; password: string }) => 
//         apiCall(`${apiConfig.endpoints.auth}/login`, {
//             method: 'POST',
//             body: JSON.stringify(credentials),
//         }),
//     register: (userData: any) => 
//         apiCall(`${apiConfig.endpoints.auth}/register`, {
//             method: 'POST',
//             body: JSON.stringify(userData),
//         }),
// };