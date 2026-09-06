// register page
// login page when loggin in a another router is created named /dashboard
// in dashboard use CRUD operations of the products i have listed

// Allows this component to use browser interactions like onClick, onChange, and useState

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Books() {
  const [searchBook, setSearchBook] = useState("hello");
  const [cartBooks, setCartBooks] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    // Async function that gets the books from our API
    async function fetchBooks() {
      // Send request to JSON Server and wait for the response
      const response = await fetch("http://localhost:3001/books");

      // Convert the JSON response into usable JavaScript data
      const data = await response.json();

      setBooks(data);
    }
    fetchBooks();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search books..."
          onChange={(e) => setSearchBook(e.target.value)}
          className="w-80 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {books
          .filter((book) =>
            book.name.toLowerCase().includes(searchBook.toLowerCase())
          )
          .map((book) => (
            <div
              key={book.id}
              className="w-72 min-h-64 border border-gray-200 rounded-lg p-5 shadow-sm bg-white flex flex-col"
            >
              <h2 className="text-lg font-semibold mb-2">{book.name}</h2>

              <p className="text-gray-600 mb-1">{book.author}</p>

              <p className="text-sm text-gray-500 mb-1">{book.category}</p>

              <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>

              <div className="flex justify-center mt-auto pt-4 gap-3">
                <button
                  onClick={() => {
                    setCartBooks([...cartBooks, book]);
                  }}
                  className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
                >
                  Add
                </button>

                <Link
                  href={`/books/${book.id}`}
                  className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 cursor-pointer"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
      </div>

      {cartBooks.length > 0 && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Cart</h2>

            <button
              onClick={() => setCartBooks([])}
              className="text-xl cursor-pointer"
            >
              ❌
            </button>
          </div>

          <div className="mt-6">
            {cartBooks.map((list) => (
              <p key={list.id} className="mb-3">
                {list.name}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
