import { create } from "zustand";
import { Book } from "@/helpers/interfaces/books";

interface LibraryState {
  books: Book[];
  setBooks: (fn: (prev: Book[]) => Book[]) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  books: [],
  setBooks: (fn) => set((state) => ({ books: fn(state.books) })),
}));
