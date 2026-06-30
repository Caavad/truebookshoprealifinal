import { BookCard } from "@/components/shared/book-card/book-card";
import { Book } from "@/helpers/interfaces/books";
import Link from "next/link";

export default async function HistoryPage() {
      const API_HOST = process.env.NEXT_PUBLIC_API_HOST!;

  const response = await fetch(`${API_HOST}/api/books`);
  // const response = await fetch(`${process.env.API_HOST || 'http://localhost:7000'}/api/books/category/History`, {
  //   cache: 'no-store'
  // });
  
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  
  const historyBooks: Book[] = await response.json();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold mb-2">History Books</h1>
        <p className="text-gray-400 text-lg">
          Explore the past and understand how it shapes our present
        </p>
      </section>

      {/* Subcategories */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Browse by Topic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from(new Set(historyBooks.map(book => book.subcategory).filter(Boolean))).map((subcategory) => {
            const subcategoryBooks = historyBooks.filter(book => book.subcategory === subcategory);
            return (
              <Link key={subcategory} href={`/docs/history/${subcategory?.toLowerCase().replace(' ', '-')}`}>
                <div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-lg mb-2">{subcategory}</h3>
                  <p className="text-gray-400 text-sm">{subcategoryBooks.length} books</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Books Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">All History Books</h2>
          <div className="text-sm text-gray-400">
            {historyBooks.length} books available
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {historyBooks.map((book: Book) => (
            <Link key={book.id} href={book.path}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
