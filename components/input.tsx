import type { InputHTMLAttributes } from "react";
export default function Input({ className = "", ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-amber-400/30 dark:bg-zinc-900 dark:placeholder:text-zinc-500 dark:focus:border-amber-400 dark:focus:ring-amber-400/30 ${className}`}
      {...p}
    />
  );
}