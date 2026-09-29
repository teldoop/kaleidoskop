import { NextRequest, NextResponse } from "next/server";
import { admin, currentUser } from "@/lib/supabase";

// ?mode=all -> semua | ?q=... -> pencarian (maks 10) | ?id=... -> satu member
export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = req.nextUrl.searchParams;
  const db = admin();
  let query = db.from("members").select("id,nama,nim,cluster").order("cluster").order("nama");
  if (p.get("id")) query = query.eq("id", p.get("id")!);
  else if (p.get("mode") !== "all") {
    const q = (p.get("q") ?? "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (q) query = query.or(`nama.ilike.*${q}*,nim.ilike.*${q}*`);
    query = query.limit(10);
  }
  const [{ data: members, error }, { data: photos }] = await Promise.all([
    query,
    db.from("photos").select("member_id,photo_link").eq("user_id", user.id),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map = new Map<string, string>((photos ?? []).map((x): [string, string] => [x.member_id, x.photo_link]));
  return NextResponse.json({ members: members!.map((m) => ({ ...m, photoLink: map.get(m.id) ?? null })) });
}
