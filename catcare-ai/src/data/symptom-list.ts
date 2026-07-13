import type { SymptomId } from "@/lib/types";

export interface SymptomMeta {
  id: SymptomId;
  label: string;
  /** lucide-react icon name, resolved in the component to avoid importing every icon here */
  icon: string;
}

export const SYMPTOM_LIST: SymptomMeta[] = [
  { id: "vemia", label: "Vemia", icon: "Droplets" },
  { id: "viduriuoja", label: "Viduriuoja", icon: "Waves" },
  { id: "nevalgo", label: "Nevalgo", icon: "UtensilsCrossed" },
  { id: "geria_daug", label: "Geria daug vandens", icon: "GlassWater" },
  { id: "mazai_geria", label: "Mažai geria", icon: "CupSoda" },
  { id: "sunku_kvepuoti", label: "Sunku kvėpuoti", icon: "Wind" },
  { id: "slubuoja", label: "Šlubuoja", icon: "Footprints" },
  { id: "salpinasi_dazniau", label: "Šlapinasi dažnai", icon: "Timer" },
  { id: "negali_pasislapinti", label: "Negali pasišlapinti", icon: "AlertOctagon" },
  { id: "kraujas_slapime", label: "Kraujas šlapime", icon: "Droplet" },
  { id: "traukuliai", label: "Traukuliai", icon: "Zap" },
  { id: "koseja", label: "Kosėja", icon: "Wind" },
  { id: "ciaudi", label: "Čiaudi", icon: "Wind" },
  { id: "niezti_oda", label: "Niežti oda", icon: "Scan" },
  { id: "zaizda", label: "Žaizda", icon: "Bandage" },
  { id: "patinimas", label: "Patinimas", icon: "CircleDot" },
  { id: "pasikeites_elgesys", label: "Pasikeitęs elgesys", icon: "Brain" },
  { id: "svorio_kritimas", label: "Svorio kritimas", icon: "TrendingDown" },
  { id: "kitas", label: "Kitas simptomas", icon: "HelpCircle" },
];

export function getSymptomLabel(id: SymptomId): string {
  return SYMPTOM_LIST.find((s) => s.id === id)?.label ?? id;
}
