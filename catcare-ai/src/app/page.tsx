"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardPlus, History, NotebookPen, TrendingUp, PawPrint } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PetProfileCard } from "@/components/pet-profile-card";
import { PetForm } from "@/components/pet-form";
import { repository } from "@/lib/storage";
import type { Cat } from "@/lib/types";

const MENU_ITEMS = [
  {
    href: "/assessment",
    title: "Naujas sveikatos įvertinimas",
    description: "Pasirinkite simptomus ir gaukite skubumo įvertinimą",
    icon: ClipboardPlus,
  },
  {
    href: "/history",
    title: "Sveikatos istorija",
    description: "Peržiūrėkite ankstesnius įvertinimus",
    icon: History,
  },
  {
    href: "/diary",
    title: "Dienoraštis",
    description: "Registruokite kasdienę savijautą",
    icon: NotebookPen,
  },
  {
    href: "/risk-analysis",
    title: "Rizikos analizė",
    description: "Ilgalaikės sveikatos tendencijos",
    icon: TrendingUp,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [cat, setCat] = React.useState<Cat | null | undefined>(undefined);

  React.useEffect(() => {
    const activeId = repository.getActiveCatId();
    const cats = repository.getCats();
    const found = activeId ? cats.find((c) => c.id === activeId) : cats[0];
    setCat(found ?? null);
  }, []);

  if (cat === undefined) return null;

  if (cat === null) {
    return (
      <div className="mx-auto max-w-lg space-y-6 pt-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PawPrint className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-semibold">Pridėkite savo katę</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pirmiausia sukurkite katės profilį, kad galėtume pritaikyti sveikatos įvertinimus.
          </p>
        </div>
        <DisclaimerBanner />
        <Card>
          <CardContent className="pt-5">
            <PetForm
              onSaved={(newCat) => {
                repository.saveCat(newCat);
                setCat(newCat);
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <DisclaimerBanner />
      <PetProfileCard cat={cat} />

      <div className="whisker-divider" />

      <div className="grid gap-4 sm:grid-cols-2">
        {MENU_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-right">
        <Button variant="ghost" size="sm" onClick={() => router.push("/pet")}>
          Redaguoti katės profilį
        </Button>
      </div>
    </div>
  );
}
