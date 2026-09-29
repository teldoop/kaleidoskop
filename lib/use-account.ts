"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "./supabase-browser";

export type Profile = { name: string; email: string; avatar?: string };

/** Data akun Google yang sedang login (null = masih memuat) + fungsi keluar. */
export function useAccount() {
  const router = useRouter();
  const [me, setMe] = useState<Profile | null>(null);

  useEffect(() => {
    supabaseBrowser().auth.getUser().then(({ data: { user } }) => {
      const m = user?.user_metadata ?? {};
      setMe({
        name: m.full_name ?? m.name ?? user?.email?.split("@")[0] ?? "Pengguna",
        email: user?.email ?? "",
        avatar: m.avatar_url ?? m.picture,
      });
    });
  }, []);

  const logout = async () => { await supabaseBrowser().auth.signOut(); router.replace("/login"); };
  return { me, logout };
}