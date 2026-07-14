"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PetForm } from "@/components/pet-form";
import { repository } from "@/lib/storage";

export default function NewPetPage() {
const router = useRouter();

return (
<div className="mx-auto max-w-lg space-y-6">
<Card>
<CardHeader>
<CardTitle>Naujas katės profilis</CardTitle>
</CardHeader>
<CardContent>
<PetForm
onSaved={(cat) => {
repository.saveCat(cat);
repository.setActiveCatId(cat.id);
router.push("/pets");
}}
/>
</CardContent>
</Card>
</div>
);
}
