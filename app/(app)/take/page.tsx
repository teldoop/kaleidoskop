"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, CircleCheck, ImagePlus, Loader2, RefreshCw, SwitchCamera, Upload } from "lucide-react";
import Button from "@/components/button";
import Dropdown, { type Option } from "@/components/dropdown";

type M = { id: string; nama: string; nim: string };
const toOpt = (m: M): Option => ({ value: m.id, label: m.nama.replace(/-/g, " "), hint: m.nim });

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
  const [facing, setFacing] = useState<"user" | "environment">("user"); // depan / belakang
  const video = useRef<HTMLVideoElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    const d = await (await fetch(`/api/members?q=${encodeURIComponent(q)}`)).json();
    setOpts(d.members?.map(toOpt) ?? []);
  }, []);
  useEffect(() => {
    const id = sp.get("id");
    if (id) fetch(`/api/members?id=${id}`).then((r) => r.json()).then((d) => d.members?.[0]?.prodi === d.prodi && setMember(toOpt(d.members[0])));
  }, [sp]);

  const camOn = !!member && !preview && status === "idle";
  useEffect(() => {
    if (!camOn) return;
    let dead = false, s: MediaStream | undefined;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: { ideal: facing } } })
      .then((x) => { s = x; if (dead) return x.getTracks().forEach((t) => t.stop()); if (video.current) video.current.srcObject = x; })
      .catch(() => setErr("Kamera tidak dapat diakses (butuh HTTPS/localhost & izin kamera). Gunakan tombol Pilih file."));
    return () => { dead = true; s?.getTracks().forEach((t) => t.stop()); };
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
  const snap = () => {
    const v = video.current!;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    c.toBlob((b) => b && upload(b), "image/jpeg", 0.9);
  };
  const pick = (f?: File) => { if (f) setPreview({ blob: f, url: URL.createObjectURL(f) }); };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100">Ambil Foto</h1>
      <div className="mt-4"><Dropdown options={opts} selected={member} onSelect={(o) => { setMember(o); setStatus("idle"); setPreview(null); }} onSearch={search} placeholder="Pilih anggota..." /></div>
      {err && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">{err}</p>}
      <input ref={picker} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />

      {member && status === "uploading" && <p className="mt-8 flex items-center justify-center gap-2 font-semibold text-amber-700 dark:text-amber-300"><Loader2 size={18} className="animate-spin" aria-hidden />Uploading...</p>}
      {member && status === "done" && (
        <div className="mt-8 text-center">
          <p className="flex items-center justify-center gap-2 font-semibold text-green-600 dark:text-green-400"><CircleCheck size={20} aria-hidden />Foto berhasil diupload</p>
          <Button className="mt-4" onClick={() => setStatus("idle")}><Camera size={16} aria-hidden />Jepret lagi</Button>
        </div>
      )}
      {member && status === "idle" && (preview ? (
        <div className="mt-6 space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.url} alt="Pratinjau" className="w-full rounded-2xl" />
          <div className="flex gap-2">
            <Button onClick={() => upload(preview.blob)}><Upload size={16} aria-hidden />Upload</Button>
            <Button variant="outline" onClick={() => picker.current?.click()}><RefreshCw size={16} aria-hidden />Ganti</Button>
            <Button variant="outline" onClick={() => setPreview(null)}><Camera size={16} aria-hidden />Gunakan kamera</Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <div className="relative">
            <video ref={video} autoPlay playsInline muted className="aspect-[3/4] w-full rounded-2xl bg-black object-cover" />
            {/* Hanya mobile: balik kamera depan/belakang */}
            <button
              type="button"
              aria-label="Balik kamera"
              onClick={() => { setErr(""); setFacing((f) => (f === "user" ? "environment" : "user")); }}
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition active:scale-95 md:hidden"
            >
              <SwitchCamera size={20} aria-hidden />
            </button>
          </div>
          <Button className="w-full" onClick={snap}><Camera size={16} aria-hidden />Jepret</Button>
          <Button variant="outline" className="w-full" onClick={() => picker.current?.click()}><ImagePlus size={16} aria-hidden />Pilih file</Button>
        </div>
      ))}
    </div>
  );
}

export default function Page() { return <Suspense><Take /></Suspense>; }