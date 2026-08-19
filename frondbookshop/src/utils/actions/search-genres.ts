import { NavBarProps } from "@/helpers/interfaces/navbar";
import { CategoryDto } from "@/helpers/interfaces/categories";
import { categoriesToNavItems } from "@/lib/categories";

export type GenreSearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "category" | "subcategory";
  parentCategory?: string;
};

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query);
}

function toGenreResults(navItems: NavBarProps[]): GenreSearchResult[] {
  const results: GenreSearchResult[] = [];

  for (const category of navItems) {
    results.push({
      id: `cat-${category.id}`,
      title: category.name,
      description: category.description,
      href: `/docs/${category.category || category.name.toLowerCase()}`,
      type: "category",
    });

    for (const item of category.items) {
      if (item.title === "All") continue;

      results.push({
        id: `sub-${category.id}-${item.id}`,
        title: item.title,
        description: item.description,
        href: item.href,
        type: "subcategory",
        parentCategory: category.name,
      });
    }
  }

  return results;
}

export function genresFromCategories(categories: CategoryDto[]): GenreSearchResult[] {
  return toGenreResults(categoriesToNavItems(categories));
}

export function searchGenres(
  query: string,
  categories: CategoryDto[]
): GenreSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return genresFromCategories(categories).filter(
    (genre) =>
      matchesQuery(genre.title, normalizedQuery) ||
      matchesQuery(genre.description, normalizedQuery) ||
      matchesQuery(genre.href, normalizedQuery) ||
      (genre.parentCategory && matchesQuery(genre.parentCategory, normalizedQuery))
  );
}
