"use client";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { BookOpen, FolderOpen } from "lucide-react";
import { getAllGenres, GenreSearchResult } from "@/utils/actions/search-genres";

interface SearchGenreSuggestionProps {
  onSelect: (genre: GenreSearchResult) => void;
}

export default function SearchGenreSuggestion({
  onSelect,
}: SearchGenreSuggestionProps) {
  const genres = getAllGenres();
  const categories = genres.filter((item) => item.type === "category");
  const subcategories = genres.filter((item) => item.type === "subcategory");

  return (
    <>
      <CommandGroup heading="Categories">
        {categories.map((genre) => (
          <CommandItem
            key={genre.id}
            value={genre.title}
            onSelect={() => onSelect(genre)}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>{genre.title}</span>
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandGroup heading="Subcategories">
        {subcategories.slice(0, 6).map((genre) => (
          <CommandItem
            key={genre.id}
            value={`${genre.parentCategory} ${genre.title}`}
            onSelect={() => onSelect(genre)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>
              {genre.title}
              <span className="text-muted-foreground"> · {genre.parentCategory}</span>
            </span>
          </CommandItem>
        ))}
      </CommandGroup>
    </>
  );
}
