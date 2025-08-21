// app/api/connect/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { setCookie } from "@/lib/cookies";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    // Call backend login API
    const response = await axios.post(
      "http://localhost:5000/api/users/login",
      { walletAddress },
      { headers: { "Content-Type": "application/json" } }
    );

    const { user, token } = response.data;

    const res = NextResponse.json({ user });
    setCookie(res, "token", token); // ✅ use helper instead of manual cookie set

    return res;
  } catch (err: any) {
    console.error("Server-side login error:", err.response?.data || err.message);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
