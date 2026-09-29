"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Circle, CircleCheck } from "lucide-react";

type M = { id: string; nama: string; nim: string; cluster: number; photoLink: string | null };

const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-amber-900/15 dark:bg-white/10 ${className}`} />
);

function ListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat daftar">
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, i) => <Bone key={i} className="h-8 w-20 rounded-full" />)}
      </div>
      {[0, 1].map((s) => (
        <section key={s} className="mt-6">
          <Bone className="mb-3 h-5 w-24" />
          <div className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-amber-100 bg-white p-3 dark:border-amber-400/15 dark:bg-zinc-900">
                <div className="space-y-2"><Bone className="h-3.5 w-36" /><Bone className="h-3 w-24" /></div>
                <Bone className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function List() {
  const [members, setMembers] = useState<M[] | null>(null); // null = masih memuat
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<number | "Semua">("Semua");

  useEffect(() => {
    fetch("/api/members?mode=all")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setMembers(d.members ?? []))
      .catch(() => { setError(true); setMembers([]); });
  }, []);

  const list = members ?? [];
  const clusters = [...new Set(list.map((m) => m.cluster))].sort((a, b) => a - b);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100">Daftar TIF UB&apos;26</h1>
      {members === null ? (
        <ListSkeleton />
      ) : error ? (
        <p className="mt-6 text-sm text-red-600 dark:text-red-300">Gagal memuat data. Coba muat ulang halaman.</p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["Semua", ...clusters] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === c
                    ? "bg-amber-400 text-amber-950"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:hover:bg-amber-400/20"
                }`}
              >
                {c === "Semua" ? c : `Cluster ${c}`}
              </button>
            ))}
          </div>
          {clusters.filter((c) => filter === "Semua" || c === filter).map((c) => (
            <section key={c} className="mt-6">
              <h2 className="mb-2 font-bold text-amber-700 dark:text-amber-400">Cluster {c}</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {list.filter((m) => m.cluster === c).map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}>
                    <Link
                      href={`/list/${m.id}`}
                      className="flex items-center justify-between rounded-xl border border-amber-100 bg-white p-3 hover:border-amber-300 hover:shadow dark:border-amber-400/15 dark:bg-zinc-900 dark:hover:border-amber-400/50 dark:hover:shadow-none"
                    >
                      <span>
                        <span className="block text-sm font-semibold capitalize">{m.nama.replace(/-/g, " ")}</span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">{m.nim}</span>
                      </span>
                      <span title={m.photoLink ? "Sudah difoto" : "Belum difoto"}>
                        {m.photoLink
                          ? <CircleCheck size={20} aria-label="Sudah difoto" className="text-green-600 dark:text-green-400" />
                          : <Circle size={20} aria-label="Belum difoto" className="text-zinc-300 dark:text-zinc-600" />}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}