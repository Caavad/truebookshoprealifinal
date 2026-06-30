import { BookCard } from "@/components/shared/book-card/book-card";
import Link from "next/link";
import { Book } from "@/helpers/interfaces/books";

/*interface Props {
  params: {
    category: string;
  };
}

export default async function Categories({ params }: Props) {
  const { category } = params;*/
export default async function Categories({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) {
  const { category} = await params;

  // д
    const API_HOST = process.env.NEXT_PUBLIC_API_HOST!;

  const response = await fetch(`${API_HOST}/api/books`);
/*  const response = await fetch(`${process.env.API_HOST || 'http://localhost:7000'}/api/books/category/${category}`, {
    cache: 'no-store'
  });*/

  if (!response.ok) {
    throw new Error(`Failed to fetch books for category ${category}`);
  }

  const items: Book[] = await response.json();

  return (
    <div className="container mt-10 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold capitalize">
          {category}
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore books in the {category} category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {items.map((book) => (
          <Link key={book.id} href={book.path}>
            <BookCard book={book} />
          </Link>
        ))}
      </div>
    </div>
  );
}