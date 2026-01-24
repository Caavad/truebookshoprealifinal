import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github } from "lucide-react";
import { GoArrowRight } from "react-icons/go";

import { BookCard } from "@/components/shared/book-card/book-card";
import { Book } from "@/helpers/interfaces/books";

export default async function Main() {
  const API_HOST = process.env.API_HOST!;

  const response = await fetch(
  `${API_HOST}/api/books`,
  { cache: "no-store" }
);

  // const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST || 'https://localhost:7000'}/api/books`, 
  //   {
  //   cache: 'no-store'
  // });
  
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  
  const items: Book[] = await response.json();

  return (
    <main className="container">

      <section className="container py-24 text-center animate-fadeUp">
        <div className="mb-8 flex justify-center">
          <Link href="https://github.com/Caavad/truebookshoprealifinal-1-" target="_blank">
            <Button
              variant="outline"
              className="bg-zinc-800 font-[900] rounded-full hover:bg-zinc-900 text-xs "
            >
              <Github className="h-4 w-4" />
              Open source project
            </Button>
          </Link>
        </div>
        <h1 className="mb-6 text-3xl font-bold">Your online book store</h1>
      </section>


      <section className="container mx-auto px-4 pb-24 max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold">Featured Books</h2>
          <Link href="/docs">
            <Button variant="outline" className="text-white font-medium">
              <span>View all books</span> <GoArrowRight />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {items.map((book: Book) => (
            <Link key={book.id} href={book.path}>
              <BookCard key={book.id} book={book} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}