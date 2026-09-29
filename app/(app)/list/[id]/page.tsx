"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Camera, Download, Loader2, RefreshCw, Trash2, TriangleAlert } from "lucide-react";
import Button from "@/components/button";
import { prodiLabel } from "@/lib/prodi";

type M = { id: string; nama: string; nim: string; cluster: number; prodi: string; photoLink: string | null };

const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-amber-900/15 dark:bg-white/10 ${className}`} />
);

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-md" aria-busy="true" aria-label="Memuat detail anggota">
      <Bone className="mb-4 h-10 w-28 rounded-xl" />
      <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow dark:border-amber-400/20 dark:bg-zinc-900 dark:shadow-none">
        <Bone className="h-7 w-3/4" />
        <Bone className="mt-3 h-4 w-1/2" />
        <Bone className="mt-4 h-72 w-full rounded-2xl" />
        <div className="mt-5 flex gap-2">
          <Bone className="h-10 w-28 rounded-xl" />
          <Bone className="h-10 w-28 rounded-xl" />
          <Bone className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [m, setM] = useState<M | null>(null);
  const [mine, setMine] = useState<string | null>(null); // prodi akun yang login
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/members?id=${id}`).then((r) => r.json()).then((d) => {
      if (d.members?.[0]) { setM(d.members[0]); setMine(d.prodi); } else router.replace("/404");
    });
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

  if (!m) return <DetailSkeleton />;
  if (mine && m.prodi !== mine)
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-amber-200 bg-white p-6 text-center shadow dark:border-amber-400/20 dark:bg-zinc-900 dark:shadow-none">
          <TriangleAlert size={40} aria-hidden className="mx-auto text-amber-500 dark:text-amber-400" />
          <p className="mt-4 font-semibold">
            <span className="capitalize">{m.nama.replace(/-/g, " ")}</span> dari program studi {prodiLabel(m.prodi)}, jadi Anda tidak bisa mengambil foto selfie.
          </p>
          <Button href="/list" className="mt-6"><ArrowLeft size={16} aria-hidden />Kembali</Button>
        </div>
      </div>
    );

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
      <AnimatePresence>
        {confirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4 dark:bg-black/60">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-sm rounded-2xl bg-white p-6 dark:border dark:border-amber-400/20 dark:bg-zinc-900">
              <p className="font-semibold">Apakah Anda ingin menghapus?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirm(false)}>Tidak</Button>
                <Button variant="danger" onClick={remove} disabled={busy}>
                  {busy ? <><Loader2 size={16} className="animate-spin" aria-hidden />Menghapus...</> : "Ya"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}