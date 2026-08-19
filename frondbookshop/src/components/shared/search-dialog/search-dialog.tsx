"use client";

import * as React from "react";
import { IoSearchOutline } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import { Book } from "@/helpers/interfaces/books";
import { CategoryDto } from "@/helpers/interfaces/categories";
import { searchBooks } from "@/utils/actions/search-books";
import {
  GenreSearchResult,
  genresFromCategories,
  searchGenres,
} from "@/utils/actions/search-genres";
import { categoriesApi } from "@/lib/api";
import SearchResult from "./search-result";
import SearchSuggestion from "./search-suggestion";
import SearchGenreResult from "./search-genre-result";
import SearchGenreSuggestion from "./search-genre-suggestion";

type SearchMode = "books" | "genres";

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchMode, setSearchMode] = React.useState<SearchMode>("books");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [bookResults, setBookResults] = React.useState<Book[]>([]);
  const [genreResults, setGenreResults] = React.useState<GenreSearchResult[]>(
    []
  );
  const [categories, setCategories] = React.useState<CategoryDto[]>([]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setBookResults([]);
      setGenreResults([]);
      setSearchMode("books");
      return;
    }

    categoriesApi
      .getAll()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [open]);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      const query = searchQuery.trim();

      if (!query) {
        setBookResults([]);
        setGenreResults([]);
        return;
      }

      if (searchMode === "books") {
        try {
          const result = await searchBooks(query);
          setBookResults(result);
        } catch (error) {
          console.error("Search failed:", error);
          setBookResults([]);
        }
        setGenreResults([]);
      } else {
        setGenreResults(searchGenres(query, categories));
        setBookResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, searchMode, categories]);

  const handleBookSelect = (book: Book) => {
    router.push(book.path);
    setOpen(false);
  };

  const handleGenreSelect = (genre: GenreSearchResult) => {
    router.push(genre.href);
    setOpen(false);
  };

  const hasQuery = searchQuery.trim() !== "";
  const hasResults =
    searchMode === "books" ? bookResults.length > 0 : genreResults.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <div className="flex items-center gap-2">
            <IoSearchOutline className="h-4 w-4" />
            <span>Search books...</span>
          </div>
          <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
            <span className="text-xs">Ctrl K</span>
          </kbd>
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command>
          <CommandInput
            placeholder={
              searchMode === "books"
                ? "Type a book title or author..."
                : "Type a genre or category..."
            }
            value={searchQuery}
            onValueChange={setSearchQuery}
          />

          <div className="flex gap-1 border-b px-3 py-2">
            <Button
              type="button"
              variant={searchMode === "books" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 flex-1"
              onClick={() => setSearchMode("books")}
            >
              Books
            </Button>
            <Button
              type="button"
              variant={searchMode === "genres" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 flex-1"
              onClick={() => setSearchMode("genres")}
            >
              Genres
            </Button>
          </div>

          <CommandList>
            {!hasQuery ? (
              searchMode === "books" ? (
                <SearchSuggestion
                  genres={genresFromCategories(categories)}
                  onSelectGenre={handleGenreSelect}
                />
              ) : (
                <SearchGenreSuggestion
                  genres={genresFromCategories(categories)}
                  onSelect={handleGenreSelect}
                />
              )
            ) : hasResults ? (
              searchMode === "books" ? (
                <SearchResult
                  results={bookResults}
                  onSelect={handleBookSelect}
                />
              ) : (
                <SearchGenreResult
                  results={genreResults}
                  onSelect={handleGenreSelect}
                />
              )
            ) : (
              <CommandEmpty>No results found.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
