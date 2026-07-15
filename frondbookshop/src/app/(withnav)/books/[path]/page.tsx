import { BookCover } from "@/components/shared/book-cover";
import CardActions from "@/components/shared/card-actions";
import { Star } from "lucide-react";
import { Book } from "@/helpers/interfaces/books";

export default async function BookDetails({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  const API_HOST = process.env.API_HOST!;

  const response = await fetch(
  `${API_HOST}/api/books`,
  { cache: "no-store" }
);

  // const response = await fetch(
  //   `${process.env.API_HOST || "http://localhost:7000"}/api/books`,
  //   { cache: "no-store" }
  // );

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.statusText}`);
  }

  const books: Book[] = await response.json();
  const book = books.find((item) => item.path.endsWith(path));

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Book not found.
      </div>
    );
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

          <div className="text-zinc-400">
            {book.stockCount} copies available
          </div>

          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < (book.rating ?? 0)
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
                fill="currentColor"
              />
            ))}
          </div>

          <CardActions book={book} />

          <div className="pt-4">
            <h5 className="text-lg font-semibold mb-1">Description</h5>
            <p className="text-zinc-400">
              {book.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// import Image from "next/image";
// import CardActions from "@/components/shared/card-actions";
// import { Star } from "lucide-react";
// import { Book } from "@/helpers/interfaces/books";

// interface ItemProps {
//   params: {
//     path: string;
//   };
// }

// export default async function BookDetails({ params }: ItemProps) {
//   const { path } = params;

//   const response = await fetch(`${process.env.API_HOST || 'http://localhost:7000'}/api/books`, {
//     cache: 'no-store'
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch books: ${response.statusText}`);
//   }

//   const books: Book[] = await response.json();

//  const book = books.find((item) => item.path.endsWith(path));


//   if (!book) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Book not found.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white p-6">
//       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
//         <div className="aspect-square relative bg-zinc-900 rounded-lg">
//           <Image
//             src={
//               book.coverUrl
//             }
//             alt={book.title}
//             fill
//             className="object-cover rounded-lg"
//           />
//         </div>

//         <div className="space-y-6">
//           <div>
//             <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
//             <p className="text-zinc-400">{book.category}</p>
//           </div>

//           <div className="text-zinc-400">{book.stockCount} copies available</div>

//           <div className="flex gap-1">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className={`w-5 h-5 ${
//                   i < (book.rating || 0)
//                     ? "text-yellow-400"
//                     : "text-gray-400"
//                 }`}
//                 fill="currentColor"
//               />
//             ))}
//           </div>

//           <CardActions book={book} />

//           <div className="pt-4">
//             <h5 className="text-lg font-semibold mb-1">Description</h5>
//             <p className="text-zinc-400">
//               {book.description || "No description available."}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }