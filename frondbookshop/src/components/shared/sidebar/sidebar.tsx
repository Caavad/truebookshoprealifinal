"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLibraryStore } from "@/store"; // заменено с useProductStore
import { BookOpen } from "lucide-react"; // иконка библиотеки вместо корзины
import { BookItem } from "./book-item"; // заменено с ProductItem

export function Sidebar() {
  const { books } = useLibraryStore();

  const libraryItems = books;
  const totalItems = libraryItems.length;



  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BookOpen className="h-4 w-4" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open library</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex h-full flex-col bg-black text-white">
        <SheetHeader>
          <SheetTitle className="text-white">My Library</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {libraryItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-4">
              <div className="rounded-full border border-white/20 p-6">
                <BookOpen className="h-8 w-8 text-white/50" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white">
                  Your library is empty
                </p>
                <p className="text-sm text-white/60">
                  Add books to your library to get started
                </p>
              </div>
            </div>
          ) : (
            libraryItems.map((item) => <BookItem key={item.id} {...item} />)
          )}
        </div>

        {libraryItems.length > 0 && (
          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between text-sm">
              <span>Total</span>
            </div>
            <Button className="w-full mt-4">Read All</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
