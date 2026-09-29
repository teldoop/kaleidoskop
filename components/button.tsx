import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "danger"; href?: string };
const styles = {
  primary: "bg-amber-400 text-amber-950 hover:bg-amber-300",
  outline:
    "border border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-400/40 dark:text-amber-200 dark:hover:bg-amber-400/10",
  danger: "bg-red-500 text-white hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500",
};

export default function Button({ variant = "primary", href, className = "", ...rest }: Props) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${styles[variant]} ${className}`;
  return href ? <Link href={href} className={cls}>{rest.children}</Link> : <button className={cls} {...rest} />;
}