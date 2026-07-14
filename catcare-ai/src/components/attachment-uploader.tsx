"use client";

import * as React from "react";
import { FileText, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { newId } from "@/lib/storage";
import {
assertAttachmentSize,
estimateDataUrlBytes,
formatBytes,
readFileAsDataUrl,
readImageAsCompressedDataUrl,
FileTooLargeError,
} from "@/lib/file-utils";
import type { Attachment } from "@/lib/types";

export function AttachmentUploader({
attachments,
onChange,
}: {
attachments: Attachment[];
onChange: (next: Attachment[]) => void;
}) {
const inputRef = React.useRef<HTMLInputElement>(null);
const [processing, setProcessing] = React.useState(false);
const [error, setError] = React.useState<string | null>(null);

async function handleFiles(fileList: FileList | null) {
if (!fileList || fileList.length === 0) return;
setError(null);
setProcessing(true);
try {
const newAttachments: Attachment[] = [];
for (const file of Array.from(fileList)) {
try {
assertAttachmentSize(file);
} catch (e) {
if (e instanceof FileTooLargeError) {
setError(e.message);
continue;
}
throw e;
}
const isImage = file.type.startsWith("image/");
const dataUrl = isImage ? await readImageAsCompressedDataUrl(file, 1200) : await readFileAsDataUrl(file);
newAttachments.push({
id: newId(),
name: file.name,
mimeType: file.type || "application/octet-stream",
sizeBytes: estimateDataUrlBytes(dataUrl),
dataUrl,
});
}
onChange([...attachments, ...newAttachments]);
} catch {
setError("Nepavyko įkelti vieno ar kelių failų.");
} finally {
setProcessing(false);
if (inputRef.current) inputRef.current.value = "";
}
}

function removeAttachment(id: string) {
onChange(attachments.filter((a) => a.id !== id));
}

return (
<div className="space-y-2">
<input
ref={inputRef}
type="file"
multiple
accept="application/pdf,image/*"
className="hidden"
onChange={(e) => handleFiles(e.target.files)}
/>
<Button
type="button"
variant="outline"
size="sm"
onClick={() => inputRef.current?.click()}
disabled={processing}
className="gap-2"
>
<Paperclip className="h-4 w-4" />
{processing ? "Įkeliama..." : "Pridėti failą (PDF ar nuotrauka)"}
</Button>
<p className="text-xs text-muted-foreground">
Priimami PDF ir nuotraukų failai. Maksimalus dydis ~3 MB vienam failui (naršyklės saugyklos ribojimas).
</p>
{error && <p className="text-xs text-destructive">{error}</p>}

{attachments.length > 0 && (
<ul className="space-y-1.5">
{attachments.map((a) => (
<li
key={a.id}
className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
>
{a.mimeType.startsWith("image/") ? (
<ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
) : (
<FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
)}
<span className="min-w-0 flex-1 truncate">{a.name}</span>
<span className="shrink-0 text-xs text-muted-foreground">{formatBytes(a.sizeBytes)}</span>
<button
type="button"
onClick={() => removeAttachment(a.id)}
aria-label={`Pašalinti ${a.name}`}
className="shrink-0 text-muted-foreground hover:text-destructive"
>
<X className="h-4 w-4" />
</button>
</li>
))}
</ul>
)}
</div>
);
}
