"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type TestUser = {
  id: string;
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3001/users");
        const users = await response.json();
        setTestUsers(users);
      } catch {
        setTestUsers([]);
      }
    }

    fetchUsers();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to log in");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md border border-gray-200 rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Log in</h1>
        <p className="text-gray-600 mb-6">
          Sign in to continue to your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {testUsers.length > 0 && (
            <div>
              <label
                htmlFor="test-user"
                className="block text-sm font-medium mb-1"
              >
                Quick fill (testing)
              </label>
              <select
                id="test-user"
                value={selectedUserId}
                onChange={(event) => {
                  const userId = event.target.value;
                  setSelectedUserId(userId);

                  const selectedUser = testUsers.find(
                    (user) => user.id === userId
                  );

                  if (selectedUser) {
                    setUsername(selectedUser.username);
                    setPassword(selectedUser.password);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                <option value="">Select a user</option>
                {testUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Need an account?{" "}
          <Link href="/register" className="text-black underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
