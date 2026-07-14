import { v4 as uuidv4 } from "uuid";
import type { AssessmentResult, Cat, DiaryEntry, HealthHistoryEntry } from "./types";

/**
* Repository sąsaja atskiria komponentus nuo konkretaus duomenų saugojimo būdo.
* MVP versijoje - `LocalStorageRepository`. Ateityje pridėjus autentifikaciją
* ir PostgreSQL, pakanka sukurti `ApiRepository implements Repository` ir
* pakeisti vieną eksportą `repository` apačioje - komponentų kodas nekinta.
*/
export interface Repository {
getCats(): Cat[];
getCat(id: string): Cat | undefined;
saveCat(cat: Cat): void;
deleteCat(id: string): void;

getAssessments(catId?: string): AssessmentResult[];
getAssessment(id: string): AssessmentResult | undefined;
saveAssessment(result: AssessmentResult): void;
deleteAssessment(id: string): void;

getDiaryEntries(catId?: string): DiaryEntry[];
saveDiaryEntry(entry: DiaryEntry): void;
deleteDiaryEntry(id: string): void;

getHealthHistory(catId?: string): HealthHistoryEntry[];
saveHealthHistoryEntry(entry: HealthHistoryEntry): void;
deleteHealthHistoryEntry(id: string): void;

getActiveCatId(): string | null;
setActiveCatId(id: string): void;
}

const KEYS = {
cats: "catcare_cats",
assessments: "catcare_assessments",
diary: "catcare_diary",
healthHistory: "catcare_health_history",
activeCat: "catcare_active_cat",
} as const;

function read<T>(key: string, fallback: T): T {
if (typeof window === "undefined") return fallback;
try {
const raw = window.localStorage.getItem(key);
return raw ? (JSON.parse(raw) as T) : fallback;
} catch {
return fallback;
}
}

function write<T>(key: string, value: T): void {
if (typeof window === "undefined") return;
window.localStorage.setItem(key, JSON.stringify(value));
}

class LocalStorageRepository implements Repository {
getCats(): Cat[] {
return read<Cat[]>(KEYS.cats, []);
}
getCat(id: string): Cat | undefined {
return this.getCats().find((c) => c.id === id);
}
saveCat(cat: Cat): void {
const cats = this.getCats();
const idx = cats.findIndex((c) => c.id === cat.id);
if (idx >= 0) cats[idx] = cat;
else cats.push(cat);
write(KEYS.cats, cats);
if (!this.getActiveCatId()) this.setActiveCatId(cat.id);
}
deleteCat(id: string): void {
write(
KEYS.cats,
this.getCats().filter((c) => c.id !== id)
);
// Kartu išvalome su kate susijusius duomenis (vertinimai, dienoraštis, istorija),
// kad neliktų "našlaičių" įrašų, rodančių nebeegzistuojančią katę.
write(
KEYS.assessments,
read<AssessmentResult[]>(KEYS.assessments, []).filter((a) => a.catId !== id)
);
write(
KEYS.diary,
read<DiaryEntry[]>(KEYS.diary, []).filter((e) => e.catId !== id)
);
write(
KEYS.healthHistory,
read<HealthHistoryEntry[]>(KEYS.healthHistory, []).filter((e) => e.catId !== id)
);
if (this.getActiveCatId() === id) {
const remaining = this.getCats();
if (remaining.length > 0) this.setActiveCatId(remaining[0].id);
else write(KEYS.activeCat, null);
}
}

getAssessments(catId?: string): AssessmentResult[] {
const all = read<AssessmentResult[]>(KEYS.assessments, []);
return catId ? all.filter((a) => a.catId === catId) : all;
}
getAssessment(id: string): AssessmentResult | undefined {
return read<AssessmentResult[]>(KEYS.assessments, []).find((a) => a.id === id);
}
saveAssessment(result: AssessmentResult): void {
const all = read<AssessmentResult[]>(KEYS.assessments, []);
all.unshift(result);
write(KEYS.assessments, all);
}
deleteAssessment(id: string): void {
write(
KEYS.assessments,
this.getAssessments().filter((a) => a.id !== id)
);
}

getDiaryEntries(catId?: string): DiaryEntry[] {
const all = read<DiaryEntry[]>(KEYS.diary, []);
const filtered = catId ? all.filter((e) => e.catId === catId) : all;
return filtered.sort((a, b) => (a.date < b.date ? 1 : -1));
}
saveDiaryEntry(entry: DiaryEntry): void {
const all = read<DiaryEntry[]>(KEYS.diary, []);
const idx = all.findIndex((e) => e.catId === entry.catId && e.date === entry.date);
if (idx >= 0) all[idx] = entry;
else all.push(entry);
write(KEYS.diary, all);
}
deleteDiaryEntry(id: string): void {
write(
KEYS.diary,
read<DiaryEntry[]>(KEYS.diary, []).filter((e) => e.id !== id)
);
}

getHealthHistory(catId?: string): HealthHistoryEntry[] {
const all = read<HealthHistoryEntry[]>(KEYS.healthHistory, []);
const filtered = catId ? all.filter((e) => e.catId === catId) : all;
return filtered.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
saveHealthHistoryEntry(entry: HealthHistoryEntry): void {
const all = read<HealthHistoryEntry[]>(KEYS.healthHistory, []);
const idx = all.findIndex((e) => e.id === entry.id);
if (idx >= 0) all[idx] = entry;
else all.push(entry);
write(KEYS.healthHistory, all);
}
deleteHealthHistoryEntry(id: string): void {
write(
KEYS.healthHistory,
read<HealthHistoryEntry[]>(KEYS.healthHistory, []).filter((e) => e.id !== id)
);
}

getActiveCatId(): string | null {
return read<string | null>(KEYS.activeCat, null);
}
setActiveCatId(id: string): void {
write(KEYS.activeCat, id);
}
}

export const repository: Repository = new LocalStorageRepository();

export function newId(): string {
return uuidv4();
}
