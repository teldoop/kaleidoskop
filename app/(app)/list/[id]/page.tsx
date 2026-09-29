"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Download, Loader2, RefreshCw, Trash2 } from "lucide-react";
import Button from "@/components/button";
import ConfirmModal from "@/components/confirm-modal"; // <-- Import komponen reusable

type M = { id: string; nama: string; nim: string; cluster: number; photoLink: string | null };

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [m, setM] = useState<M | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/members?id=${id}`).then((r) => r.json()).then((d) => (d.members?.[0] ? setM(d.members[0]) : router.replace("/404")));
  }, [id, router]);

  const remove = async () => {
    setBusy(true);
    const r = await fetch("/api/deletePhoto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ memberId: id }) });
    setBusy(false); setConfirm(false);
    if (r.ok) setM((x) => x && { ...x, photoLink: null });
  };
  
  const download = async () => {
    const blob = await (await fetch(m!.photoLink!)).blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `${m!.nama}.jpg`; a.click(); URL.revokeObjectURL(a.href);
  };

  if (!m) return <p className="flex items-center gap-2 text-amber-700 dark:text-amber-300"><Loader2 size={18} className="animate-spin" aria-hidden />Memuat...</p>;
  
  return (
    <div className="mx-auto max-w-md">
      <Button href="/list" variant="outline" className="mb-4"><ArrowLeft size={16} aria-hidden />Kembali</Button>
      <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow dark:border-amber-400/20 dark:bg-zinc-900 dark:shadow-none">
        <h1 className="text-2xl font-extrabold capitalize text-amber-900 dark:text-amber-100">{m.nama.replace(/-/g, " ")}</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">NIM {m.nim} · Cluster {m.cluster}</p>
        {m.photoLink && <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={m.photoLink} alt={m.nama} className="mt-4 w-full rounded-2xl object-cover" />}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button href={`/take?id=${m.id}`}>
            {m.photoLink ? <><RefreshCw size={16} aria-hidden />Ganti foto</> : <><Camera size={16} aria-hidden />Ambil foto</>}
          </Button>
          {m.photoLink && <>
            <Button variant="outline" onClick={download}><Download size={16} aria-hidden />Download</Button>
            <Button variant="danger" onClick={() => setConfirm(true)}><Trash2 size={16} aria-hidden />Hapus foto</Button>
          </>}
        </div>
      </div>

      {/* Menggunakan ConfirmModal yang reusable */}
      <ConfirmModal
        isOpen={confirm}
        title="Hapus Foto"
        message="Apakah Anda yakin ingin menghapus foto anggota ini?"
        confirmText="Ya, Hapus"
        cancelText="Tidak"
        busy={busy}
        onConfirm={remove}
        onClose={() => setConfirm(false)}
      />
    </div>
  );
}