import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!IconComponent) return <Icons.HelpCircle {...props} />;
  return <IconComponent {...props} />;
}
