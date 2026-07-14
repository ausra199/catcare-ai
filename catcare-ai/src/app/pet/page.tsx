"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/**
* Senas maršrutas /pet paliktas nukreipimui suderinamumui - visas profilių
* valdymas dabar vyksta /pets (sąrašas) ir /pets/[id] (redagavimas) puslapiuose.
*/
export default function LegacyPetRedirectPage() {
const router = useRouter();
React.useEffect(() => {
router.replace("/pets");
}, [router]);
return null;
}
