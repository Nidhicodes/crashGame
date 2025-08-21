// app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getCookie } from "@/lib/cookies";

export async function GET(req: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = req.cookies.get("token")?.value;
    console.log("token is ",token)
    if (!token) {
      return NextResponse.json({ error: "Access token required" }, { status: 401 });
    }

    // Call your backend /me endpoint
    const response = await axios.get("http://localhost:5000/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const user = response.data;
    return NextResponse.json(user, { status: 200 });
  } catch (err: any) {
    console.error("Server-side get-user error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data?.error || "Failed to fetch user data" },
      { status: err.response?.status || 500 }
    );
  }
}
