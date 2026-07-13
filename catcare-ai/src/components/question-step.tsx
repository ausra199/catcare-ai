"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AnswerValue, SymptomQuestion } from "@/lib/types";

export function QuestionStep({
  question,
  value,
  onChange,
}: {
  question: SymptomQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-xl font-semibold">{question.label}</h3>

      {question.type === "single_select" && question.options && (
        <div className="grid gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "rounded-lg border border-border bg-card px-4 py-3 text-left text-sm font-medium transition-colors hover:border-primary/50",
                value === opt.value && "border-primary bg-primary/10 text-primary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {question.type === "boolean" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={cn(
              "rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/50",
              value === true && "border-primary bg-primary/10 text-primary"
            )}
          >
            Taip
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={cn(
              "rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/50",
              value === false && "border-primary bg-primary/10 text-primary"
            )}
          >
            Ne
          </button>
        </div>
      )}

      {question.type === "number" && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(Number(e.target.value))}
            className="max-w-[160px]"
          />
          {question.unit && <span className="text-sm text-muted-foreground">{question.unit}</span>}
        </div>
      )}

      {question.type === "text" && (
        <Textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Trumpai aprašykite..."
        />
      )}
    </div>
  );
}
