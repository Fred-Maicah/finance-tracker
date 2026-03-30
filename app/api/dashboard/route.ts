import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "No token" }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    return Response.json({
      message: "Welcome to dashboard 🎉",
      user: decoded,
    });

  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
