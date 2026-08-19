import { Book } from "@/helpers/interfaces/books";
import { CategoryDto } from "@/helpers/interfaces/categories";
import { getApiCandidates } from "@/lib/api-config";
import { matchesGenre } from "@/lib/book-categories";

export type FetchBooksResult = {
  books: Book[];
  error?: string;
};

const API_UNAVAILABLE_MESSAGE =
  "API is not running. Start it with: npm run dev:api (or npm run dev from the project root).";

async function tryFetchBooksOnce(): Promise<Book[] | null> {
  for (const baseUrl of getApiCandidates()) {
    try {
      const response = await fetch(`${baseUrl}/api/books`, {
        cache: "no-store",
      });

      if (response.ok) {
        return (await response.json()) as Book[];
      }
    } catch {
      // Try the next configured API URL.
    }
  }

  return null;
}

/** Fetches books with short retries so pages survive API cold-start. */
export async function fetchBooks(retries = 4, delayMs = 800): Promise<FetchBooksResult> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const books = await tryFetchBooksOnce();
    if (books) {
      return { books };
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return {
    books: [],
    error: API_UNAVAILABLE_MESSAGE,
  };
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  for (const baseUrl of getApiCandidates()) {
    try {
      const response = await fetch(`${baseUrl}/api/categories`, {
        cache: "no-store",
      });
      if (response.ok) {
        return (await response.json()) as CategoryDto[];
      }
    } catch {
      // Try the next configured API URL.
    }
  }

  return [];
}

export function filterByCategory(books: Book[], category: string): Book[] {
  return books.filter((book) => matchesGenre(book.category, category));
}

export function filterBySubCategory(books: Book[], subCategory: string): Book[] {
  return books.filter((book) =>
    matchesGenre(book.subCategory || "", subCategory)
  );
}
