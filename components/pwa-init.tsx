"use client";
import { startPwa } from "@/lib/pwa";

startPwa(); // dijalankan sedini mungkin di sisi klien agar event instal tidak terlewat

export default function PwaInit() {
  return null;
}
