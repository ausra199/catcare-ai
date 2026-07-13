"use client";

import * as React from "react";
import { AlertTriangle, Info, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendChart } from "@/components/trend-chart";
import { repository } from "@/lib/storage";
import { analyzeTrends } from "@/lib/trend-analysis";
import type { Cat, DiaryEntry, RiskAnalysisResult } from "@/lib/types";

const SEVERITY_CONFIG = {
  info: { variant: "muted" as const, icon: Info },
  warning: { variant: "warning" as const, icon: AlertTriangle },
  critical: { variant: "destructive" as const, icon: AlertTriangle },
};

export default function RiskAnalysisPage() {
  const [cat, setCat] = React.useState<Cat | null>(null);
  const [entries, setEntries] = React.useState<DiaryEntry[]>([]);
  const [analysis, setAnalysis] = React.useState<RiskAnalysisResult | null>(null);

  React.useEffect(() => {
    const activeId = repository.getActiveCatId();
    const cats = repository.getCats();
    const found = (activeId ? cats.find((c) => c.id === activeId) : cats[0]) ?? null;
    setCat(found);
    if (found) {
      const diary = repository.getDiaryEntries(found.id);
      setEntries(diary);
      setAnalysis(analyzeTrends(diary));
    }
  }, []);

  if (!cat) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          Pirmiausia sukurkite katės profilį pradiniame puslapyje.
        </CardContent>
      </Card>
    );
  }

  if (entries.length < 2) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-semibold">Rizikos analizė</h1>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Rizikos analizei reikalingi bent keli sveikatos dienoraščio įrašai. Pridėkite daugiau įrašų
            Dienoraštis skiltyje, kad matytumėte tendencijas.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Ilgalaikė sveikatos rizikos analizė</h1>
        <Badge variant={analysis && analysis.riskScore >= 50 ? "destructive" : analysis && analysis.riskScore >= 25 ? "warning" : "success"}>
          Rizikos balas: {analysis?.riskScore ?? 0}/100
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Svorio tendencija</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart entries={entries} />
          {analysis?.weightTrendPct !== null && analysis?.weightTrendPct !== undefined && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              {analysis.weightTrendPct < 0 ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingUp className="h-4 w-4 text-success" />
              )}
              Per stebimą laikotarpį svoris pakito {analysis.weightTrendPct.toFixed(1)}%.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perspėjimai ir tendencijos</CardTitle>
          <p className="text-xs text-muted-foreground">
            Sistema tik identifikuoja tendencijas, ji nediagnozuoja. Aptarkite šiuos pastebėjimus su veterinaru.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis && analysis.alerts.length > 0 ? (
            analysis.alerts.map((alert) => {
              const { variant, icon: Icon } = SEVERITY_CONFIG[alert.severity];
              return (
                <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-border p-3.5">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{alert.message}</p>
                  </div>
                  <Badge variant={variant}>
                    {alert.severity === "critical" ? "Svarbu" : alert.severity === "warning" ? "Dėmesio" : "Info"}
                  </Badge>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              Šiuo metu reikšmingų neigiamų tendencijų nepastebėta. Toliau stebėkite dienoraštyje.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
