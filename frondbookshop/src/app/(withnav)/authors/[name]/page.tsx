import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCard } from "@/components/shared/book-card/book-card";
import { Button } from "@/components/ui/button";
import { fetchBooks } from "@/lib/fetch-books";

export default async function AuthorBooksPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const author = decodeURIComponent(name).trim();
  if (!author) notFound();

  const { books, error } = await fetchBooks();
  const authorBooks = books.filter(
    (book) => book.author.trim().toLocaleLowerCase() === author.toLocaleLowerCase()
  );

  return (
    <main className="container py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400">Author</p>
          <h1 className="text-3xl font-bold text-white">{author}</h1>
          <p className="mt-2 text-zinc-400">Books by this author: {authorBooks.length}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/docs">All books</Link>
        </Button>
      </div>

      {error ? (
        <p className="text-amber-300">{error}</p>
      ) : authorBooks.length === 0 ? (
        <p className="text-zinc-400">No books by this author were found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {authorBooks.map((book) => (
            <Link key={book.id} href={book.path}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
