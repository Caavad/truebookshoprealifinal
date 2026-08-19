export const BOOK_CATEGORIES: Record<string, string[]> = {
  Programming: ["frontend", "backend", "devops", "testing"],
  "Self-help": ["productivity", "habits", "motivation"],
  Fiction: ["sci-fi", "fantasy", "mystery", "classics"],
  History: ["world", "biographies", "politics-war"],
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildBookPath(
  category: string,
  _subCategory: string,
  title: string
) {
  const categorySlug = slugify(category) || "books";
  const titleSlug = slugify(title) || "new-book";
  return `/docs/${categorySlug}/${titleSlug}`;
}

export function matchesGenre(storedValue: string, needle: string) {
  const stored = slugify(storedValue);
  const wanted = slugify(needle);
  if (stored && wanted && stored === wanted) return true;

  const compact = (value: string) =>
    value.trim().toLowerCase().replace(/-/g, " ");
  return compact(storedValue) === compact(needle);
}
