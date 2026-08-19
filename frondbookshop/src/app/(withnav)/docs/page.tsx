import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/shared/book-card/book-card";
import { ApiUnavailable } from "@/components/shared/api-unavailable";
import { fetchBooks, fetchCategories } from "@/lib/fetch-books";
import { slugify } from "@/lib/book-categories";
import { withFallbackCategories } from "@/lib/categories";
import { GoArrowRight } from "react-icons/go";
import Link from "next/link";

export default async function AllBooksPage() {
  const [{ books: allBooks, error }, catalog] = await Promise.all([
    fetchBooks(),
    fetchCategories(),
  ]);
  const categories = withFallbackCategories(catalog);

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

      {error && (
        <section className="mb-8">
          <ApiUnavailable message={error} />
        </section>
      )}

      {!error && (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const categoryBooks = allBooks.filter(
                  (book) =>
                    book.category.toLowerCase() === category.name.toLowerCase() ||
                    slugify(book.category) === category.slug
                );
                const href = `/docs/${category.slug || slugify(category.name)}`;
                return (
                  <Link key={category.id} href={href}>
                    <Card className="hover:bg-gray-800 transition-colors cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {category.displayName || category.name}
                        </CardTitle>
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
              {allBooks.map((book) => (
                <Link key={book.id} href={book.path}>
                  <BookCard book={book} />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
