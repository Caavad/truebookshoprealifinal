import { BookCard } from "@/components/shared/book-card/book-card";
import { Book } from "@/helpers/interfaces/books";
import Link from "next/link";

export default async function ScienceFictionPage() {
    const API_HOST = process.env.NEXT_PUBLIC_API_HOST!;

  const response = await fetch(`${API_HOST}/api/books`);
  // const response = await fetch(`${process.env.API_HOST || 'http://localhost:7000'}/api/books/category/Fiction`, {
  //   cache: 'no-store'
  // });
  
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  
  const allBooks: Book[] = await response.json();
  const sciFiBooks: Book[] = allBooks; // Filtering by subcategory not yet supported by API

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="mb-8">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/docs" className="hover:text-white">All Books</Link>
          <span className="mx-2">/</span>
          <Link href="/docs/fiction" className="hover:text-white">Fiction</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Science Fiction</span>
        </nav>
        <h1 className="text-4xl font-bold mb-2">Science Fiction</h1>
        <p className="text-gray-400 text-lg">
          Explore futuristic worlds and speculative storytelling
        </p>
      </section>

      {/* Books Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Science Fiction Books</h2>
          <div className="text-sm text-gray-400">
            {sciFiBooks.length} books available
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sciFiBooks.map((book: Book) => (
            <Link key={book.id} href={book.path}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
