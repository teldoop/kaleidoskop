"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, Camera, Download, House, LogOut, Users } from "lucide-react";
import Avatar from "./avatar";
import Button from "./button";
import InstallHelp from "./install-help";
import { useAccount } from "@/lib/use-account";
import { installApp, useCanInstall } from "@/lib/pwa";

const nav = [
  { href: "/", label: "Beranda", icon: House },
  { href: "/list", label: "Daftar", icon: Users },
  { href: "/take", label: "Ambil Foto", icon: Camera },
];

const item = "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition md:flex-row md:gap-3 md:text-sm";
const idle = "text-amber-900 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-400/10";
const bone = "animate-pulse rounded bg-amber-900/15 dark:bg-white/10";

export default function Sidebar() {
  const path = usePathname();
  const { me, logout } = useAccount();
  const canInstall = useCanInstall();
  const [help, setHelp] = useState(false);
  const install = async () => { if ((await installApp()) === "ios") setHelp(true); };

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-amber-200 bg-amber-50 p-2 dark:border-amber-400/20 dark:bg-zinc-900 md:static md:h-screen md:w-60 md:flex-col md:justify-start md:gap-1 md:border-r md:border-t-0 md:p-4">
        <p className="hidden items-center gap-2 px-3 pb-4 text-lg font-extrabold text-amber-600 dark:text-amber-400 md:flex">
          <Aperture size={22} aria-hidden /> Kaleidoskop
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`${item} ${active ? "bg-amber-400 text-amber-950" : idle}`}>
              <Icon size={20} aria-hidden />{label}
            </Link>
          );
        })}

        {/* Mobile: menu Instal di samping Ambil Foto (hilang jika sudah terinstal) */}
        {canInstall && (
          <button onClick={install} aria-label="Instal Aplikasi" className={`${item} ${idle} md:hidden`}>
            <Download size={20} aria-hidden />Instal
          </button>
        )}

        {/* Hanya desktop: tombol instal + info akun + tombol keluar */}
        <div className="hidden md:mt-auto md:flex md:flex-col md:gap-2">
          {canInstall && (
            <Button variant="outline" onClick={install} className="w-full"><Download size={16} aria-hidden />Instal Aplikasi</Button>
          )}
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 p-3 dark:border-amber-400/20">
            {me === null ? (
              <>
                <div className={`${bone} h-10 w-10 shrink-0 rounded-full`} />
                <div className="flex-1 space-y-2"><div className={`${bone} h-3 w-24`} /><div className={`${bone} h-3 w-32`} /></div>
              </>
            ) : (
              <>
                <Avatar src={me.avatar} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-amber-950 dark:text-amber-50" title={me.name}>{me.name}</p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400" title={me.email}>{me.email}</p>
                </div>
              </>
            )}
          </div>
          <button onClick={logout} className={`${item} ${idle}`}>
            <LogOut size={20} aria-hidden />Keluar
          </button>
        </div>
      </nav>
      <InstallHelp open={help} onClose={() => setHelp(false)} />
    </>
  );
}
