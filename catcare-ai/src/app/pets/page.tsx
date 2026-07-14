"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, PawPrint, Pencil, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { repository } from "@/lib/storage";
import { formatAge } from "@/lib/age-utils";
import type { Cat } from "@/lib/types";

export default function PetsListPage() {
const router = useRouter();
const [cats, setCats] = React.useState<Cat[]>([]);
const [activeId, setActiveIdState] = React.useState<string | null>(null);
const [pendingDelete, setPendingDelete] = React.useState<Cat | null>(null);

function refresh() {
setCats(repository.getCats());
setActiveIdState(repository.getActiveCatId());
}

React.useEffect(() => {
refresh();
}, []);

function handleSelect(cat: Cat) {
repository.setActiveCatId(cat.id);
router.push("/");
}

function handleDelete() {
if (!pendingDelete) return;
repository.deleteCat(pendingDelete.id);
setPendingDelete(null);
refresh();
}

return (
<div className="space-y-6">
<div className="flex flex-wrap items-center justify-between gap-3">
<h1 className="font-display text-2xl font-semibold">Katės profiliai</h1>
<Button onClick={() => router.push("/pets/new")} className="gap-2">
<Plus className="h-4 w-4" /> Naujas profilis
</Button>
</div>

{cats.length === 0 ? (
<Card>
<CardContent className="space-y-3 pt-6 text-center">
<PawPrint className="mx-auto h-8 w-8 text-muted-foreground" />
<p className="text-sm text-muted-foreground">Kol kas nesukūrėte nė vieno katės profilio.</p>
<Button onClick={() => router.push("/pets/new")}>Sukurti pirmą profilį</Button>
</CardContent>
</Card>
) : (
<div className="grid gap-4 sm:grid-cols-2">
{cats.map((cat) => {
const isActive = cat.id === activeId;
return (
<Card key={cat.id} className={isActive ? "border-primary" : undefined}>
<CardContent className="space-y-3 p-5">
<div className="flex items-center gap-3">
<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
{cat.photoUrl ? (
// eslint-disable-next-line @next/next/no-img-element
<img src={cat.photoUrl} alt={cat.name} className="h-full w-full object-cover" />
) : (
<PawPrint className="h-6 w-6 text-muted-foreground" />
)}
</div>
<div className="min-w-0 flex-1">
<div className="flex items-center gap-2">
<h2 className="truncate font-display text-lg font-semibold">{cat.name}</h2>
{isActive && <Badge variant="success">Aktyvi</Badge>}
</div>
<p className="text-xs text-muted-foreground">
{formatAge(cat.birthDate)} · {cat.breed || "Veislė nenurodyta"}
</p>
</div>
</div>

<div className="flex flex-wrap gap-2">
{!isActive && (
<Button size="sm" variant="secondary" onClick={() => handleSelect(cat)} className="gap-1.5">
<Check className="h-3.5 w-3.5" /> Pasirinkti
</Button>
)}
<Button size="sm" variant="outline" onClick={() => router.push(`/pets/${cat.id}`)} className="gap-1.5">
<Pencil className="h-3.5 w-3.5" /> Redaguoti
</Button>
<Button
size="sm"
variant="ghost"
onClick={() => setPendingDelete(cat)}
className="gap-1.5 text-destructive hover:text-destructive"
>
<Trash2 className="h-3.5 w-3.5" /> Ištrinti
</Button>
</div>
</CardContent>
</Card>
);
})}
</div>
)}

<ConfirmDialog
open={pendingDelete !== null}
title={`Ištrinti profilį „${pendingDelete?.name}"?`}
description="Bus negrįžtamai ištrintas katės profilis kartu su visais susijusiais sveikatos įvertinimais, dienoraščio įrašais ir sveikatos istorija. Šio veiksmo atšaukti negalėsite."
onCancel={() => setPendingDelete(null)}
onConfirm={handleDelete}
/>
</div>
);
}
