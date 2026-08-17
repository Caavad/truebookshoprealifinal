import { redirect } from "next/navigation";
import { Book } from "@/helpers/interfaces/books";
import { getApiBaseUrl } from "@/lib/api-config";

// Compatibility route for old links. Book pages are rendered only by
// /docs/[...slug], which prevents two different files from drifting apart.
export default async function LegacyBookRoute({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const response = await fetch(`${getApiBaseUrl()}/api/books`, { cache: "no-store" });

  if (!response.ok) {
    return <div className="min-h-screen p-10 text-white">Book not found.</div>;
  }

  const books = (await response.json()) as Book[];
  const book = books.find((item) => item.path.endsWith(`/${path}`));

  if (!book) {
    return <div className="min-h-screen p-10 text-white">Book not found.</div>;
  }

  redirect(book.path);
}
