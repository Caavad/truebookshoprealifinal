import { BookCard } from "@/components/shared/book-card/book-card";
import { ApiUnavailable } from "@/components/shared/api-unavailable";
import Link from "next/link";
import { fetchBooks, filterByCategory } from "@/lib/fetch-books";

export default async function Categories({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) {
  const { category } = await params;
  const { books, error } = await fetchBooks();
  const items = filterByCategory(books, category);

  return (
    <div className="container mt-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold capitalize">{category}</h1>
        <p className="text-lg text-muted-foreground">
          Explore books in the {category} category
        </p>
      </div>

      {error ? (
        <ApiUnavailable message={error} />
      ) : items.length === 0 ? (
        <p className="text-zinc-400">No books found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {items.map((book) => (
            <Link key={book.id} href={book.path}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
