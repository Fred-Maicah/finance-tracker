import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: false, // change to true in production
    path: "/",
    maxAge: 0, // 🔥 deletes cookie
  });

  return new Response(
    JSON.stringify({ message: "Logged out" }),
    {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    }
  );
}
