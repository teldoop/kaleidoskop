"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, LogOut, Users } from "lucide-react";
import Avatar from "@/components/avatar";
import Button from "@/components/button";
import ConfirmModal from "@/components/confirm-modal"; // <-- Import komponen reusable
import { useAccount } from "@/lib/use-account";

const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-amber-900/15 dark:bg-white/10 ${className}`} />
);

export default function Home() {
  const { me, logout } = useAccount();
  const [stat, setStat] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/members?mode=all")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setStat({ total: d.members.length, done: d.members.filter((m: { photoLink: string | null }) => m.photoLink).length }))
      .catch(() => setError(true));
  }, []);

  const handleLogout = async () => {
    try {
      setBusy(true);
      await logout();
    } finally {
      setBusy(false);
      setShowLogoutConfirm(false);
    }
  };

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
        
        {/* Tombol logout mobile memicu modal konfirmasi */}
        <Button variant="outline" onClick={() => setShowLogoutConfirm(true)} className="shrink-0">
          <LogOut size={16} aria-hidden />Keluar
        </Button>
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

      {/* Modal Konfirmasi Logout Reusable */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Keluar Akun"
        message="Apakah Anda yakin ingin keluar dari sesi ini?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        busy={busy}
        onConfirm={handleLogout}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}