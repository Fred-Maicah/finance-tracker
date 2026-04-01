import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// 🔹 GET ALL TRANSACTIONS
export async function GET(req: Request) {
  try {
    await connectDB();

    // ✅ READ TOKEN FROM COOKIE
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = verifyToken(token);

    const transactions = await Transaction.find({
      userId: payload.userId,
    }).sort({ date: -1 });

    return NextResponse.json({ transactions });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🔹 CREATE NEW TRANSACTION
export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ READ TOKEN FROM COOKIE
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: any = verifyToken(token);

    const { type, amount, description, category } = await req.json();

    if (!type || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transaction = await Transaction.create({
      userId: payload.userId,
      type,
      amount,
      description,
      category,
    });

    return NextResponse.json({ transaction });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
