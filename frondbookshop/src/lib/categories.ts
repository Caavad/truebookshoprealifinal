import { CategoryDto } from "@/helpers/interfaces/categories";
import { NavBarProps } from "@/helpers/interfaces/navbar";
import { BOOK_CATEGORIES, slugify } from "@/lib/book-categories";

export function fallbackCategories(): CategoryDto[] {
  return Object.entries(BOOK_CATEGORIES).map(([name, subs], index) => ({
    id: -(index + 1),
    name,
    slug: slugify(name),
    displayName: name,
    description: `Books in the ${name} category.`,
    subCategories: subs.map((sub, subIndex) => ({
      id: -(index * 100 + subIndex + 1),
      categoryId: -(index + 1),
      name: sub,
      slug: slugify(sub),
      displayName: sub,
      description: "",
    })),
  }));
}

export function withFallbackCategories(categories: CategoryDto[]): CategoryDto[] {
  return categories.length > 0 ? categories : fallbackCategories();
}

export function categoriesToNavItems(categories: CategoryDto[]): NavBarProps[] {
  return withFallbackCategories(categories).map((category) => {
    const slug = category.slug || slugify(category.name);
    const label = category.displayName || category.name;

    return {
      id: String(category.id),
      name: label,
      category: slug,
      description: category.description || `Explore ${label} books.`,
      items: [
        {
          id: `all-${category.id}`,
          title: "All",
          href: `/docs/${slug}`,
          description: `All ${label} books`,
        },
        ...category.subCategories.map((sub) => ({
          id: String(sub.id),
          title: sub.displayName || sub.name,
          href: `/docs/${slug}/${sub.slug || slugify(sub.name)}`,
          description:
            sub.description || `Browse ${sub.displayName || sub.name} books.`,
        })),
      ],
    };
  });
}
