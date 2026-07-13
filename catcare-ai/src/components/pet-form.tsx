"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cat } from "@/lib/types";
import { newId } from "@/lib/storage";

const catSchema = z.object({
  name: z.string().min(1, "Įveskite katės vardą"),
  ageYears: z.coerce.number().min(0).max(30),
  ageMonths: z.coerce.number().min(0).max(11),
  gender: z.enum(["patinas", "patele"]),
  neutered: z.coerce.boolean(),
  breed: z.string().optional(),
  weightKg: z.coerce.number().min(0.2).max(15),
});

type CatFormValues = z.infer<typeof catSchema>;

export function PetForm({ initial, onSaved }: { initial?: Cat; onSaved: (cat: Cat) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CatFormValues>({
    resolver: zodResolver(catSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          ageYears: initial.ageYears,
          ageMonths: initial.ageMonths,
          gender: initial.gender,
          neutered: initial.neutered,
          breed: initial.breed,
          weightKg: initial.weightKg,
        }
      : {
          name: "",
          ageYears: 1,
          ageMonths: 0,
          gender: "patele",
          neutered: false,
          breed: "",
          weightKg: 4,
        },
  });

  function onSubmit(values: CatFormValues) {
    const cat: Cat = {
      id: initial?.id ?? newId(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      name: values.name,
      ageYears: values.ageYears,
      ageMonths: values.ageMonths,
      gender: values.gender,
      neutered: values.neutered,
      breed: values.breed ?? "",
      weightKg: values.weightKg,
    };
    onSaved(cat);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Vardas</Label>
          <Input id="name" placeholder="pvz. Murka" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ageYears">Amžius (metai)</Label>
          <Input id="ageYears" type="number" step="1" {...register("ageYears")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ageMonths">Amžius (papildomi mėnesiai)</Label>
          <Input id="ageMonths" type="number" step="1" {...register("ageMonths")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="gender">Lytis</Label>
          <select
            id="gender"
            className="flex h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm"
            {...register("gender")}
          >
            <option value="patele">Patelė</option>
            <option value="patinas">Patinas</option>
          </select>
        </div>
        <div className="flex items-end space-x-2 pb-1">
          <input id="neutered" type="checkbox" className="h-5 w-5 rounded border-border" {...register("neutered")} />
          <Label htmlFor="neutered">Sterilizuota / kastruotas</Label>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="breed">Veislė</Label>
          <Input id="breed" placeholder="pvz. Europinė trumpaplaukė" {...register("breed")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weightKg">Svoris (kg)</Label>
          <Input id="weightKg" type="number" step="0.1" {...register("weightKg")} />
          {errors.weightKg && <p className="text-xs text-destructive">{errors.weightKg.message}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        Išsaugoti profilį
      </Button>
    </form>
  );
}
