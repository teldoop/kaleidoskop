export const PRODI = [
  { value: "teknik-informatika", label: "Teknik Informatika", short: "TIF" },
  { value: "teknik-komputer", label: "Teknik Komputer", short: "TEKKOM" },
] as const;

export type Prodi = (typeof PRODI)[number]["value"];
export const prodiLabel = (v?: string | null) => PRODI.find((p) => p.value === v)?.label ?? "–";
export const prodiShort = (v?: string | null) => PRODI.find((p) => p.value === v)?.short ?? "";