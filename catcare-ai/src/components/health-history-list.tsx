"use client";

import * as React from "react";
import { FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatBytes } from "@/lib/file-utils";
import type { HealthHistoryEntry } from "@/lib/types";

export function HealthHistoryList({
entries,
onDelete,
}: {
entries: HealthHistoryEntry[];
onDelete: (id: string) => void;
}) {
const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

if (entries.length === 0) {
return <p className="text-sm text-muted-foreground">Kol kas sveikatos istorijos įrašų nėra.</p>;
}

// Įrašai jau atkeliauja surikiuoti chronologiškai (naujausi viršuje) iš repository.getHealthHistory().
return (
<div className="space-y-3">
{entries.map((entry) => (
<Card key={entry.id}>
<CardContent className="space-y-2 p-4">
<div className="flex flex-wrap items-start justify-between gap-2">
<div>
<p className="text-xs text-muted-foreground">
{new Date(entry.date).toLocaleDateString("lt-LT", {
year: "numeric",
month: "long",
day: "numeric",
})}
</p>
<h3 className="font-display text-base font-semibold">{entry.title}</h3>
</div>
<button
type="button"
onClick={() => setPendingDeleteId(entry.id)}
aria-label="Ištrinti įrašą"
className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
>
<Trash2 className="h-4 w-4" />
</button>
</div>

{entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}

{entry.attachments.length > 0 && (
<div className="flex flex-wrap gap-2 pt-1">
{entry.attachments.map((a) => (
<a
key={a.id}
href={a.dataUrl}
download={a.name}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs hover:bg-muted"
>
{a.mimeType.startsWith("image/") ? (
<ImageIcon className="h-3.5 w-3.5" />
) : (
<FileText className="h-3.5 w-3.5" />
)}
<span className="max-w-[140px] truncate">{a.name}</span>
<span className="text-muted-foreground">({formatBytes(a.sizeBytes)})</span>
</a>
))}
</div>
)}
</CardContent>
</Card>
))}

<ConfirmDialog
open={pendingDeleteId !== null}
title="Ištrinti įrašą?"
description="Šis sveikatos istorijos įrašas ir prie jo pridėti failai bus negrįžtamai ištrinti."
onCancel={() => setPendingDeleteId(null)}
onConfirm={() => {
if (pendingDeleteId) onDelete(pendingDeleteId);
setPendingDeleteId(null);
}}
/>
</div>
);
}
