import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXPLORER_KEYS = ["q", "city", "tag", "tags", "price", "open", "near", "sort", "saved", "guide"];

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === "/") {
    const hasFilter = EXPLORER_KEYS.some((k) => searchParams.has(k)) || searchParams.size > 0;
    if (hasFilter) {
      const url = request.nextUrl.clone();
      url.pathname = "/explore";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
