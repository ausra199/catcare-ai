"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Cat } from "@/lib/types";
import { newId } from "@/lib/storage";
import { formatAge } from "@/lib/age-utils";
import { readImageAsCompressedDataUrl } from "@/lib/file-utils";

const todayIso = () => new Date().toISOString().slice(0, 10);

const catSchema = z.object({
name: z.string().min(1, "Įveskite katės vardą"),
birthDate: z
.string()
.min(1, "Įveskite arba pasirinkite gimimo datą")
.refine((v) => new Date(v) <= new Date(), "Gimimo data negali būti ateityje"),
gender: z.enum(["patinas", "patele"]),
neutered: z.coerce.boolean(),
breed: z.string().optional(),
weightKg: z.coerce.number().min(0.2).max(15),
});

type CatFormValues = z.infer<typeof catSchema>;

export function PetForm({ initial, onSaved }: { initial?: Cat; onSaved: (cat: Cat) => void }) {
const [photoUrl, setPhotoUrl] = React.useState<string | undefined>(initial?.photoUrl);
const [photoProcessing, setPhotoProcessing] = React.useState(false);
const [photoError, setPhotoError] = React.useState<string | null>(null);
const fileInputRef = React.useRef<HTMLInputElement>(null);

const {
register,
handleSubmit,
watch,
formState: { errors, isSubmitting },
} = useForm<CatFormValues>({
resolver: zodResolver(catSchema),
defaultValues: initial
? {
name: initial.name,
birthDate: initial.birthDate,
gender: initial.gender,
neutered: initial.neutered,
breed: initial.breed,
weightKg: initial.weightKg,
}
: {
name: "",
birthDate: "",
gender: "patele",
neutered: false,
breed: "",
weightKg: 4,
},
});

const watchedBirthDate = watch("birthDate");

async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
const file = e.target.files?.[0];
if (!file) return;
setPhotoError(null);
if (!file.type.startsWith("image/")) {
setPhotoError("Prašome pasirinkti paveikslėlio failą.");
return;
}
setPhotoProcessing(true);
try {
const compressed = await readImageAsCompressedDataUrl(file);
setPhotoUrl(compressed);
} catch {
setPhotoError("Nepavyko apdoroti nuotraukos. Bandykite kitą failą.");
} finally {
setPhotoProcessing(false);
}
}

function onSubmit(values: CatFormValues) {
const cat: Cat = {
id: initial?.id ?? newId(),
createdAt: initial?.createdAt ?? new Date().toISOString(),
name: values.name,
birthDate: values.birthDate,
gender: values.gender,
neutered: values.neutered,
breed: values.breed ?? "",
weightKg: values.weightKg,
photoUrl,
};
onSaved(cat);
}

return (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<div className="flex items-center gap-4">
<button
type="button"
onClick={() => fileInputRef.current?.click()}
className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted"
aria-label="Įkelti katės nuotrauką"
>
{photoProcessing ? (
<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
) : photoUrl ? (
// eslint-disable-next-line @next/next/no-img-element
<img src={photoUrl} alt="Katės nuotrauka" className="h-full w-full object-cover" />
) : (
<PawPrint className="h-8 w-8 text-muted-foreground" />
)}
<span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
<Camera className="h-5 w-5 text-white" />
</span>
</button>
<div>
<Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
{photoUrl ? "Keisti nuotrauką" : "Įkelti nuotrauką"}
</Button>
<input
ref={fileInputRef}
type="file"
accept="image/*"
className="hidden"
onChange={handlePhotoChange}
/>
{photoError && <p className="mt-1 text-xs text-destructive">{photoError}</p>}
</div>
</div>

<div className="grid gap-4 sm:grid-cols-2">
<div className="space-y-1.5 sm:col-span-2">
<Label htmlFor="name">Vardas</Label>
<Input id="name" placeholder="pvz. Murka" {...register("name")} />
{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
</div>

<div className="space-y-1.5">
<Label htmlFor="birthDate">Gimimo data</Label>
<Input id="birthDate" type="date" max={todayIso()} {...register("birthDate")} />
{errors.birthDate && <p className="text-xs text-destructive">{errors.birthDate.message}</p>}
{watchedBirthDate && !errors.birthDate && (
<p className="text-xs text-muted-foreground">Amžius: {formatAge(watchedBirthDate)}</p>
)}
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

<Button type="submit" disabled={isSubmitting || photoProcessing} className="w-full sm:w-auto">
Išsaugoti profilį
</Button>
</form>
);
}
