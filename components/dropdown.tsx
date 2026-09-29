"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import Input from "./input";

export type Option = { value: string; label: string; hint?: string };
type Props = { options: Option[]; selected: Option | null; onSelect: (o: Option) => void; onSearch: (q: string) => void; placeholder?: string };

export default function Dropdown({ options, selected, onSelect, onSearch, placeholder = "Pilih..." }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { // debounce pencarian
    const t = setTimeout(() => onSearch(q), 250);
    return () => clearTimeout(t);
  }, [q, onSearch]);
  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-left text-sm capitalize dark:border-amber-400/30 dark:bg-zinc-900"
      >
        <span className={selected ? "" : "normal-case text-zinc-400 dark:text-zinc-500"}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={18} aria-hidden className={`text-amber-500 transition-transform dark:text-amber-400 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="absolute z-20 mt-2 w-full rounded-xl border border-amber-200 bg-white p-2 shadow-lg dark:border-amber-400/30 dark:bg-zinc-900 dark:shadow-none"
          >
            <div className="relative">
              <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input autoFocus className="pl-9" placeholder="Cari nama atau NIM..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <ul role="listbox" className="mt-2 max-h-72 overflow-auto">
              {options.map((o) => {
                const active = o.value === selected?.value;
                return (
                  <li key={o.value} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => { onSelect(o); setOpen(false); }}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm capitalize hover:bg-amber-50 dark:hover:bg-amber-400/10 ${active ? "bg-amber-50 dark:bg-amber-400/10" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        {active && <Check size={14} aria-hidden className="text-amber-500 dark:text-amber-400" />}
                        {o.label}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">{o.hint}</span>
                    </button>
                  </li>
                );
              })}
              {!options.length && <li className="px-3 py-2 text-sm text-zinc-400 dark:text-zinc-500">Tidak ditemukan</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}