"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SymptomSelector } from "@/components/symptom-selector";
import { QuestionStep } from "@/components/question-step";
import { repository } from "@/lib/storage";
import { runAssessment } from "@/lib/analysis-engine";
import { SYMPTOM_QUESTIONS } from "@/data/symptom-questions";
import type { AnswerValue, Cat, SymptomId, SymptomQuestion } from "@/lib/types";

export default function AssessmentPage() {
  const router = useRouter();
  const [cat, setCat] = React.useState<Cat | null>(null);
  const [symptoms, setSymptoms] = React.useState<SymptomId[]>([]);
  const [answers, setAnswers] = React.useState<Record<string, AnswerValue>>({});
  const [stepIndex, setStepIndex] = React.useState(0); // 0 = symptom selection, 1..N = questions

  React.useEffect(() => {
    const activeId = repository.getActiveCatId();
    const cats = repository.getCats();
    setCat((activeId ? cats.find((c) => c.id === activeId) : cats[0]) ?? null);
  }, []);

  const questions: SymptomQuestion[] = React.useMemo(() => {
    const seen = new Set<string>();
    const all: SymptomQuestion[] = [];
    for (const s of symptoms) {
      for (const q of SYMPTOM_QUESTIONS[s] ?? []) {
        if (!seen.has(q.id)) {
          seen.add(q.id);
          all.push(q);
        }
      }
    }
    return all.filter((q) => !q.showIf || q.showIf(answers));
  }, [symptoms, answers]);

  const totalSteps = 1 + questions.length; // symptom selection + each question
  const currentQuestion = stepIndex >= 1 ? questions[stepIndex - 1] : undefined;

  if (!cat) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          Pirmiausia sukurkite katės profilį pradiniame puslapyje.
        </CardContent>
      </Card>
    );
  }

  function handleNext() {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((s) => s + 1);
      return;
    }
    // Paskutinis žingsnis - vykdyti analizę
    const result = runAssessment(cat!, symptoms, answers);
    repository.saveAssessment(result);
    router.push(`/assessment/result/${result.id}`);
  }

  function handleBack() {
    setStepIndex((s) => Math.max(0, s - 1));
  }

  const canProceed =
    stepIndex === 0
      ? symptoms.length > 0
      : currentQuestion
      ? answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ""
      : true;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <DisclaimerBanner compact />
      <div className="space-y-1.5">
        <Progress value={((stepIndex + 1) / totalSteps) * 100} />
        <p className="text-xs text-muted-foreground">
          Žingsnis {stepIndex + 1} iš {totalSteps}
        </p>
      </div>

      <Card className="animate-in">
        <CardContent className="pt-6">
          {stepIndex === 0 ? (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">Kas vyksta?</h2>
              <p className="text-sm text-muted-foreground">
                Pasirinkite vieną ar kelis simptomus, kuriuos pastebite pas {cat.name}.
              </p>
              <SymptomSelector selected={symptoms} onChange={setSymptoms} />
            </div>
          ) : currentQuestion ? (
            <QuestionStep
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onChange={(v) => setAnswers((a) => ({ ...a, [currentQuestion.id]: v }))}
            />
          ) : null}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Atgal
        </Button>
        <Button onClick={handleNext} disabled={!canProceed}>
          {stepIndex === totalSteps - 1 ? "Gauti rezultatą" : "Toliau"}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
