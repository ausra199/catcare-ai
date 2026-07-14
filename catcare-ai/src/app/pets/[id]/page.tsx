"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetForm } from "@/components/pet-form";
import { HealthHistoryForm } from "@/components/health-history-form";
import { HealthHistoryList } from "@/components/health-history-list";
import { repository } from "@/lib/storage";
import type { Cat, HealthHistoryEntry } from "@/lib/types";

export default function EditPetPage() {
const params = useParams<{ id: string }>();
const router = useRouter();
const [cat, setCat] = React.useState<Cat | null | undefined>(undefined);
const [history, setHistory] = React.useState<HealthHistoryEntry[]>([]);

React.useEffect(() => {
const found = repository.getCat(params.id);
setCat(found ?? null);
if (found) setHistory(repository.getHealthHistory(found.id));
}, [params.id]);

if (cat === undefined) return null;

if (cat === null) {
return (
<div className="mx-auto max-w-lg space-y-4">
<p className="text-sm text-muted-foreground">Profilis nerastas.</p>
<button onClick={() => router.push("/pets")} className="text-sm text-primary underline">
Grįžti į profilių sąrašą
</button>
</div>
);
}

return (
<div className="mx-auto max-w-lg space-y-6 pb-10">
<Card>
<CardHeader>
<CardTitle>Redaguoti profilį</CardTitle>
</CardHeader>
<CardContent>
<PetForm
initial={cat}
onSaved={(saved) => {
repository.saveCat(saved);
router.push("/pets");
}}
/>
</CardContent>
</Card>

<div className="whisker-divider" />

<Card>
<CardHeader>
<CardTitle>Sveikatos istorija</CardTitle>
<p className="text-xs text-muted-foreground">
Pridėkite vizitų, tyrimų ar vakcinacijos įrašus kartu su dokumentais.
</p>
</CardHeader>
<CardContent>
<HealthHistoryForm
catId={cat.id}
onSaved={(entry) => {
repository.saveHealthHistoryEntry(entry);
setHistory(repository.getHealthHistory(cat.id));
}}
/>
</CardContent>
</Card>

<div className="space-y-3">
<h2 className="font-display text-lg font-semibold">Įrašų istorija</h2>
<HealthHistoryList
entries={history}
onDelete={(id) => {
repository.deleteHealthHistoryEntry(id);
setHistory(repository.getHealthHistory(cat.id));
}}
/>
</div>
</div>
);
}
