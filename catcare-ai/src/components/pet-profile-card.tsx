import { Cake, Weight, Dna, PawPrint } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Cat } from "@/lib/types";
import { formatAge } from "@/lib/age-utils";

export function PetProfileCard({ cat }: { cat: Cat }) {
return (
<Card className="overflow-hidden">
<CardContent className="flex items-center gap-4 p-5">
<div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
{cat.photoUrl ? (
// eslint-disable-next-line @next/next/no-img-element
<img src={cat.photoUrl} alt={cat.name} className="h-full w-full object-cover" />
) : (
<PawPrint className="h-8 w-8 text-muted-foreground" />
)}
</div>
<div className="min-w-0 flex-1">
<div className="flex flex-wrap items-center gap-2">
<h2 className="font-display text-2xl font-semibold">{cat.name}</h2>
<Badge variant="outline">{cat.gender === "patinas" ? "Patinas" : "Patelė"}</Badge>
{cat.neutered && <Badge variant="muted">Sterilizuota</Badge>}
</div>
<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
<span className="inline-flex items-center gap-1">
<Cake className="h-3.5 w-3.5" /> {formatAge(cat.birthDate)}
</span>
<span className="inline-flex items-center gap-1">
<Dna className="h-3.5 w-3.5" /> {cat.breed || "Veislė nenurodyta"}
</span>
<span className="inline-flex items-center gap-1">
<Weight className="h-3.5 w-3.5" /> {cat.weightKg} kg
</span>
</div>
</div>
</CardContent>
</Card>
);
}
