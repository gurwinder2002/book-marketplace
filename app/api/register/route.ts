import { NextResponse } from "next/server";

const JSON_SERVER_URL = "http://localhost:3001";

type User = {
  id: number;
  userId: string;
  username: string;
  password: string;
  role: string;
};

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const usersResponse = await fetch(`${JSON_SERVER_URL}/users`);

    if (!usersResponse.ok) {
      return NextResponse.json(
        { error: "Unable to reach user store" },
        { status: 502 }
      );
    }

    const users: User[] = await usersResponse.json();
    const usernameTaken = users.some((user) => user.username === username);

    if (usernameTaken) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    const nextId =
      users.reduce((maxId, user) => Math.max(maxId, user.id), 0) + 1;

    const newUser = {
      userId: `user${nextId}`,
      username,
      password,
      role: "user",
    };

    const createResponse = await fetch(`${JSON_SERVER_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!createResponse.ok) {
      return NextResponse.json(
        { error: "Unable to create user" },
        { status: 502 }
      );
    }

    const createdUser: User = await createResponse.json();
    const { password: _password, ...safeUser } = createdUser;

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while registering" },
      { status: 500 }
    );
  }
}
