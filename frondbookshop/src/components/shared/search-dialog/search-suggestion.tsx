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

export default function SearchSuggestion() {
  // We'll fetch categories dynamically, but for now use static list
  const categories = ["Programming", "Self-help", "History", "Fiction"];
  const subcategories = ["Frontend", "Backend", "DevOps", "Habits", "Productivity", "World History", "Science Fiction"];

  return (
    <>
      <CommandGroup heading="Popular Categories">
        {categories.slice(0, 4).map((category) => (
          <CommandItem key={category}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>{category}</span>
          </CommandItem>
        ))}
      </CommandGroup>
      
      <CommandGroup heading="Browse by Topic">
        {subcategories.slice(0, 4).map((subcategory) => (
          <CommandItem key={subcategory}>
            <Search className="mr-2 h-4 w-4" />
            <span>{subcategory}</span>
          </CommandItem>
        ))}
      </CommandGroup>
      
      <CommandGroup heading="Quick Actions">
        <CommandItem>
          <Star className="mr-2 h-4 w-4" />
          <span>Featured Books</span>
        </CommandItem>
        <CommandItem>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>All Books</span>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
