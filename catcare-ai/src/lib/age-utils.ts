/**
* Amžiaus skaičiavimas pagal gimimo datą.
* Naudojama visur, kur reikia rodyti katės amžių - visada perskaičiuojama
* iš `birthDate`, niekada nesaugoma kaip statinė reikšmė, kad amžius
* automatiškai atsinaujintų su kiekviena diena.
*/

export interface AgeBreakdown {
years: number;
months: number;
totalMonths: number;
totalDays: number;
}

export function computeAge(birthDateIso: string, atDate: Date = new Date()): AgeBreakdown {
const birth = new Date(birthDateIso);
const now = atDate;

let years = now.getFullYear() - birth.getFullYear();
let months = now.getMonth() - birth.getMonth();

if (now.getDate() < birth.getDate()) {
months -= 1;
}
if (months < 0) {
years -= 1;
months += 12;
}
if (years < 0) {
years = 0;
months = 0;
}

const totalMonths = years * 12 + months;
const totalDays = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)));

return { years, months, totalMonths, totalDays };
}

function pluralYears(n: number): string {
if (n === 1) return "metai";
if (n % 10 === 1 && n % 100 !== 11) return "metai";
return "metų";
}

function pluralMonths(n: number): string {
if (n === 1) return "mėnuo";
if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return "mėnesiai";
return "mėnesių";
}

/** Formatuoja amžių žmogui suprantama forma, pvz. "2 metai, 3 mėnesiai". */
export function formatAge(birthDateIso: string | undefined | null, atDate: Date = new Date()): string {
if (!birthDateIso) return "Amžius nenurodytas";
const { years, months, totalDays } = computeAge(birthDateIso, atDate);

if (years === 0 && months === 0) {
if (totalDays < 0) return "Gimimo data ateityje";
return `${totalDays} d.`;
}
if (years === 0) {
return `${months} ${pluralMonths(months)}`;
}
return `${years} ${pluralYears(years)}, ${months} ${pluralMonths(months)}`;
}
