import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-warning/40 bg-warning/10 text-foreground",
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p>
        <strong>Ši programa nepakeičia veterinaro konsultacijos.</strong> Ji padeda įvertinti situaciją ir
        pasiruošti vizitui.
      </p>
    </div>
  );
}
