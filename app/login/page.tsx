"use client";
import { motion } from "framer-motion";
import { Aperture, LogIn } from "lucide-react";
import Button from "@/components/button";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function Login() {
  const signIn = () => supabaseBrowser().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback` } });
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-100 to-yellow-50 p-4 dark:from-zinc-950 dark:to-zinc-900">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl dark:border dark:border-amber-400/20 dark:bg-zinc-900 dark:shadow-none">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} className="mx-auto w-fit text-amber-500 dark:text-amber-400">
          <Aperture size={56} strokeWidth={1.75} aria-hidden />
        </motion.div>
        <h1 className="mt-4 text-2xl font-extrabold text-amber-900 dark:text-amber-100">Aplikasi Kaleidoskop</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Masuk untuk mulai memotret</p>
        <Button className="mt-6 w-full" onClick={signIn}><LogIn size={16} aria-hidden />Masuk dengan Google</Button>
      </motion.div>
    </main>
  );
}
