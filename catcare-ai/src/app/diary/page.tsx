"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiaryEntryForm } from "@/components/diary-entry-form";
import { repository } from "@/lib/storage";
import type { Cat, DiaryEntry } from "@/lib/types";

const APPETITE_LABELS: Record<string, string> = {
  normalus: "Normalus apetitas",
  sumazejas: "Sumažėjęs apetitas",
  labai_sumazejas: "Labai sumažėjęs apetitas",
  padidejas: "Padidėjęs apetitas",
  nevalgo: "Nevalgo",
};

export default function DiaryPage() {
  const [cat, setCat] = React.useState<Cat | null>(null);
  const [entries, setEntries] = React.useState<DiaryEntry[]>([]);

  React.useEffect(() => {
    const activeId = repository.getActiveCatId();
    const cats = repository.getCats();
    const found = (activeId ? cats.find((c) => c.id === activeId) : cats[0]) ?? null;
    setCat(found);
    if (found) setEntries(repository.getDiaryEntries(found.id));
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

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Sveikatos dienoraštis</h1>

      <Card>
        <CardHeader>
          <CardTitle>Naujas įrašas</CardTitle>
        </CardHeader>
        <CardContent>
          <DiaryEntryForm
            catId={cat.id}
            onSaved={(entry) => {
              repository.saveDiaryEntry(entry);
              setEntries(repository.getDiaryEntries(cat.id));
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Ankstesni įrašai</h2>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Kol kas įrašų nėra.</p>
        ) : (
          entries.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{new Date(e.date).toLocaleDateString("lt-LT")}</p>
                  {e.weightKg && <p className="text-xs text-muted-foreground">{e.weightKg} kg</p>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {APPETITE_LABELS[e.appetite]} · vanduo: {e.waterIntake} · aktyvumas: {e.activity}
                </p>
                {e.notes && <p className="mt-2 text-sm">{e.notes}</p>}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
