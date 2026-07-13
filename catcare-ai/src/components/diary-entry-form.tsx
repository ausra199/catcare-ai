"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { newId } from "@/lib/storage";
import type { DiaryEntry } from "@/lib/types";

const SELECT_FIELDS: {
  key: keyof Pick<DiaryEntry, "appetite" | "waterIntake" | "activity" | "urination" | "defecation">;
  label: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "appetite",
    label: "Apetitas",
    options: [
      { value: "normalus", label: "Normalus" },
      { value: "sumazejas", label: "Sumažėjęs" },
      { value: "labai_sumazejas", label: "Labai sumažėjęs" },
      { value: "padidejas", label: "Padidėjęs" },
      { value: "nevalgo", label: "Nevalgo" },
    ],
  },
  {
    key: "waterIntake",
    label: "Vandens kiekis",
    options: [
      { value: "normalus", label: "Normalus" },
      { value: "sumazejas", label: "Sumažėjęs" },
      { value: "padidejas", label: "Padidėjęs" },
      { value: "labai_padidejas", label: "Labai padidėjęs" },
    ],
  },
  {
    key: "activity",
    label: "Aktyvumas",
    options: [
      { value: "normalus", label: "Normalus" },
      { value: "sumazejas", label: "Sumažėjęs" },
      { value: "labai_sumazejas", label: "Labai sumažėjęs" },
      { value: "padidejas", label: "Padidėjęs" },
    ],
  },
  {
    key: "urination",
    label: "Šlapinimasis",
    options: [
      { value: "normalus", label: "Normalus" },
      { value: "dazniau", label: "Dažniau nei įprastai" },
      { value: "reciau", label: "Rečiau nei įprastai" },
      { value: "sunku", label: "Sunku pasišlapinti" },
      { value: "su_krauju", label: "Su krauju" },
    ],
  },
  {
    key: "defecation",
    label: "Tuštinimasis",
    options: [
      { value: "normalus", label: "Normalus" },
      { value: "viduriuoja", label: "Viduriuoja" },
      { value: "vidurius_uzkietejes", label: "Užkietėjęs" },
      { value: "nera", label: "Nebuvo" },
    ],
  },
];

export function DiaryEntryForm({ catId, onSaved }: { catId: string; onSaved: (entry: DiaryEntry) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = React.useState(today);
  const [weightKg, setWeightKg] = React.useState("");
  const [values, setValues] = React.useState<Record<string, string>>({
    appetite: "normalus",
    waterIntake: "normalus",
    activity: "normalus",
    urination: "normalus",
    defecation: "normalus",
  });
  const [medications, setMedications] = React.useState("");
  const [notes, setNotes] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: DiaryEntry = {
      id: newId(),
      catId,
      date,
      weightKg: weightKg ? Number(weightKg) : undefined,
      appetite: values.appetite as DiaryEntry["appetite"],
      waterIntake: values.waterIntake as DiaryEntry["waterIntake"],
      activity: values.activity as DiaryEntry["activity"],
      urination: values.urination as DiaryEntry["urination"],
      defecation: values.defecation as DiaryEntry["defecation"],
      medications: medications || undefined,
      notes: notes || undefined,
    };
    onSaved(entry);
    setNotes("");
    setMedications("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight">Svoris (kg, nebūtina)</Label>
          <Input
            id="weight"
            type="number"
            step="0.05"
            placeholder="pvz. 4.2"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SELECT_FIELDS.map((field) => (
          <div className="space-y-1.5" key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            <select
              id={field.key}
              className="flex h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm"
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
            >
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="medications">Vaistai (nebūtina)</Label>
        <Input
          id="medications"
          placeholder="pvz. antibiotikas, 1 tabletė ryte"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Pastabos</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <Button type="submit">Išsaugoti įrašą</Button>
    </form>
  );
}
