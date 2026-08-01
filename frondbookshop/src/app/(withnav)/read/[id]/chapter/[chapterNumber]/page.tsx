import Link from "next/link";
import { notFound } from "next/navigation";
import { booksApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ReadingProgress } from "@/components/shared/reading-progress";

export default async function ReadChapterPage({
  params,
}: {
  params: Promise<{ id: string; chapterNumber: string }>;
}) {
  const { id, chapterNumber } = await params;
  const bookId = Number(id);
  const number = Number(chapterNumber);

  if (!Number.isInteger(bookId) || !Number.isInteger(number)) notFound();

  let book;
  try {
    book = await booksApi.getRead(bookId);
  } catch {
    notFound();
  }

  const chapters = [...(book.chapters ?? [])].sort(
    (a, b) => a.chapterNumber - b.chapterNumber
  );
  const currentIndex = chapters.findIndex(
    (chapter) => chapter.chapterNumber === number
  );
  if (currentIndex === -1) notFound();

  const chapter = chapters[currentIndex];
  const previous = chapters[currentIndex - 1];
  const next = chapters[currentIndex + 1];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container max-w-3xl py-10">
        <ReadingProgress bookId={bookId} chapterId={chapter.id} />
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="mt-1 text-zinc-400">{book.author}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs">Back to catalog</Link>
          </Button>
        </div>

        <nav aria-label="Chapters" className="mb-8 flex flex-wrap gap-2">
          {chapters.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={item.id === chapter.id ? "default" : "outline"}
              asChild
            >
              <Link href={`/read/${bookId}/chapter/${item.chapterNumber}`}>
                {item.chapterNumber}. {item.title}
              </Link>
            </Button>
          ))}
        </nav>

        <article className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {chapter.chapterNumber}. {chapter.title}
          </h2>
          {chapter.content.split("\n").filter(Boolean).map((paragraph, index) => (
            <p key={index} className="leading-7 text-zinc-200">
              {paragraph}
            </p>
          ))}
        </article>

        <nav className="mt-10 flex items-center justify-between gap-3" aria-label="Page navigation">
          {previous ? (
            <Button variant="outline" asChild>
              <Link href={`/read/${bookId}/chapter/${previous.chapterNumber}`}>
                ← {previous.chapterNumber}. {previous.title}
              </Link>
            </Button>
          ) : <span />}
          {next ? (
            <Button asChild>
              <Link href={`/read/${bookId}/chapter/${next.chapterNumber}`}>
                {next.chapterNumber}. {next.title} →
              </Link>
            </Button>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
}
