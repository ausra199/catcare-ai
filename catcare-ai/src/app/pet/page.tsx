"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetForm } from "@/components/pet-form";
import { repository } from "@/lib/storage";
import type { Cat } from "@/lib/types";

export default function PetPage() {
  const router = useRouter();
  const [cat, setCat] = React.useState<Cat | null>(null);

  React.useEffect(() => {
    const activeId = repository.getActiveCatId();
    const cats = repository.getCats();
    setCat((activeId ? cats.find((c) => c.id === activeId) : cats[0]) ?? null);
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Katės profilis</CardTitle>
        </CardHeader>
        <CardContent>
          <PetForm
            initial={cat ?? undefined}
            onSaved={(saved) => {
              repository.saveCat(saved);
              router.push("/");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
