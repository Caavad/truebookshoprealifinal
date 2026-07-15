"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Chapter } from "@/helpers/interfaces/books";
import {
  booksApi,
  chaptersApi,
  CreateBookPayload,
  UpdateBookPayload,
} from "@/lib/api";
import { BOOK_CATEGORIES, buildBookPath } from "@/lib/book-categories";

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

const emptyChapterForm = {
  title: "",
  chapterNumber: 1,
  content: "",
};

export default function AuthorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState(emptyBookForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterForm, setChapterForm] = useState(emptyChapterForm);
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [authorMode, setAuthorMode] = useState<"self" | "other">("self");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = session?.accessToken;
  const isAuthor = session?.user?.role === "Author" || session?.user?.role === "Admin";
  const selfAuthorName = session?.user?.name?.trim() || "";

  const subcategories = useMemo(
    () => BOOK_CATEGORIES[form.category] ?? [],
    [form.category]
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin?mode=translator");
      return;
    }
    if (!isAuthor) {
      router.push("/");
      return;
    }
    loadBooks();
  }, [status, session, isAuthor, router]);

  useEffect(() => {
    if (authorMode === "self" && selfAuthorName) {
      setForm((prev) => ({ ...prev, author: selfAuthorName }));
    }
  }, [authorMode, selfAuthorName]);

  async function loadBooks() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await booksApi.getMyBooks(token);
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load books");
    } finally {
      setLoading(false);
    }
  }

  async function loadChapters(bookId: number) {
    try {
      const data = await chaptersApi.getByBook(bookId);
      setChapters(data);
      setSelectedBookId(bookId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chapters");
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
        next.path = buildBookPath(next.category, next.subCategory, next.title || "new-book");
      }
      return next;
    });
  }

  function startEdit(book: Book) {
    setEditingId(book.id);
    const isSelfAuthor =
      !!selfAuthorName &&
      book.author.trim().toLowerCase() === selfAuthorName.toLowerCase();
    setAuthorMode(isSelfAuthor ? "self" : "other");
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
    loadChapters(book.id);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyBookForm);
    setAuthorMode("self");
    setSelectedBookId(null);
    setChapters([]);
    setChapterForm(emptyChapterForm);
    setEditingChapterId(null);
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
        await booksApi.create(token, {
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
        });
      }
      resetForm();
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    }
  }

  async function deleteBook(id: number) {
    if (!token || !confirm("Delete this book?")) return;
    try {
      await booksApi.delete(token, id);
      if (editingId === id) resetForm();
      await loadBooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  }

  async function saveChapter() {
    if (!token || !selectedBookId) return;
    try {
      if (editingChapterId) {
        await chaptersApi.update(token, editingChapterId, chapterForm);
      } else {
        await chaptersApi.create(token, {
          bookId: selectedBookId,
          ...chapterForm,
          chapterNumber: Number(chapterForm.chapterNumber),
        });
      }
      setChapterForm(emptyChapterForm);
      setEditingChapterId(null);
      await loadChapters(selectedBookId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save chapter");
    }
  }

  async function deleteChapter(id: number) {
    if (!token || !selectedBookId || !confirm("Delete this chapter?")) return;
    try {
      await chaptersApi.delete(token, id);
      await loadChapters(selectedBookId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete chapter");
    }
  }

  if (status === "loading" || loading) {
    return <div className="container py-24 text-white text-center">Loading...</div>;
  }

  if (!isAuthor) return null;

  return (
    <div className="container py-10 text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Translator Dashboard</h1>
          <p className="text-zinc-400 mt-1">Publish books as yourself or on behalf of another author</p>
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{editingId ? "Edit book" : "Add book"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => updateFormField("title", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Book author</Label>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="authorMode"
                    checked={authorMode === "self"}
                    onChange={() => setAuthorMode("self")}
                  />
                  Myself ({selfAuthorName || "your name"})
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="authorMode"
                    checked={authorMode === "other"}
                    onChange={() => setAuthorMode("other")}
                  />
                  Another person
                </label>
              </div>
              <Input
                value={form.author}
                disabled={authorMode === "self"}
                placeholder="Author name shown on the book"
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
                  {Object.keys(BOOK_CATEGORIES).map((c) => (
                    <option key={c} value={c}>{c}</option>
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
                  {subcategories.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Cover URL</Label>
              <Input value={form.coverUrl} onChange={(e) => updateFormField("coverUrl", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <textarea
                className="min-h-20 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 w-full"
                value={form.description}
                onChange={(e) => updateFormField("description", e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={saveBook}>{editingId ? "Save" : "Add book"}</Button>
              {editingId && (
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>My books ({books.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[50vh] overflow-y-auto">
            {books.length === 0 ? (
              <p className="text-zinc-400">You have not published any books yet.</p>
            ) : (
              books.map((book) => (
                <div key={book.id} className="rounded-lg border border-zinc-800 p-4 space-y-2">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{book.title}</h3>
                      <p className="text-sm text-zinc-400">by {book.author}</p>
                      <p className="text-sm text-zinc-500">{book.category} / {book.subCategory}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(book)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteBook(book.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {selectedBookId && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Chapters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="Chapter title"
                value={chapterForm.title}
                onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Number"
                value={chapterForm.chapterNumber}
                onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: Number(e.target.value) })}
              />
              <Button onClick={saveChapter}>
                {editingChapterId ? "Update chapter" : "Add chapter"}
              </Button>
            </div>
            <textarea
              className="min-h-32 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
              placeholder="Chapter text..."
              value={chapterForm.content}
              onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })}
            />
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="flex justify-between items-center border border-zinc-800 rounded p-3">
                  <div>
                    <p className="font-medium">{chapter.chapterNumber}. {chapter.title}</p>
                    <p className="text-sm text-zinc-400 line-clamp-1">{chapter.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingChapterId(chapter.id);
                        setChapterForm({
                          title: chapter.title,
                          chapterNumber: chapter.chapterNumber,
                          content: chapter.content,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteChapter(chapter.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
