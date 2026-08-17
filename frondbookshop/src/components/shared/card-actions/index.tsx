"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLibraryStore } from "@/store";
import { Book } from "@/helpers/interfaces/books";
import { useSession } from "next-auth/react";
import { libraryApi } from "@/lib/api";

export default function CardActions({ book }: { book: Book }) {
  const { setBooks } = useLibraryStore();
  const { data: session } = useSession();

  const addToLibrary = async (
    event: React.MouseEvent<HTMLButtonElement>,
    book: Book
  ) => {
    event.preventDefault();
    setBooks((prev) => {
      const current = prev.find((b) => b.id === book.id);
      if (!current) {
        return [...prev, book];
      }
      return prev;
    });
    if (session?.accessToken) {
      await libraryApi.add(session.accessToken, book.id);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4">
        <Button
          asChild
          className="flex-1 bg-white text-black hover:bg-zinc-200"
        >
          <Link href={`/read/${book.id}`}>Read now</Link>
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={(event) => addToLibrary(event, book)}
        >
          Add to library
        </Button>
      </div>
    </div>
  );
}
