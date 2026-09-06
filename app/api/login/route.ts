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

    const response = await fetch(`${JSON_SERVER_URL}/users`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to reach user store" },
        { status: 502 }
      );
    }

    const users: User[] = await response.json();
    const matchedUser = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!matchedUser) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const { password: _password, ...safeUser } = matchedUser;

    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while logging in" },
      { status: 500 }
    );
  }
}
