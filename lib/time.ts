const MIN = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const RELATIVE_DAYS = 2; // selisih tanggal maksimum yang masih ditampilkan relatif ("2 hari yang lalu")
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const pad = (n: number) => String(n).padStart(2, "0");
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Contoh: "27 Sep 2026, 14.30" (zona waktu perangkat). */
export const formatDateTime = (d: Date) =>
  `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}.${pad(d.getMinutes())}`;

/** Keterangan waktu dalam bahasa Indonesia: relatif sampai 2 hari, setelah itu tanggal dan waktu. */
export function timeAgo(iso: string, now = Date.now()): string {
  const then = new Date(iso);
  const diff = Math.max(0, now - then.getTime());
  if (diff < MIN) return "Barusan";
  if (diff < HOUR) return `${Math.floor(diff / MIN)} menit yang lalu`;

  const days = Math.round((startOfDay(new Date(now)) - startOfDay(then)) / DAY); // selisih tanggal kalender
  if (days <= 0) return `${Math.floor(diff / HOUR)} jam yang lalu`;
  if (days === 1) return "Kemarin";
  if (days <= RELATIVE_DAYS) return `${days} hari yang lalu`;
  return formatDateTime(then);
}