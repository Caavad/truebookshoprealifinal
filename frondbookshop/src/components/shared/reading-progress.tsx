"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { readingBookmarksApi } from "@/lib/api";

export function ReadingProgress({ bookId, chapterId }: { bookId: number; chapterId: number }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.accessToken) return;
    readingBookmarksApi.set(session.accessToken, bookId, chapterId).catch(() => {
      // A failed progress update must not prevent the reader from opening a chapter.
    });
  }, [bookId, chapterId, session?.accessToken]);

  return null;
}
