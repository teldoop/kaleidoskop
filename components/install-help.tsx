"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Share, SquarePlus } from "lucide-react";
import Button from "./button";

export default function InstallHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 grid place-items-end bg-black/40 p-4 dark:bg-black/60 md:place-items-center">
          <motion.div initial={{ y: 30 }} animate={{ y: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 dark:border dark:border-amber-400/20 dark:bg-zinc-900">
            <p className="text-lg font-bold text-amber-900 dark:text-amber-100">Instal Aplikasi</p>
            <ol className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3"><Share size={18} aria-hidden className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />Buka lewat Safari, lalu ketuk ikon Bagikan.</li>
              <li className="flex items-start gap-3"><SquarePlus size={18} aria-hidden className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />Pilih &quot;Tambahkan ke Layar Utama&quot;, lalu ketuk Tambah.</li>
            </ol>
            <Button className="mt-5 w-full" onClick={onClose}>Mengerti</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
