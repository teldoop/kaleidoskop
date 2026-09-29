"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Button from "@/components/button";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  isOpen,
  title = "Konfirmasi",
  message,
  confirmText = "Ya",
  cancelText = "Tidak",
  busy = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 dark:bg-black/60"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-amber-400/20 dark:bg-zinc-900"
          >
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={busy}>
                {cancelText}
              </Button>
              <Button variant="danger" onClick={onConfirm} disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden />
                    Memproses...
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}