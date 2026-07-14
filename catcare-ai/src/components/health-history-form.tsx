"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AttachmentUploader } from "@/components/attachment-uploader";
import { newId } from "@/lib/storage";
import type { Attachment, HealthHistoryEntry } from "@/lib/types";

const todayIso = () => new Date().toISOString().slice(0, 10);

export function HealthHistoryForm({
catId,
onSaved,
}: {
catId: string;
onSaved: (entry: HealthHistoryEntry) => void;
}) {
const [date, setDate] = React.useState(todayIso());
const [title, setTitle] = React.useState("");
const [notes, setNotes] = React.useState("");
const [attachments, setAttachments] = React.useState<Attachment[]>([]);
const [error, setError] = React.useState<string | null>(null);

function handleSubmit(e: React.FormEvent) {
e.preventDefault();
if (!title.trim()) {
setError("Įveskite trumpą įrašo pavadinimą (pvz. „Kraujo tyrimas“).");
return;
}
const entry: HealthHistoryEntry = {
id: newId(),
catId,
date,
title: title.trim(),
notes: notes.trim() || undefined,
attachments,
createdAt: new Date().toISOString(),
};
onSaved(entry);
setTitle("");
setNotes("");
setAttachments([]);
setDate(todayIso());
setError(null);
}

return (
<form onSubmit={handleSubmit} className="space-y-4">
<div className="grid gap-4 sm:grid-cols-2">
<div className="space-y-1.5">
<Label htmlFor="hh-date">Data</Label>
<Input id="hh-date" type="date" max={todayIso()} value={date} onChange={(e) => setDate(e.target.value)} />
</div>
<div className="space-y-1.5">
<Label htmlFor="hh-title">Pavadinimas</Label>
<Input
id="hh-title"
placeholder="pvz. Kraujo tyrimas, Vakcinacija, Vizitas pas veterinarą"
value={title}
onChange={(e) => setTitle(e.target.value)}
/>
</div>
</div>

<div className="space-y-1.5">
<Label htmlFor="hh-notes">Pastabos (nebūtina)</Label>
<Textarea
id="hh-notes"
placeholder="Trumpas aprašymas, rezultatai, veterinaro rekomendacijos..."
value={notes}
onChange={(e) => setNotes(e.target.value)}
/>
</div>

<div className="space-y-1.5">
<Label>Tyrimų rezultatai / dokumentai</Label>
<AttachmentUploader attachments={attachments} onChange={setAttachments} />
</div>

{error && <p className="text-xs text-destructive">{error}</p>}

<Button type="submit">Pridėti įrašą</Button>
</form>
);
}
