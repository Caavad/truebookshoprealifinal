import Link from "next/link";
import { booksApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default async function ReadBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return (
      <div className="container py-24 text-center text-white">
        Invalid book id.
      </div>
    );
  }

  let book;
  try {
    book = await booksApi.getRead(bookId);
  } catch {
    return (
      <div className="container py-24 text-center text-white">
        Book not found.
      </div>
    );
  }

  const paragraphs = (book.content || "No content available for this book yet.")
    .split("\n")
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container max-w-3xl py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-zinc-400 mt-1">{book.author}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs">Back to catalog</Link>
          </Button>
        </div>

        <article className="prose prose-invert max-w-none space-y-4 leading-7">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-zinc-200">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </div>
  );
}
