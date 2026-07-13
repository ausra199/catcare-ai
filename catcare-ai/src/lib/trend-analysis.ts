import type { DiaryEntry, RiskAnalysisResult, TrendAlert } from "@/lib/types";

/**
 * Analizuoja sveikatos dienoraščio įrašus ir bando aptikti tendencijas.
 * SVARBU: ši funkcija NIEKADA nediagnozuoja - ji tik identifikuoja
 * statistinius pokyčius ir siūlo aptarti juos su veterinaru.
 */
export function analyzeTrends(entries: DiaryEntry[], windowDays = 56): RiskAnalysisResult {
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : 1));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const windowEntries = sorted.filter((e) => new Date(e.date) >= cutoff);

  const alerts: TrendAlert[] = [];
  let riskScore = 0;

  // Svorio tendencija
  const weighed = windowEntries.filter((e) => typeof e.weightKg === "number");
  let weightTrendPct: number | null = null;
  if (weighed.length >= 2) {
    const first = weighed[0].weightKg!;
    const last = weighed[weighed.length - 1].weightKg!;
    weightTrendPct = ((last - first) / first) * 100;
    if (weightTrendPct <= -5) {
      const severity: TrendAlert["severity"] = weightTrendPct <= -10 ? "critical" : "warning";
      riskScore += severity === "critical" ? 35 : 20;
      alerts.push({
        id: "svoris_krito",
        severity,
        metric: "weightKg",
        message: `Per pastarąsias ${windowDays} dienas katės svoris sumažėjo apie ${Math.abs(weightTrendPct).toFixed(1)}%. Tai gali būti signalas aptarti su veterinaru.`,
      });
    }
  }

  // Vandens vartojimo tendencija (koduojame kategorijas skaičiais)
  const waterScore = (v: DiaryEntry["waterIntake"]) =>
    ({ sumazejas: -1, normalus: 0, padidejas: 1, labai_padidejas: 2 }[v]);

  let waterTrendPct: number | null = null;
  if (windowEntries.length >= 4) {
    const half = Math.floor(windowEntries.length / 2);
    const firstHalfAvg =
      windowEntries.slice(0, half).reduce((s, e) => s + waterScore(e.waterIntake), 0) / half;
    const secondHalfAvg =
      windowEntries.slice(half).reduce((s, e) => s + waterScore(e.waterIntake), 0) / (windowEntries.length - half);
    waterTrendPct = (secondHalfAvg - firstHalfAvg) * 35; // apytikslis santykinis indikatorius
    if (secondHalfAvg - firstHalfAvg >= 0.6) {
      riskScore += 20;
      alerts.push({
        id: "vanduo_padidejo",
        severity: "warning",
        metric: "waterIntake",
        message:
          "Pastebimas vandens suvartojimo padidėjimas per pastarąjį laikotarpį. Kartu su kitais pokyčiais tai verta aptarti su veterinaru (galimos inkstų funkcijos ar diabeto priežastys).",
      });
    }
  }

  // Apetito tendencija
  const appetiteDrops = windowEntries.filter(
    (e) => e.appetite === "sumazejas" || e.appetite === "labai_sumazejas" || e.appetite === "nevalgo"
  ).length;
  if (windowEntries.length >= 5 && appetiteDrops / windowEntries.length >= 0.4) {
    riskScore += 20;
    alerts.push({
      id: "apetitas_mazeja",
      severity: appetiteDrops / windowEntries.length >= 0.6 ? "critical" : "warning",
      metric: "appetite",
      message: "Apetitas dažnai sumažėjęs per pastarąjį laikotarpį - tai verta paminėti kitame vizite pas veterinarą.",
    });
  }

  // Viduriavimo dažnis
  const diarrheaCount = windowEntries.filter((e) => e.defecation === "viduriuoja").length;
  if (windowEntries.length >= 5 && diarrheaCount / windowEntries.length >= 0.3) {
    riskScore += 15;
    alerts.push({
      id: "viduriavimas_kartojasi",
      severity: "warning",
      metric: "defecation",
      message: "Viduriavimas kartojasi dažniau nei trečdalį stebimų dienų - rekomenduojama aptarti su veterinaru.",
    });
  }

  // Aktyvumo mažėjimas
  const lowActivity = windowEntries.filter(
    (e) => e.activity === "sumazejas" || e.activity === "labai_sumazejas"
  ).length;
  if (windowEntries.length >= 5 && lowActivity / windowEntries.length >= 0.5) {
    riskScore += 15;
    alerts.push({
      id: "aktyvumas_mazeja",
      severity: "info",
      metric: "activity",
      message: "Aktyvumas sumažėjęs daugiau nei pusę stebimų dienų.",
    });
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  return {
    riskScore,
    alerts,
    weightTrendPct,
    waterTrendPct,
    windowDays,
  };
}
