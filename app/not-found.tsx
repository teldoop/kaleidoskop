import { House } from "lucide-react";
import Button from "@/components/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-amber-50 p-4 text-center dark:bg-zinc-950">
      <div>
        <p className="text-8xl font-black text-amber-400 dark:text-amber-500">404</p>
        <p className="mt-2 text-lg text-amber-900 dark:text-amber-100">Halaman tidak ditemukan</p>
        <Button href="/" className="mt-6"><House size={16} aria-hidden />Kembali ke dashboard</Button>
      </div>
    </main>
  );
}
