import { useSyncExternalStore } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

let deferred: InstallEvent | null = null; // event beforeinstallprompt (Chrome/Edge/Android)
let installed = false;
let ios = false; // iOS tidak punya prompt otomatis -> tampilkan petunjuk manual
let started = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

/** Dipanggil sekali di root layout: menangkap event instal + mendaftarkan service worker. */
export function startPwa() {
  if (started || typeof window === "undefined") return;
  started = true;
  installed = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e as InstallEvent; emit(); });
  window.addEventListener("appinstalled", () => { deferred = null; installed = true; emit(); });
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register("/sw.js").catch(() => {});
  emit();
}

/** true jika aplikasi belum terinstal dan bisa diinstal (atau perlu petunjuk manual di iOS). */
export const useCanInstall = () =>
  useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => !installed && (!!deferred || ios),
    () => false,
  );

/** Menjalankan prompt instal. Mengembalikan "ios" bila perlu petunjuk manual. */
export async function installApp(): Promise<"ios" | "done"> {
  if (!deferred) return "ios";
  const d = deferred;
  deferred = null; // event hanya bisa dipakai sekali
  emit();
  await d.prompt();
  await d.userChoice;
  return "done";
}
