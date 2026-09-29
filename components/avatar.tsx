"use client";
import { useState } from "react";
import { User } from "lucide-react";

export default function Avatar({ src, size = 40 }: { src?: string; size?: number }) {
  const [err, setErr] = useState(false);
  const box = { width: size, height: size };
  return src && !err ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setErr(true)} style={box} className="shrink-0 rounded-full object-cover" />
  ) : (
    <span style={box} className="grid shrink-0 place-items-center rounded-full bg-amber-200 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200">
      <User size={size / 2} aria-hidden />
    </span>
  );
}