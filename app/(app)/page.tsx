"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftRight, Camera, Clock, LogOut, Users } from "lucide-react";
import Avatar from "@/components/avatar";
import Button from "@/components/button";
import { useAccount } from "@/lib/use-account";
import { prodiLabel } from "@/lib/prodi";
import { timeAgo } from "@/lib/time";

const RECENT_LIMIT = 10;
type Member = { id: string; nama: string; nim: string; cluster: number; photoLink: string | null; photoAt: string | null };
type Recent = Omit<Member, "photoLink" | "photoAt"> & { photoLink: string; photoAt: string };

const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-amber-900/15 dark:bg-white/10 ${className}`} />
);

export default function Home() {
  const { me, logout } = useAccount();
  const [stat, setStat] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState(false);
  const [prodi, setProdi] = useState<string | null>(null);
  const [recent, setRecent] = useState<Recent[] | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => { // perbarui keterangan waktu tiap menit
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch("/api/members?mode=all")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setProdi(d.prodi);
        setStat({ total: d.members.length, done: d.members.filter((m: { photoLink: string | null }) => m.photoLink).length });
        setRecent(
          (d.members as Member[])
            .filter((m): m is Recent => !!m.photoLink && !!m.photoAt)
            .sort((a, b) => Date.parse(b.photoAt) - Date.parse(a.photoAt))
            .slice(0, RECENT_LIMIT),
        );
      })
      .catch(() => setError(true));
  }, []);

  const pct = stat && stat.total ? Math.round((stat.done / stat.total) * 100) : 0;
  const loading = !stat && !error;

  return (
    <div className="mx-auto max-w-xl">
      
      <h1 className="text-3xl font-extrabold text-amber-900 dark:text-amber-100">Aplikasi Kaleidoskop</h1>
      <p className="mt-1 text-amber-700 dark:text-amber-300/80">Aplikasi untuk foto tugas Kaleidoskop INTRIVIA 2026</p>

      <div className="mt-8 flex items-center gap-3 md:hidden">
        {me === null ? (
          <>
            <Bone className="h-11 w-11 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2"><Bone className="h-3.5 w-32" /><Bone className="h-3 w-44" /></div>
          </>
        ) : (
          <>
            <Avatar src={me.avatar} size={44} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-amber-950 dark:text-amber-50" title={me.name}>{me.name}</p>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400" title={me.email}>{me.email}</p>
            </div>
          </>
        )}
        <Button variant="outline" onClick={logout} className="shrink-0"><LogOut size={16} aria-hidden />Keluar</Button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-white p-4 dark:border-amber-400/20 dark:bg-zinc-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Prodi Anda</p>
          {prodi ? <p className="text-lg font-bold text-amber-950 dark:text-amber-50">{prodiLabel(prodi)}</p> : error ? <p className="text-lg font-bold">–</p> : <Bone className="mt-1 h-6 w-40" />}
        </div>
        <Button href="/pilih-prodi" variant="outline"><ArrowLeftRight size={16} aria-hidden />Ganti</Button>
      </div>

      <div className="mt-8 rounded-3xl bg-gradient-to-br from-amber-300 to-yellow-200 p-8 shadow-lg dark:border dark:border-amber-400/20 dark:from-amber-500/25 dark:to-yellow-400/10 dark:shadow-none">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Sudah difoto</p>
        {loading ? (
          <Bone className="mt-3 h-14 w-44" />
        ) : (
          <p className="mt-1 text-6xl font-black text-amber-950 dark:text-amber-50">
            {stat ? stat.done : "–"}
            <span className="text-2xl font-semibold text-amber-800 dark:text-amber-300"> / {stat?.total ?? "–"}</span>
          </p>
        )}
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/60 dark:bg-white/10">
          {loading ? (
            <Bone className="h-full w-1/3 rounded-full" />
          ) : (
            <motion.div className="h-full rounded-full bg-amber-500 dark:bg-amber-400" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
          )}
        </div>
        {loading ? (
          <Bone className="ml-auto mt-3 h-4 w-10" />
        ) : (
          <p className="mt-2 text-right text-sm font-semibold text-amber-900 dark:text-amber-200">{error ? "Gagal memuat data" : `${pct}%`}</p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Button href="/take"><Camera size={16} aria-hidden />Ambil Foto</Button>
        <Button href="/list" variant="outline"><Users size={16} aria-hidden />Lihat Daftar</Button>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-amber-900 dark:text-amber-100"><Clock size={18} aria-hidden />Aktivitas Foto Terbaru</h2>
        {recent === null && !error ? (
          <div className="space-y-2" aria-busy="true" aria-label="Memuat aktivitas">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-white p-3 dark:border-amber-400/15 dark:bg-zinc-900">
                <div className="space-y-2"><Bone className="h-3.5 w-36" /><Bone className="h-3 w-44" /><Bone className="h-3 w-24" /></div>
                <Bone className="h-14 w-14 shrink-0 rounded-xl" />
              </div>
            ))}
          </div>
        ) : recent && recent.length > 0 ? (
          <ul className="space-y-2">
            {recent.map((r, i) => (
              <motion.li key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.4) }}>
                <Link href={`/list/${r.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-white p-3 hover:border-amber-300 dark:border-amber-400/15 dark:bg-zinc-900 dark:hover:border-amber-400/50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold capitalize">{r.nama.replace(/-/g, " ")}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{r.nim} · Cluster {r.cluster}</p>
                    <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">{timeAgo(r.photoAt, now)}</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.photoLink} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                </Link>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{error ? "Gagal memuat aktivitas." : "Belum ada foto yang diambil."}</p>
        )}
      </section>
    </div>
  );
}