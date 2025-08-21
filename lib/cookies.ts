// lib/cookies.ts
import { NextResponse } from "next/server";

export function setCookie(res: NextResponse, name: string, value: string, days = 7) {
  res.cookies.set(name, value, {
    httpOnly: false,
    secure: false,
    path: "/",
    maxAge: days * 24 * 60 * 60,
  });
}

export function deleteCookie(res: NextResponse, name: string) {
  res.cookies.set(name, "", { maxAge: 0, path: "/" });
}

// client-side
export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
