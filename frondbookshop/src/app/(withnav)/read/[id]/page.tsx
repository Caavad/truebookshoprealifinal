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

  const hasChapters = book.chapters && book.chapters.length > 0;

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

        {hasChapters ? (
          <article className="space-y-8">
            {book.chapters.map((chapter) => (
              <section key={chapter.id} className="space-y-3">
                <h2 className="text-xl font-semibold text-white">
                  {chapter.chapterNumber}. {chapter.title}
                </h2>
                {chapter.content.split("\n").filter(Boolean).map((paragraph, index) => (
                  <p key={index} className="text-zinc-200 leading-7">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </article>
        ) : (
          <article className="space-y-4 leading-7">
            {(book.content || "No content available for this book yet.")
              .split("\n")
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index} className="text-zinc-200">
                  {paragraph}
                </p>
              ))}
          </article>
        )}
      </div>
    </div>
  );
}
