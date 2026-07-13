"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrgencyBadge } from "@/components/urgency-badge";
import { repository } from "@/lib/storage";
import { getSymptomLabel } from "@/data/symptom-list";
import type { AssessmentResult, UrgencyLevel } from "@/lib/types";

const URGENCY_FILTERS: { value: UrgencyLevel | "visi"; label: string }[] = [
  { value: "visi", label: "Visi" },
  { value: "namuose", label: "Namuose" },
  { value: "per_24h", label: "Per 24 val." },
  { value: "siandien", label: "Šiandien" },
  { value: "skubu", label: "Skubu" },
];

export default function HistoryPage() {
  const [assessments, setAssessments] = React.useState<AssessmentResult[]>([]);
  const [query, setQuery] = React.useState("");
  const [urgencyFilter, setUrgencyFilter] = React.useState<UrgencyLevel | "visi">("visi");

  React.useEffect(() => {
    const activeId = repository.getActiveCatId();
    setAssessments(repository.getAssessments(activeId ?? undefined));
  }, []);

  const filtered = assessments.filter((a) => {
    const matchesUrgency = urgencyFilter === "visi" || a.urgency.level === urgencyFilter;
    const haystack = (a.symptoms.map(getSymptomLabel).join(" ") + " " + a.summary).toLowerCase();
    const matchesQuery = query.trim() === "" || haystack.includes(query.toLowerCase());
    return matchesUrgency && matchesQuery;
  });

  function exportCsv() {
    const header = "Data;Simptomai;Skubumas;Santrauka\n";
    const rows = filtered
      .map((a) =>
        [
          new Date(a.createdAt).toLocaleString("lt-LT"),
          a.symptoms.map(getSymptomLabel).join(", "),
          a.urgency.label,
          a.summary.replace(/;/g, ","),
        ]
          .map((v) => `"${v}"`)
          .join(";")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sveikatos_istorija.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Sveikatos istorija</h1>
        {assessments.length > 0 && (
          <button onClick={exportCsv} className="text-sm text-primary underline underline-offset-2">
            Eksportuoti (CSV)
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Ieškoti pagal simptomą ar tekstą..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {URGENCY_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setUrgencyFilter(f.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              urgencyFilter === f.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            {assessments.length === 0
              ? "Kol kas nėra atliktų įvertinimų. Pradėkite naują sveikatos įvertinimą."
              : "Pagal pasirinktus filtrus įrašų nerasta."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Link key={a.id} href={`/assessment/result/${a.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{a.symptoms.map(getSymptomLabel).join(", ")}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.summary}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleString("lt-LT")}
                    </p>
                  </div>
                  <UrgencyBadge urgency={a.urgency} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
