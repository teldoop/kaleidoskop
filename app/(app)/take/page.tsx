"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, CircleCheck, FlipVertical2, ImagePlus, Loader2, RefreshCw, SwitchCamera, Upload, X, UploadCloud, Zap, ZapOff } from "lucide-react";
import Button from "@/components/button";
import ConfirmModal from "@/components/confirm-modal"; // sesuaikan path-nya
import Dropdown, { type Option } from "@/components/dropdown";

type M = { id: string; nama: string; nim: string; photoLink?: string | null };
const toOpt = (m: M): Option => ({ value: m.id, label: m.nama.replace(/-/g, " "), hint: m.nim, done: !!m.photoLink });

async function shrink(blob: Blob, max = 1600): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
    const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise<Blob>((res) => c.toBlob((b) => res(b ?? blob), "image/jpeg", 0.85));
  } catch { return blob; }
}

function Take() {
  const sp = useSearchParams();
  const [opts, setOpts] = useState<Option[]>([]);
  const [member, setMember] = useState<Option | null>(null);
  const [preview, setPreview] = useState<{ blob: Blob; url: string } | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");
  const [err, setErr] = useState("");
  const [facing, setFacing] = useState<"user" | "environment">("user");

  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [resetKey, setResetKey] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [mirror, setMirror] = useState(true);
  const [torch, setTorch] = useState(false);
  const track = useRef<MediaStreamTrack | null>(null);

  const video = useRef<HTMLVideoElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  const showSwitchCam = isMobile && !!navigator.mediaDevices?.getUserMedia;
  const showMirror = !isMobile || facing === "user";
  const showFlash = isMobile && facing === "environment";
  const mirrored = mirror && showMirror;

  const search = useCallback(async (q: string) => {
    const d = await (await fetch(`/api/members?q=${encodeURIComponent(q)}`)).json();
    setOpts(d.members?.map(toOpt) ?? []);
  }, []);

  useEffect(() => { setIsMobile(/Mobi|Android/i.test(navigator.userAgent)); }, []);

  useEffect(() => {
    const id = sp.get("id");
    if (id) {
      setIsLoadingQuery(true);
      fetch(`/api/members?id=${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.members?.[0]?.prodi === d.prodi) {
            setMember(toOpt(d.members[0]));
          }
        })
        .finally(() => {
          setIsLoadingQuery(false);
        });
    }
  }, [sp]);

  useEffect(() => {
    if (!showModal) return;
    const body = document.body;
    const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    const scrollbar = window.innerWidth - document.documentElement.clientWidth; // cegah halaman "melompat" saat scrollbar hilang
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowModal(false);
    window.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      window.removeEventListener("keydown", onKey);
    };
  }, [showModal]);

  const camOn = !!member && !preview && status === "idle";
  useEffect(() => {
    if (!camOn) return;
    let dead = false, s: MediaStream | undefined;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: { ideal: facing } } })
      .then((x) => {
        s = x;
        if (dead) return x.getTracks().forEach((t) => t.stop());
        if (video.current) video.current.srcObject = x;
        track.current = x.getVideoTracks()[0];
      })
      .catch(() => setErr("Kamera tidak dapat diakses (butuh HTTPS/localhost & izin kamera). Gunakan tombol Pilih file."));
    return () => {
      dead = true;
      s?.getTracks().forEach((t) => t.stop());
      track.current = null;
      setTorch(false);
    };
  }, [camOn, facing]);

  const upload = async (blob: Blob) => {
    setStatus("uploading"); setErr("");
    const fd = new FormData();
    fd.append("file", await shrink(blob), "foto.jpg");
    fd.append("memberId", member!.value);
    const r = await fetch("/api/selfie", { method: "POST", body: fd });
    if (r.ok) { setStatus("done"); setPreview(null); }
    else { setStatus("idle"); setErr((await r.json()).error ?? "Upload gagal"); }
  };

  const toggleTorch = async () => {
    const t = track.current;
    if (!t) return;
    const next = !torch;
    try {
      await t.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet & { torch: boolean }] });
      setTorch(next);
    } catch {
      setErr("Flash tidak dapat digunakan");
    }
  };

  const snap = () => {
    const v = video.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d")!;
    if (mirrored) { ctx.translate(c.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(v, 0, 0);
    c.toBlob((b) => b && upload(b), "image/jpeg", 0.9);
  };

  const pick = (f?: File) => {
    if (f) {
      setPreview({ blob: f, url: URL.createObjectURL(f) });
      setShowModal(false);
    }
  };

  const handleFileButtonClick = () => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      picker.current?.click();
    } else {
      setShowModal(true);
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setMember(null);
    setOpts([]);
    setPreview(null);
    setErr("");
    setResetKey((k) => k + 1);
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100">Ambil Foto</h1>

      <div className="mt-4">
        {isLoadingQuery ? (
          <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ) : (
          <Dropdown key={resetKey} options={opts} selected={member} onSelect={(o) => { setMember(o); setStatus("idle"); setPreview(null); }} onSearch={search} placeholder="Pilih anggota..." />
        )}
      </div>

      {err && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">{err}</p>}

      <input ref={picker} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />

      {member && status === "uploading" && <p className="mt-8 flex items-center justify-center gap-2 font-semibold text-amber-700 dark:text-amber-300"><Loader2 size={18} className="animate-spin" aria-hidden />Uploading...</p>}

      {member && status === "done" && (
        <div className="mt-8 text-center">
          <p className="flex items-center justify-center gap-2 font-semibold text-green-600 dark:text-green-400"><CircleCheck size={20} aria-hidden />Foto berhasil diupload</p>
          <Button className="mt-4" onClick={resetForm}><Camera size={16} aria-hidden />Jepret lagi</Button>
        </div>
      )}

      {member && status === "idle" && (preview ? (
        <div className="mt-6 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.url} alt="Pratinjau" className="w-full rounded-2xl" />
          <div className="flex gap-2">
            <Button onClick={() => upload(preview.blob)}><Upload size={16} aria-hidden />Upload</Button>
            <Button variant="outline" onClick={handleFileButtonClick}><RefreshCw size={16} aria-hidden />Ganti</Button>
            <Button variant="outline" onClick={() => setPreview(null)}><Camera size={16} aria-hidden />Gunakan kamera</Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <div className="relative">
            <video
              ref={video}
              autoPlay
              playsInline
              muted
              className={`aspect-[3/4] w-full rounded-2xl bg-black object-cover ${mirrored ? "-scale-x-100" : ""}`}
            />
            <div className="absolute right-3 top-3 flex flex-col gap-3">
              {showSwitchCam && (
                <button
                  type="button"
                  aria-label="Balik kamera"
                  onClick={() => { setErr(""); setFacing((f) => (f === "user" ? "environment" : "user")); }}
                  className="grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition active:scale-95 md:hidden"
                >
                  <SwitchCamera size={20} aria-hidden />
                </button>
              )}

              {showMirror && (
                <button
                  type="button"
                  aria-label="Mirror kamera"
                  aria-pressed={mirror}
                  onClick={() => setMirror((m) => !m)}
                  className={`grid h-10 w-10 place-items-center rounded-full text-white backdrop-blur transition active:scale-95 ${mirror ? "bg-amber-500/80" : "bg-black/50"}`}
                >
                  <FlipVertical2 size={20} aria-hidden />
                </button>
              )}

              {showFlash && (
                <button
                  type="button"
                  aria-label="Flash"
                  aria-pressed={torch}
                  onClick={toggleTorch}
                  className={`grid h-10 w-10 place-items-center rounded-full text-white backdrop-blur transition active:scale-95 ${torch ? "bg-amber-500/80" : "bg-black/50"}`}
                >
                  {torch ? <Zap size={20} aria-hidden /> : <ZapOff size={20} aria-hidden />}
                </button>
              )}
            </div>
          </div>
          <Button className="w-full" onClick={snap}><Camera size={16} aria-hidden />Jepret</Button>
          <Button variant="outline" className="w-full" onClick={handleFileButtonClick}><ImagePlus size={16} aria-hidden />Pilih file</Button>
        </div>
      ))}

      {/* Modal Desktop menggunakan Framer Motion & style yang identik dengan ConfirmModal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 dark:bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-amber-400/20 dark:bg-zinc-900"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={20} />
              </button>

              <p className="font-semibold text-zinc-900 dark:text-zinc-100">Unggah Foto</p>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) pick(e.dataTransfer.files[0]);
                }}
                className={`mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition ${isDragging ? "border-amber-500 bg-amber-50/50 dark:bg-amber-500/10" : "border-zinc-300 dark:border-zinc-700"
                  }`}
              >
                <UploadCloud size={48} className="text-amber-500 mb-3" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Tarik file kesini</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Atau{" "}
                  <button
                    type="button"
                    onClick={() => picker.current?.click()}
                    className="font-medium text-amber-600 underline hover:text-amber-700 dark:text-amber-400"
                  >
                    pilih file
                  </button>{" "}
                  pada komputer
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Page() { return <Suspense><Take /></Suspense>; }