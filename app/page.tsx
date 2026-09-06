import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-semibold mb-3">Book Marketplace</h1>
        <p className="text-gray-600 mb-8">
          Log in or create an account to get started.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="border border-gray-300 bg-white px-5 py-2 rounded-md hover:bg-gray-100"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
