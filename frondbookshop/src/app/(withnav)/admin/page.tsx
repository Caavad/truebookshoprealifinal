"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book } from "@/helpers/interfaces/books";
import {
  booksApi,
  CreateBookPayload,
  OrderDto,
  UpdateBookPayload,
  UserDto,
  usersApi,
} from "@/lib/api";
import {
  BOOK_CATEGORIES,
  buildBookPath,
} from "@/lib/book-categories";

type Tab = "books" | "users";

const emptyBookForm = {
  title: "",
  author: "",
  description: "",
  coverUrl: "",
  path: "",
  category: "Programming",
  subCategory: "backend",
  content: "",
  rating: 5,
  stockCount: 10,
  price: 15,
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState<
    Record<number, OrderDto[]>
  >({});
  const [form, setForm] = useState(emptyBookForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = session?.accessToken;
  const isAdmin = session?.user?.role === "Admin";

  const subcategories = useMemo(
    () => BOOK_CATEGORIES[form.category] ?? [],
    [form.category]
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (!isAdmin) {
      router.push("/");
      return;
    }
    loadData();
  }, [status, session, isAdmin, router]);

  async function loadData() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [booksData, usersData] = await Promise.all([
        booksApi.getAll(),
        usersApi.getAll(token),
      ]);
      setBooks(booksData);
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  function updateFormField<K extends keyof typeof emptyBookForm>(
    key: K,
    value: (typeof emptyBookForm)[K]
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "category") {
        const subs = BOOK_CATEGORIES[value as string] ?? [];
        next.subCategory = subs[0] ?? "";
      }
      if (["title", "category", "subCategory"].includes(key)) {
        next.path = buildBookPath(
          next.category,
          next.subCategory,
          next.title || "new-book"
        );
      }
      return next;
    });
  }

  function startEdit(book: Book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      coverUrl: book.coverUrl,
      path: book.path,
      category: book.category,
      subCategory: book.subCategory || "",
      content: book.content || "",
      rating: book.rating,
      stockCount: book.stockCount,
      price: book.formats?.[0]?.price ?? 15,
    });
    setTab("books");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyBookForm);
  }

  async function saveBook() {
    if (!token) return;
    setError("");

    const payload: CreateBookPayload | UpdateBookPayload = {
      title: form.title,
      author: form.author,
      description: form.description,
      coverUrl: form.coverUrl,
      path: form.path || buildBookPath(form.category, form.subCategory, form.title),
      category: form.category,
      subCategory: form.subCategory,
      content: form.content,
      rating: Number(form.rating),
      stockCount: Number(form.stockCount),
    };

    try {
      if (editingId) {
        await booksApi.update(token, editingId, payload);
      } else {
        const createPayload: CreateBookPayload = {
          ...payload,
          formats: [
            {
              format: "Ebook",
              language: "en",
              price: Number(form.price),
              coverUrl: form.coverUrl,
              stockCount: Number(form.stockCount),
              fileSizeMB: 5,
            },
          ],
        };
        await booksApi.create(token, createPayload);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    }
  }

  async function deleteBook(id: number) {
    if (!token || !confirm("Delete this book?")) return;
    try {
      await booksApi.delete(token, id);
      if (editingId === id) resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  }

  async function deleteUser(id: number) {
    if (!token || !confirm("Deactivate this user?")) return;
    try {
      await usersApi.delete(token, id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  async function loadUserOrders(userId: number) {
    if (!token) return;
    if (selectedUserOrders[userId]) {
      setSelectedUserOrders((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
      return;
    }

    try {
      const orders = await usersApi.getOrders(token, userId);
      setSelectedUserOrders((prev) => ({ ...prev, [userId]: orders }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user orders");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container py-24 text-white text-center">Loading admin panel...</div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container py-10 text-white space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-zinc-400 mt-1">Manage books and users</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Back to store</Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant={tab === "books" ? "default" : "outline"}
          onClick={() => setTab("books")}
        >
          Books
        </Button>
        <Button
          variant={tab === "users" ? "default" : "outline"}
          onClick={() => setTab("users")}
        >
          Users
        </Button>
      </div>

      {tab === "books" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>{editingId ? "Edit book" : "Add book"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => updateFormField("title", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => updateFormField("author", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Genre</Label>
                  <select
                    className="h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3"
                    value={form.category}
                    onChange={(e) => updateFormField("category", e.target.value)}
                  >
                    {Object.keys(BOOK_CATEGORIES).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Subgenre</Label>
                  <select
                    className="h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3"
                    value={form.subCategory}
                    onChange={(e) => updateFormField("subCategory", e.target.value)}
                  >
                    {subcategories.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Cover URL</Label>
                <Input
                  value={form.coverUrl}
                  onChange={(e) => updateFormField("coverUrl", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Path</Label>
                <Input
                  value={form.path}
                  onChange={(e) => updateFormField("path", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <textarea
                  className="min-h-24 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={form.description}
                  onChange={(e) => updateFormField("description", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Book text (for Read page)</Label>
                <textarea
                  className="min-h-40 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                  value={form.content}
                  onChange={(e) => updateFormField("content", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) => updateFormField("rating", Number(e.target.value))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.stockCount}
                    onChange={(e) =>
                      updateFormField("stockCount", Number(e.target.value))
                    }
                  />
                </div>
                {!editingId && (
                  <div className="grid gap-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.price}
                      onChange={(e) => updateFormField("price", Number(e.target.value))}
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button onClick={saveBook}>
                  {editingId ? "Save changes" : "Add book"}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Books ({books.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[80vh] overflow-y-auto">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="rounded-lg border border-zinc-800 p-4 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-sm text-zinc-400">
                        {book.category}
                        {book.subCategory ? ` / ${book.subCategory}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/read/${book.id}`}>Read</Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/author?bookId=${book.id}`}>Chapters</Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => startEdit(book)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBook(book.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {book.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "users" && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border border-zinc-800 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {user.firstName} {user.lastName} ({user.username})
                    </h3>
                    <p className="text-sm text-zinc-400">{user.email}</p>
                    <p className="text-sm text-zinc-500">
                      Role: {user.role} · Active: {user.isActive ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadUserOrders(user.id)}
                    >
                      {selectedUserOrders[user.id] ? "Hide books" : "Show books"}
                    </Button>
                    {user.role !== "Admin" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                {selectedUserOrders[user.id] && (
                  <div className="rounded-md bg-zinc-950 p-3 space-y-2">
                    {selectedUserOrders[user.id].length === 0 ? (
                      <p className="text-sm text-zinc-400">No purchased books yet.</p>
                    ) : (
                      selectedUserOrders[user.id].map((order) => (
                        <div key={order.id} className="text-sm">
                          <p className="text-zinc-300">
                            Order #{order.orderNumber} — {order.status}
                          </p>
                          <ul className="list-disc pl-5 text-zinc-400">
                            {order.orderItems.map((item) => (
                              <li key={item.id}>
                                {item.bookTitle} ({item.bookFormat}) x{item.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
