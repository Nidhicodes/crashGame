// app/api/users/apply-referral/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { referralCode } = await req.json();

    if (!referralCode) {
      return NextResponse.json({ error: "Referral code required" }, { status: 400 });
    }

    // Get token from incoming cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Access token required" }, { status: 401 });
    }

    // Forward request to backend with Authorization header
    const response = await axios.post(
      "http://localhost:5000/api/referral/apply-referral",
      { referralCode },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // pass token here
        },
      }
    );

    return NextResponse.json({ message: response.data.message }, { status: 200 });
  } catch (err: any) {
    console.error("Server-side apply-referral error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.error || "Failed to apply referral code" },
      { status: err.response?.status || 500 }
    );
  }
}
