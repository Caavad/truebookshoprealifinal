import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ category: string }> }
) {
  const { category } = await context.params;

  const apiHost = process.env.API_HOST || "http://localhost:5130";

  try {
    const response = await fetch(
      `${apiHost}/api/books/category/${category}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const books = await response.json();
    return NextResponse.json(books);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   context: { params: { category: string } }
// ) {
//   const { category } = context.params;
//   const apiHost = process.env.API_HOST || "http://localhost:5130";

//   try {
//     const response = await fetch(
//       `${apiHost}/api/books/category/${category}`,
//       { cache: "no-store" }
//     );

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Category not found" },
//         { status: 404 }
//       );
//     }

//     const books = await response.json();
//     return NextResponse.json(books);
//   } catch {
//     return NextResponse.json(
//       { error: "Failed to fetch books" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// export async function GET(req: Request, context: { params }: { params: { category: string } }) {
//     const { category } = context.params;
//     const apiHost = process.env.API_HOST || 'http://localhost:5130';

//     try {
//         const response = await fetch(`${apiHost}/api/books/category/${category}`, {
//             cache: 'no-store'
//         });

//         if (!response.ok) {
//             return NextResponse.json({ error: 'Category not found' }, { status: 404 });
//         }

//         const books = await response.json();
//         return NextResponse.json(books);
//     } catch /*(error)*/ {

//         return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
//     }
// }