import { CommandGroup, CommandItem } from "@/components/ui/command";
import { BookOpen, FolderOpen } from "lucide-react";
import { GenreSearchResult } from "@/utils/actions/search-genres";

interface SearchGenreResultProps {
  results: GenreSearchResult[];
  onSelect: (genre: GenreSearchResult) => void;
}

export default function SearchGenreResult({
  results,
  onSelect,
}: SearchGenreResultProps) {
  const categories = results.filter((item) => item.type === "category");
  const subcategories = results.filter((item) => item.type === "subcategory");

  return (
    <>
      {categories.length > 0 && (
        <CommandGroup heading="Categories">
          {categories.map((genre) => (
            <CommandItem
              key={genre.id}
              value={genre.title}
              onSelect={() => onSelect(genre)}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>{genre.title}</span>
                <span className="text-xs text-muted-foreground">
                  {genre.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}

      {subcategories.length > 0 && (
        <CommandGroup heading="Subcategories">
          {subcategories.map((genre) => (
            <CommandItem
              key={genre.id}
              value={`${genre.parentCategory} ${genre.title}`}
              onSelect={() => onSelect(genre)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>{genre.title}</span>
                <span className="text-xs text-muted-foreground">
                  {genre.parentCategory} · {genre.description}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  );
}
