import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          <ArrowLeft size={16} aria-hidden /> Kembali ke Beranda
        </Link>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm dark:border-amber-400/20 dark:bg-zinc-900">
        <div className="rounded-xl bg-amber-100 p-3 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
          <FileText size={28} aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-amber-950 dark:text-amber-50">
            Persyaratan Layanan
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Terakhir diperbarui: 29 September 2026
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-zinc-700 dark:text-zinc-300">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            1. Batasan Pengguna Layanan
          </h2>
          <p className="text-sm leading-relaxed">
            Aplikasi <strong>Kaleidoskop</strong> ini secara eksklusif hanya boleh digunakan oleh <strong>mahasiswa Departemen Teknik Informatika Universitas Brawijaya (UB) angkatan 2026</strong>. Pengguna di luar ketentuan tersebut dilarang keras mengakses atau menggunakan layanan ini.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            2. Penggunaan Akun & Akses
          </h2>
          <p className="text-sm leading-relaxed">
            Anda dapat login menggunakan akun Google Anda, tidak harus akun UB.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            3. Tugas & Pengunggahan Foto
          </h2>
          <p className="text-sm leading-relaxed">
            Aplikasi ini digunakan untuk mengunggah foto selfie bersama 1 orang teman seprodi untuk mempermudah pengerjaan tugas kaleidoskop.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            4. Penghentian Layanan
          </h2>
          <p className="text-sm leading-relaxed">
            Mungkin aplikasi ini akan dihentikan ketika penugasan kaleidoskop selesai, atau bisa jadi sampai pengumuman kelulusan INTRIVIA.
          </p>
        </section>
      </div>
    </div>
  );
}