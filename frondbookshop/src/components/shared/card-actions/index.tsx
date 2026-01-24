"use client";

import { Button } from "@/components/ui/button";
//import QuantitySelector from "../quantity-selector";
//import { Heart } from "lucide-react";
import { useLibraryStore } from "@/store";
import { Book } from "@/helpers/interfaces/books";

export default function CardActions({ book }: { book: Book }) {
  const { setBooks } = useLibraryStore();

  const addToLibrary = (
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
  };

  return (
    <div className="flex flex-col gap-5">
       {/*<QuantitySelector book={book} />*/}

      <div className="flex gap-4">
        <Button className="flex-1 bg-white text-black hover:bg-zinc-200">
          Read now
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

