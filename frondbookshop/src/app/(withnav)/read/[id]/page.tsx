"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookReadDto, booksApi, readingBookmarksApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ReadBookPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [book, setBook] = useState<BookReadDto | null>(null);
  const [error, setError] = useState(false);
  const { id } = use(params);
  const bookId = Number(id);

  useEffect(() => {
    if (!Number.isInteger(bookId)) {
      setError(true);
      return;
    }

    booksApi.getRead(bookId).then(setBook).catch(() => setError(true));
  }, [bookId]);

  useEffect(() => {
    if (!book || status === "loading") return;
    const chapters = book.chapters ?? [];
    const firstChapter = chapters[0];
    if (!firstChapter) return;

    async function openChapter() {
      let chapterNumber = firstChapter.chapterNumber;
      if (session?.accessToken) {
        try {
          const bookmark = await readingBookmarksApi.get(session.accessToken, bookId);
          if (bookmark && chapters.some((chapter) => chapter.id === bookmark.chapterId)) {
            chapterNumber = bookmark.chapterNumber;
          }
        } catch {
          // Reading remains available if the visitor is signed out or the token expired.
        }
      }
      router.replace(`/read/${bookId}/chapter/${chapterNumber}`);
    }

    openChapter();
  }, [book, bookId, router, session?.accessToken, status]);

  if (error) {
    return <div className="container py-24 text-center text-white">Book not found.</div>;
  }

  if (!book || (book.chapters?.length && status === "loading")) {
    return <div className="container py-24 text-center text-white">Opening book...</div>;
  }

  if (book.chapters?.length) {
    return <div className="container py-24 text-center text-white">Opening your chapter...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container max-w-3xl py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="mt-1 text-zinc-400">{book.author}</p>
          </div>
          <Button variant="outline" asChild><Link href="/docs">Back to catalog</Link></Button>
        </div>
        <article className="space-y-4 leading-7">
          {(book.content || "No content available for this book yet.").split("\n").filter(Boolean).map((paragraph, index) => (
            <p key={index} className="text-zinc-200">{paragraph}</p>
          ))}
        </article>
      </div>
    </div>
  );
}
