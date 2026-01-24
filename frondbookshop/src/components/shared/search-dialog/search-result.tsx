import { CommandGroup, CommandItem } from "@/components/ui/command";
import { Book } from "@/helpers/interfaces/books";

interface SearchResultprops {
  results: Book[];
  onSelect: (book: Book) => void;
}

export default function SearchResult({ results, onSelect }: SearchResultprops) {
  return (
    <CommandGroup heading="Products">
      {results.map((book) => (
        <CommandItem key={book.id} value={book.title} onSelect={() => onSelect(book)}>
          <span>{book.title}</span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
