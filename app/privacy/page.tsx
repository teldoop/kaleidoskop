import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
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
          <ShieldCheck size={28} aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-amber-950 dark:text-amber-50">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Terakhir diperbarui: 29 September 2026
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6 text-zinc-700 dark:text-zinc-300">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p className="text-sm leading-relaxed">
            Kami mengumpulkan informasi dasar akun Anda (seperti nama, email, dan foto profil yang ditautkan melalui autentikasi) serta data tugas foto dan metadata waktu pengambilan foto yang Anda unggah melalui aplikasi Kaleidoskop.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            2. Penggunaan Informasi
          </h2>
          <p className="text-sm leading-relaxed">
            Informasi dan foto yang dikumpulkan hanya digunakan untuk mempermudah Anda dalam melacak progres foto pada tugas kaleidoskop.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            3. Keamanan Data
          </h2>
          <p className="text-sm leading-relaxed">
            Data Anda aman bersama kami. Kami tidak mengumpulkan informasi sensitif seperti kata sandi akun google atau data pribadi lainnya.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">
            4. Hubungi Kami
          </h2>
          <p className="text-sm leading-relaxed">
            Jika Anda memiliki pertanyaan seputar Kebijakan Privasi ini, silakan menghubungi pembuat aplikasi ini: <a href="mailto:admin@teldoop.my.id" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
              admin@teldoop.my.id
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}