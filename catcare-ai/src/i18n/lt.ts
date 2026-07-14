/**
* Minimali i18n architektūra. MVP naudoja tik lietuvių kalbą, bet visas
* tekstas einantis per navigaciją/bendrus komponentus yra sutelktas čia,
* kad pridėti naują kalbą užtektų: (1) sukurti dictionaries/xx.ts su tuo
* pačiu raktų sąrašu, (2) `LocaleProvider` perjungti pagal vartotojo
* pasirinkimą ar naršyklės locale. Simptomų medžio ir priežasčių tekstai
* (data/*.ts) šiuo metu yra lietuviškai užkoduoti tiesiogiai - juos
* internacionalizuojant patogiausia išskaidyti į atskirus `xx.ts` failus
* pagal tą pačią struktūrą.
*/
export const lt = {
appName: "CatCare AI",
nav: {
home: "Pradžia",
pets: "Profiliai",
newAssessment: "Naujas sveikatos įvertinimas",
history: "Sveikatos istorija",
diary: "Dienoraštis",
risk: "Rizikos analizė",
},
disclaimer: "Ši programa nepakeičia veterinaro konsultacijos. Ji padeda įvertinti situaciją ir pasiruošti vizitui.",
} as const;

export type Dictionary = typeof lt;
export function useDictionary(): Dictionary {
// Ateityje: skaityti locale iš context/cookie ir grąžinti atitinkamą žodyną.
return lt;
}
