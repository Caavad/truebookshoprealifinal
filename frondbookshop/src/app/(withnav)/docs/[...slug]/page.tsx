import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/shared/book-card/book-card";
import { BookCover } from "@/components/shared/book-cover";
import CardActions from "@/components/shared/card-actions";
import { ApiUnavailable } from "@/components/shared/api-unavailable";
import { BookRating } from "@/components/shared/book-rating";
import { fetchBooks, filterByCategory, filterBySubCategory } from "@/lib/fetch-books";

function titleFromSlug(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function DocsRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  if (slug.length < 1 || slug.length > 2) notFound();

  const { books, error } = await fetchBooks();
  const requestedPath = `/docs/${slug.join("/")}`;
  const book = slug.length === 2 ? books.find((item) => item.path === requestedPath) : undefined;

  if (book) {
    return (
      <div className="min-h-screen bg-black p-6 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="relative aspect-square rounded-lg bg-zinc-900">
            <BookCover src={book.coverUrl} alt={book.title} fill className="rounded-lg object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-2xl font-bold">{book.title}</h1>
              <p className="text-zinc-400">{book.category}</p>
              <p className="mt-2 text-zinc-300">
                Author: {" "}
                <Link href={`/authors/${encodeURIComponent(book.author)}`} className="font-medium text-white hover:underline">
                  {book.author}
                </Link>
              </p>
            </div>
            <div className="text-zinc-400">{book.stockCount} in stock</div>
            <CardActions book={book} />
            <div className="pt-4">
              <h2>Description</h2>
              <p className="text-zinc-400">{book.description || "No description available."}</p>
            </div>
            <BookRating bookId={book.id} />
          </div>
        </div>
      </div>
    );
  }

  const category = slug[0];
  const categoryBooks = filterByCategory(books, category);
  const isSubCategory = slug.length === 2;
  const items = isSubCategory
    ? categoryBooks.filter((item) => filterBySubCategory([item], slug[1]).length > 0)
    : categoryBooks;
  const heading = isSubCategory ? titleFromSlug(slug[1]) : titleFromSlug(category);

  return (
    <main className="container mt-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="text-sm text-zinc-400">
          <Link href="/docs" className="hover:text-white">All books</Link>
          {isSubCategory && <>{" / "}<Link href={`/docs/${category}`} className="hover:text-white">{titleFromSlug(category)}</Link></>}
        </div>
        <h1 className="text-3xl font-bold capitalize">{heading}</h1>
        <p className="text-lg text-muted-foreground">{isSubCategory ? "Explore books in this subcategory" : `Explore books in the ${heading} category`}</p>
      </div>

      {error ? (
        <ApiUnavailable message={error} />
      ) : items.length === 0 ? (
        <p className="text-zinc-400">No books found in this section.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link key={item.id} href={item.path}>
              <BookCard book={item} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
