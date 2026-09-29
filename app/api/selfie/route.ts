import { NextRequest, NextResponse } from "next/server";
import { admin, currentUser } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  const memberId = form.get("memberId");
  if (!(file instanceof File) || typeof memberId !== "string" || !file.type.startsWith("image/"))
    return NextResponse.json({ error: "File atau ID member tidak valid" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Maksimal 8MB" }, { status: 413 });

  const db = admin();
  const path = `${user.id}/${memberId}`; // upsert => foto lama otomatis tergantikan
  const up = await db.storage.from("photos").upload(path, await file.arrayBuffer(), { upsert: true, contentType: file.type });
  if (up.error) return NextResponse.json({ error: up.error.message }, { status: 500 });

  const photoLink = `${db.storage.from("photos").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
  const { error } = await db.from("photos").upsert({ user_id: user.id, member_id: memberId, photo_link: photoLink });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photoLink });
}
