"use client";

import Link from "next/link";
import { AlertTriangle, Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { UrgencyBadge } from "@/components/urgency-badge";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { getSymptomLabel } from "@/data/symptom-list";
import { exportVisitSummaryPdf } from "@/lib/pdf-export";
import { cn } from "@/lib/utils";
import type { AssessmentResult, Cat } from "@/lib/types";

export function AssessmentResultView({ cat, result }: { cat: Cat; result: AssessmentResult }) {
  if (result.redFlags.triggered) {
    return (
      <div className="space-y-5">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="font-display text-xl font-bold">Tai gali būti skubi būklė</h2>
            </div>
            <p className="font-medium">
              Rekomenduojama nedelsiant kreiptis į artimiausią veterinarijos kliniką.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {result.redFlags.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <DisclaimerBanner />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Įvertinimo rezultatas</h1>
        <UrgencyBadge urgency={result.urgency} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Situacijos santrauka</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm leading-relaxed">{result.summary}</p>
          <p className="text-xs text-muted-foreground">
            Simptomai: {result.symptoms.map(getSymptomLabel).join(", ")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skubumo įvertinimas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <UrgencyBadge urgency={result.urgency} />
          <p className="text-sm text-muted-foreground">{result.urgency.explanation}</p>
        </CardContent>
      </Card>

      {result.possibleCauses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Galimos priežastys</CardTitle>
            <p className="text-xs text-muted-foreground">
              Tai tik galimų priežasčių sąrašas, ne diagnozė. Tik veterinaras gali patvirtinti tikrąją priežastį.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.possibleCauses.slice(0, 5).map((c) => (
              <div key={c.id} className="rounded-lg border border-border p-4">
                <h3 className="font-display text-base font-semibold">Gali būti: {c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.why}</p>
                {c.supportingFactors.length > 0 && (
                  <p className="mt-2 text-xs">
                    <span className="font-medium text-success">Už tai kalba:</span>{" "}
                    {c.supportingFactors.join("; ")}
                  </p>
                )}
                {c.contradictingFactors.length > 0 && (
                  <p className="mt-1 text-xs">
                    <span className="font-medium text-destructive">Prieš tai kalba:</span>{" "}
                    {c.contradictingFactors.join("; ")}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pasiruošimas vizitui</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold">Klausimai veterinarui</h4>
            <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {result.vetQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
          <Button onClick={() => exportVisitSummaryPdf(cat, result)} variant="secondary" className="gap-2">
            <Download className="h-4 w-4" /> Atsisiųsti vizito suvestinę (PDF)
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/diary" className={cn(buttonVariants({ variant: "outline" }))}>
          <FileText className="mr-2 h-4 w-4" /> Pridėti dienoraščio įrašą
        </Link>
        <Link href="/history" className={cn(buttonVariants({ variant: "ghost" }))}>
          Peržiūrėti visą istoriją
        </Link>
      </div>

      <DisclaimerBanner compact />
    </div>
  );
}
