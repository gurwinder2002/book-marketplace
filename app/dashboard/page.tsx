"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const JSON_SERVER_URL = "http://localhost:3001";

type CurrentUser = {
  id: number | string;
  userId: string;
  username: string;
  role: string;
};

type Book = {
  id: string;
  name: string;
  author: string;
  category: string;
  isbn: string;
  userId: string;
};

const emptyForm = {
  name: "",
  author: "",
  category: "",
  isbn: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchUserBooks(user.userId);
  }, [user]);

  async function fetchUserBooks(userId: string) {
    const response = await fetch(
      `${JSON_SERVER_URL}/books?userId=${encodeURIComponent(userId)}`
    );
    const data = await response.json();
    setBooks(data);
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    router.push("/login");
  }

  function startEditing(book: Book) {
    setEditingBookId(book.id);
    setForm({
      name: book.name,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
    });
    setError("");
  }

  function resetForm() {
    setEditingBookId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ...form,
        userId: user.userId,
      };

      const response = editingBookId
        ? await fetch(`${JSON_SERVER_URL}/books/${editingBookId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingBookId, ...payload }),
          })
        : await fetch(`${JSON_SERVER_URL}/books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        setError(
          editingBookId ? "Unable to update book" : "Unable to add book"
        );
        return;
      }

      resetForm();
      await fetchUserBooks(user.userId);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(bookId: string) {
    if (!user) {
      return;
    }

    const confirmed = window.confirm("Delete this book?");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`${JSON_SERVER_URL}/books/${bookId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Unable to delete book");
      return;
    }

    if (editingBookId === bookId) {
      resetForm();
    }

    await fetchUserBooks(user.userId);
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">{user.username}</span>.
              Manage your books below.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/books"
              className="border border-gray-300 bg-white px-5 py-2 rounded-md hover:bg-gray-100"
            >
              Browse books
            </Link>
            <button
              onClick={handleLogout}
              className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>

        <section className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingBookId ? "Edit book" : "Add a book"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-1">
                Author
              </label>
              <input
                id="author"
                type="text"
                value={form.author}
                onChange={(event) =>
                  setForm({ ...form, author: event.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Category
              </label>
              <input
                id="category"
                type="text"
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label htmlFor="isbn" className="block text-sm font-medium mb-1">
                ISBN
              </label>
              <input
                id="isbn"
                type="text"
                value={form.isbn}
                onChange={(event) =>
                  setForm({ ...form, isbn: event.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            {error && (
              <p className="sm:col-span-2 text-sm text-red-600">{error}</p>
            )}

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 cursor-pointer disabled:opacity-60"
              >
                {isSaving
                  ? "Saving..."
                  : editingBookId
                    ? "Update book"
                    : "Add book"}
              </button>
              {editingBookId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 bg-white px-5 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Your books ({books.length})
          </h2>

          {books.length === 0 ? (
            <p className="text-gray-600">
              You have not added any books yet. Use the form above to create
              one.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="w-72 min-h-64 border border-gray-200 rounded-lg p-5 shadow-sm bg-white flex flex-col"
                >
                  <h3 className="text-lg font-semibold mb-2">{book.name}</h3>
                  <p className="text-gray-600 mb-1">{book.author}</p>
                  <p className="text-sm text-gray-500 mb-1">{book.category}</p>
                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>

                  <div className="flex justify-center mt-auto pt-4 gap-3">
                    <button
                      onClick={() => startEditing(book)}
                      className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="border border-gray-300 bg-white px-5 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
