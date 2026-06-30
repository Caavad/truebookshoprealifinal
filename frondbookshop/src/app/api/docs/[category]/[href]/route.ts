export {};
// import { products } from "@/data/sub-products";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: { href: string } }) {
//     const { href } = params;

//     const filteredProducts = products.filter((product) => product.subcategory === href)

//     if (!filteredProducts) {
//         return NextResponse.json({ error: "Category not found" }, { status: 404 })
//     }

//     return NextResponse.json(filteredProducts)
// }
