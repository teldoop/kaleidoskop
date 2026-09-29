import { NextRequest, NextResponse } from "next/server";
import { admin, currentUser } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const user = await currentUser(); // ID user diambil dari sesi, bukan dari frontend
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { memberId } = await req.json();
  if (!memberId) return NextResponse.json({ error: "memberId wajib" }, { status: 400 });
  const db = admin();
  await db.storage.from("photos").remove([`${user.id}/${memberId}`]);
  const { error } = await db.from("photos").delete().eq("user_id", user.id).eq("member_id", memberId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
