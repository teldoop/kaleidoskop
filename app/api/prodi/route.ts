import { NextRequest, NextResponse } from "next/server";
import { admin, currentUser, getProdi } from "@/lib/supabase";
import { PRODI } from "@/lib/prodi";

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ prodi: await getProdi(user.id) });
}

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { prodi } = await req.json();
  if (!PRODI.some((p) => p.value === prodi)) return NextResponse.json({ error: "Prodi tidak valid" }, { status: 400 });
  const { error } = await admin().from("profiles").upsert({ user_id: user.id, prodi });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ prodi });
}
