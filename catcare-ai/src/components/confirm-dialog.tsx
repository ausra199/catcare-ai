"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ConfirmDialog({
open,
title,
description,
confirmLabel = "Ištrinti",
cancelLabel = "Atšaukti",
destructive = true,
onConfirm,
onCancel,
}: {
open: boolean;
title: string;
description: string;
confirmLabel?: string;
cancelLabel?: string;
destructive?: boolean;
onConfirm: () => void;
onCancel: () => void;
}) {
if (!open) return null;

return (
<div
className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
role="dialog"
aria-modal="true"
onClick={onCancel}
>
<Card className="w-full max-w-sm animate-in" onClick={(e) => e.stopPropagation()}>
<CardContent className="space-y-4 pt-6">
<div className="flex items-start gap-3">
{destructive && (
<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
<AlertTriangle className="h-5 w-5 text-destructive" />
</div>
)}
<div>
<h3 className="font-display text-lg font-semibold">{title}</h3>
<p className="mt-1 text-sm text-muted-foreground">{description}</p>
</div>
</div>
<div className="flex justify-end gap-2">
<Button variant="outline" onClick={onCancel}>
{cancelLabel}
</Button>
<Button variant={destructive ? "destructive" : "default"} onClick={onConfirm}>
{confirmLabel}
</Button>
</div>
</CardContent>
</Card>
</div>
);
}
