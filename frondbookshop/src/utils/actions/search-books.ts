import { Book } from "@/helpers/interfaces/books"

export async function searchBooks(query: string): Promise<Book[]> {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:5130';
    const response = await fetch(`${apiHost}/api/books/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
        throw new Error("Failed to fetch search books")
    }

    return response.json()
}