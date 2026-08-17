"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import QuantitySelector from "../quantity-selector"; // если нужен
import { useLibraryStore } from "@/store";
import { Book } from "@/helpers/interfaces/books";

export function BookItem({
  id,
  title,
  author,
  coverUrl,
  path,
  description,
  stockCount,
}: Book) {
  const { setBooks } = useLibraryStore();

  const removeItem = (id: number) => {
    setBooks((prev) => prev.filter((book) => book.id !== id));
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="text-sm text-white/60">
          {author && <span className="mr-1 italic">{author}</span>}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {/* Кол-во, если нужно */}
        {/* <QuantitySelector
          book={{
            id,
            title,
            author,
            coverUrl,
            path,
            description,
            stockCount,
            category: "",
            rating: 0,
            quantity: 1,
          }}
        /> */}
        <Button variant="outline" size="icon" onClick={() => removeItem(id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove book</span>
        </Button>
      </div>
    </div>
  );
}