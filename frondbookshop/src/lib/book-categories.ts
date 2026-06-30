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
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function buildBookPath(
  category: string,
  _subCategory: string,
  title: string
) {
  const categorySlug = slugify(category);
  const titleSlug = slugify(title);
  return `/docs/${categorySlug}/${titleSlug}`;
}
