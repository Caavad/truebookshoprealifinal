import { Book } from "@/helpers/interfaces/books";
import { getApiCandidates } from "@/lib/api-config";

type FetchBooksResult = {
  books: Book[];
  error?: string;
};

export async function fetchBooks(): Promise<FetchBooksResult> {
  for (const baseUrl of getApiCandidates()) {
    try {
      const response = await fetch(`${baseUrl}/api/books`, {
        cache: "no-store",
      });

      if (response.ok) {
        const books: Book[] = await response.json();
        return { books };
      }
    } catch {
      // Try the next configured API URL.
    }
  }

  return {
    books: [],
    error:
      "Cannot connect to the API. Start the backend from the project root: npm run dev:api",
  };
}
