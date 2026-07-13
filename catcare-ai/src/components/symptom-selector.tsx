"use client";

import { SYMPTOM_LIST } from "@/data/symptom-list";
import { DynamicIcon } from "@/components/dynamic-icon";
import { cn } from "@/lib/utils";
import type { SymptomId } from "@/lib/types";

export function SymptomSelector({
  selected,
  onChange,
}: {
  selected: SymptomId[];
  onChange: (next: SymptomId[]) => void;
}) {
  function toggle(id: SymptomId) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {SYMPTOM_LIST.map((symptom) => {
        const active = selected.includes(symptom.id);
        return (
          <button
            key={symptom.id}
            type="button"
            onClick={() => toggle(symptom.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center text-sm font-medium transition-colors hover:border-primary/50",
              active && "border-primary bg-primary/10 text-primary"
            )}
            aria-pressed={active}
          >
            <DynamicIcon name={symptom.icon} className="h-6 w-6" />
            {symptom.label}
          </button>
        );
      })}
    </div>
  );
}
