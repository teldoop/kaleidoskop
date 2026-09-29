import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const res = NextResponse.redirect(new URL("/", req.url));
  if (code) {
    const store = await cookies();
    const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (l) => l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    });
    await sb.auth.exchangeCodeForSession(code);
  }
  return res;
}
