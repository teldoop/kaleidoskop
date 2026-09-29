"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Code, Cpu, Loader2, Save } from "lucide-react";
import Button from "@/components/button";
import { PRODI } from "@/lib/prodi";

const icons = { "teknik-informatika": Code, "teknik-komputer": Cpu } as const;

export default function PilihProdi() {
  const router = useRouter();
  const [current, setCurrent] = useState<string | null | undefined>(undefined); // undefined = memuat
  const [choice, setChoice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/prodi").then((r) => r.json())
      .then((d) => { setCurrent(d.prodi ?? null); setChoice(d.prodi ?? null); })
      .catch(() => setCurrent(null));
  }, []);

  const save = async () => {
    if (!choice) return;
    setSaving(true); setErr("");
    const r = await fetch("/api/prodi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prodi: choice }) });
    if (r.ok) { router.replace("/"); router.refresh(); }
    else { setSaving(false); setErr("Gagal menyimpan. Coba lagi."); }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-100 to-yellow-50 p-4 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:border dark:border-amber-400/20 dark:bg-zinc-900 dark:shadow-none">
        <h1 className="text-2xl font-extrabold text-amber-900 dark:text-amber-100">Pilih Prodi Anda</h1>

        <div role="radiogroup" aria-label="Program studi" className="mt-6 space-y-3">
          {current === undefined
            ? [0, 1].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-amber-900/15 dark:bg-white/10" />)
            : PRODI.map((p) => {
                const Icon = icons[p.value];
                const on = choice === p.value;
                return (
                  <button
                    key={p.value} type="button" role="radio" aria-checked={on} onClick={() => setChoice(p.value)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      on
                        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300 dark:bg-amber-400/10 dark:ring-amber-400/40"
                        : "border-amber-200 hover:bg-amber-50 dark:border-amber-400/20 dark:hover:bg-amber-400/5"
                    }`}
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-200 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200"><Icon size={20} aria-hidden /></span>
                    <span className="flex-1 font-semibold">{p.label}</span>
                    {on && <Check size={20} aria-hidden className="text-amber-500 dark:text-amber-400" />}
                  </button>
                );
              })}
        </div>

        {err && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">{err}</p>}
        <div className="mt-6 flex gap-2">
          {current && <Button href="/" variant="outline"><ArrowLeft size={16} aria-hidden />Kembali</Button>}
          <Button className="flex-1" onClick={save} disabled={!choice || saving}>
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Save size={16} aria-hidden />}Simpan
          </Button>
        </div>
      </div>
    </main>
  );
}
