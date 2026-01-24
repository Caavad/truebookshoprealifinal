"use client";

import { Button } from "@/components/ui/button";
import { Book } from "@/helpers/interfaces/books";
import { useLibraryStore } from "@/store";
import { MinusIcon, PlusIcon } from "lucide-react";

interface QuantitySelectorProps {
  book: Book;
}

export default function QuantitySelector({ book }: QuantitySelectorProps) {
  const { books, setBooks } = useLibraryStore();

  const current = books.find((p) => p.id === book.id);

  const count = current?.quantity ?? 1;

  const incrementQuantity = () => {
    setBooks((prev) =>
      prev.map((p) =>
        p.id === book.id ? { ...p, quantity: (p.quantity ?? 1) + 1  } : p
      )
    );
  };

  const decrementQuantity = () => {
    if (count > 1) {
      setBooks((prev) =>
        prev.map((p) =>
          p.id === book.id ? { ...p, quantity: (p.quantity ?? 1) - 1} : p
        )
      );
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="rounded-r-none"
          onClick={decrementQuantity}
        >
          <MinusIcon className="w-4 h-4" />
        </Button>
        <span className="mx-3">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="rounded-l-none"
          onClick={incrementQuantity}
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
