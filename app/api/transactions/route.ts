import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token) as { userId: string }; // ✅ Correct

  const { type, amount, description } = await req.json();

  if (!type || !amount) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const transaction = await Transaction.create({
    userId: decoded.userId,
    type,
    amount,
    description,
  });

  return Response.json({ transaction });
}

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: string };
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }
    
    const transactions = await Transaction.find({ userId: decoded.userId }).sort({ date: -1 });

    return Response.json({ transactions });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
