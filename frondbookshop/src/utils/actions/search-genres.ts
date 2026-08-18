import { books as navbarCategories } from "@/data/navbar";

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

export function searchGenres(query: string): GenreSearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const results: GenreSearchResult[] = [];

  for (const category of navbarCategories) {
    if (
      matchesQuery(category.name, normalizedQuery) ||
      matchesQuery(category.description, normalizedQuery) ||
      matchesQuery(category.category, normalizedQuery)
    ) {
      results.push({
        id: `cat-${category.id}`,
        title: category.name,
        description: category.description,
        href: `/docs/${category.category}`,
        type: "category",
      });
    }

    for (const item of category.items) {
      if (item.title === "All") continue;

      if (
        matchesQuery(item.title, normalizedQuery) ||
        matchesQuery(item.description, normalizedQuery)
      ) {
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
  }

  return results;
}

export function getAllGenres(): GenreSearchResult[] {
  const results: GenreSearchResult[] = [];

  for (const category of navbarCategories) {
    results.push({
      id: `cat-${category.id}`,
      title: category.name,
      description: category.description,
      href: `/docs/${category.category}`,
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
