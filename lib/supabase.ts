import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const admin = () => createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function currentUser() {
  const store = await cookies();
  const sb = createServerClient(URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (l) => { try { l.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {} },
    },
  });
  return (await sb.auth.getUser()).data.user;
}

/** Prodi akun yang login (dari tabel profiles); null jika belum memilih. */
export async function getProdi(userId: string): Promise<string | null> {
  const { data } = await admin().from("profiles").select("prodi").eq("user_id", userId).maybeSingle();
  return data?.prodi ?? null;
}
