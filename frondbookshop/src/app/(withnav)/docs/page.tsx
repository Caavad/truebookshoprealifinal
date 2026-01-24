//import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/shared/book-card/book-card";
import { Book } from "@/helpers/interfaces/books";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";

export default async function AllBooksPage() {
        const API_HOST = process.env.NEXT_PUBLIC_API_HOST!;

  const response = await fetch(`${API_HOST}/api/books`);
  // const response = await fetch(`${process.env.API_HOST || 'http://localhost:7000'}/api/books`, {
  //   cache: 'no-store'
  // });
  
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  
  const allBooks: Book[] = await response.json();

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Books</h1>
            <p className="text-gray-400 text-lg">
              Discover our complete collection of {allBooks.length} books
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from(new Set(allBooks.map(book => book.category))).map((category) => {
            const categoryBooks = allBooks.filter(book => book.category === category);
            return (
              <Link key={category} href={`/docs/${category.toLowerCase()}`}>
                <Card className="hover:bg-gray-800 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <CardDescription>
                      {categoryBooks.length} books available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>Explore</span>
                      <GoArrowRight className="ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Collection</h2>
          <div className="text-sm text-gray-400">
            Showing {allBooks.length} books
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allBooks.map((book: Book) => (
            <Link key={book.id} href={book.path}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
