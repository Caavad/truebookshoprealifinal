"use client";

import { Eye } from "lucide-react";
import { BookCover } from "@/components/shared/book-cover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { usePathname } from "next/navigation";
import { Book } from "@/helpers/interfaces/books";
import { useLibraryStore } from "@/store";
import { useSession } from "next-auth/react";
import { libraryApi } from "@/lib/api";

type BookCardProps = { book: Book };

export function BookCard({ book }: BookCardProps) {
  const pathname = usePathname();
  const isDocs = pathname.startsWith("/docs");

  const { setBooks } = useLibraryStore();
  const { data: session } = useSession();

  const addToLibrary = async (
    event: React.MouseEvent<HTMLButtonElement>,
    book: Book
  ) => {
    event.preventDefault();
    setBooks((prev) => {
      const existing = prev.find((b) => b.id === book.id);
      if (!existing) {
        return [...prev, book];
      }
      return prev;
    });
    if (session?.accessToken) {
      await libraryApi.add(session.accessToken, book.id);
    }
  };

  return (
    <Card className="rounded-lg border-0 bg-zinc-900">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
          <BookCover
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-medium text-white">{book.title}</h3>
        <p className="text-sm text-zinc-400">{book.author}</p>
        {isDocs && (
          <p className="text-sm text-zinc-500 line-clamp-2 mt-2">
            {book.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          className="flex-1 bg-white text-black hover:bg-zinc-200"
          onClick={(event) => addToLibrary(event, book)}
        >
          {isDocs ? "View books" : "Add to Library"}
        </Button>
        {!isDocs && (
          <Button size="icon" variant="outline" className="border-zinc-800">
            <Eye className="h-4 w-4 text-white" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
