import { NextRequest, NextResponse } from "next/server";
import { admin, currentUser, getProdi } from "@/lib/supabase";

// Daftar/pencarian selalu dibatasi ke prodi akun yang login.
// ?id= (halaman detail) mengembalikan anggota apa pun beserta prodinya, supaya UI bisa memberi pesan bila beda prodi.
// ?mode=all -> semua | ?q=... -> pencarian (maks 10)
export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const prodi = await getProdi(user.id);
  if (!prodi) return NextResponse.json({ error: "Prodi belum dipilih" }, { status: 403 });

  const p = req.nextUrl.searchParams;
  const db = admin();
  let query = db.from("members").select("id,nama,nim,cluster,prodi").order("cluster").order("nama");
  if (p.get("id")) query = query.eq("id", p.get("id")!);
  else {
    query = query.eq("prodi", prodi);
    if (p.get("mode") !== "all") {
      const q = (p.get("q") ?? "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (q) query = query.or(`nama.ilike.*${q}*,nim.ilike.*${q}*`);
      query = query.limit(10);
    }
  }
  const [{ data: members, error }, { data: photos, error: photoError }] = await Promise.all([
    query,
    db.from("photos").select("member_id,photo_link,updated_at").eq("user_id", user.id),
  ]);
  const failure = error ?? photoError; // mis. kolom photos.updated_at belum ada -> jangan gagal diam-diam
  if (failure) return NextResponse.json({ error: failure.message }, { status: 500 });
  const map = new Map((photos ?? []).map((x) => [x.member_id, x] as const));
  return NextResponse.json({
    prodi,
    members: members!.map((m) => {
      const ph = m.prodi === prodi ? map.get(m.id) : undefined;
      return { ...m, photoLink: ph?.photo_link ?? null, photoAt: ph?.updated_at ?? null };
    }),
  });
}