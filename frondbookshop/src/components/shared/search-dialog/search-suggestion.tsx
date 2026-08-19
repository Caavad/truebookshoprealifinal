"use client";

import {
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  BookOpen,
  Search,
  Star,
} from "lucide-react";
import { GenreSearchResult } from "@/utils/actions/search-genres";

interface SearchSuggestionProps {
  genres?: GenreSearchResult[];
  onSelectGenre?: (genre: GenreSearchResult) => void;
}

export default function SearchSuggestion({
  genres = [],
  onSelectGenre,
}: SearchSuggestionProps) {
  const categories = genres.filter((item) => item.type === "category").slice(0, 4);
  const subcategories = genres.filter((item) => item.type === "subcategory").slice(0, 4);

  return (
    <>
      {categories.length > 0 && (
        <CommandGroup heading="Popular Categories">
          {categories.map((category) => (
            <CommandItem
              key={category.id}
              value={category.title}
              onSelect={() => onSelectGenre?.(category)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>{category.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      {subcategories.length > 0 && (
        <CommandGroup heading="Browse by Topic">
          {subcategories.map((subcategory) => (
            <CommandItem
              key={subcategory.id}
              value={`${subcategory.parentCategory} ${subcategory.title}`}
              onSelect={() => onSelectGenre?.(subcategory)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>{subcategory.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      <CommandGroup heading="Quick Actions">
        <CommandItem value="all-books" onSelect={() => onSelectGenre?.({
          id: "all-books",
          title: "All Books",
          description: "",
          href: "/docs",
          type: "category",
        })}>
          <Star className="mr-2 h-4 w-4" />
          <span>All Books</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
