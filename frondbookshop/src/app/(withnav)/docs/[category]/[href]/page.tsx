import { BookCover } from "@/components/shared/book-cover";
import CardActions from "@/components/shared/card-actions";
import { Star } from "lucide-react";
import { Book } from "@/helpers/interfaces/books";


/*interface PageProps {
  params: { category: string; href: string };
}*/

//export default async function BookPage({ params: { category, href } }: PageProps) {
export default async function BookPage({
  params,
}: {
  params: Promise<{
    category: string;
    href: string;
  }>;
}) {
  const { category, href } = await params;

  const API_HOST = process.env.NEXT_PUBLIC_API_HOST!;

  const res = await fetch(`${API_HOST}/api/books`);

//  const res = await fetch(`${process.env.API_HOST || 'http://localhost:7000'}/api/books`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`);
  }
  const books: Book[] = await res.json();

  const fullPath = `/docs/${category}/${href}`;
  const book = books.find((b) => b.path === fullPath);

  if (!book) {
    return <div className="p-10 text-white">Book not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="aspect-square relative bg-zinc-900 rounded-lg">
          <BookCover
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
            <p className="text-zinc-400">{book.category}</p>
          </div>

          <div className="text-zinc-400">{book.stockCount} in stock</div>

          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < (book.rating || 0) ? "text-yellow-400" : "text-gray-400"}`}
                fill="currentColor"
              />
            ))}
          </div>

          <CardActions book={book} />

          <div className="pt-4">
            <h5>Description</h5>
            <p className="text-zinc-400">{book.description || "No description available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}