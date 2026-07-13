import { CircleCheck, Clock, AlarmClockCheck, Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { UrgencyInfo } from "@/lib/types";

const CONFIG = {
  namuose: { variant: "success" as const, icon: CircleCheck },
  per_24h: { variant: "accent" as const, icon: Clock },
  siandien: { variant: "warning" as const, icon: AlarmClockCheck },
  skubu: { variant: "destructive" as const, icon: Siren },
};

export function UrgencyBadge({ urgency, className }: { urgency: UrgencyInfo; className?: string }) {
  const { variant, icon: Icon } = CONFIG[urgency.level];
  return (
    <Badge variant={variant} className={className}>
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      {urgency.label}
    </Badge>
  );
}
