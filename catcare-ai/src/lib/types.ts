/**
 * * CatCare AI - pagrindiniai duomenų tipai.
 *
 * Šis failas apibrėžia visą programos duomenų modelį. Struktūra sąmoningai
 * sukurta taip, kad ateityje `LocalStorageRepository` (žr. lib/storage.ts)
 * būtų galima pakeisti API/PostgreSQL realizacija nekeičiant komponentų kodo -
 * visi komponentai naudoja tik `Repository` sąsają, o ne tiesiogiai localStorage.
 */

 export type Gender = "patinas" | "patele";

 export interface Cat {
 id: string;
 name: string;
 /** ISO data (YYYY-MM-DD). Amžius visada skaičiuojamas iš šios datos - žr. lib/age-utils.ts */
 birthDate: string;
 gender: Gender;
 neutered: boolean;
 breed: string;
 weightKg: number;
 photoUrl?: string;
 createdAt: string;
 }

 /** Visi palaikomi pirminiai simptomai (1-as vedlio žingsnis). */
 export type SymptomId =
 | "vemia"
 | "viduriuoja"
 | "nevalgo"
 | "geria_daug"
 | "mazai_geria"
 | "sunku_kvepuoti"
 | "slubuoja"
 | "salpinasi_dazniau"
 | "negali_pasislapinti"
 | "kraujas_slapime"
 | "traukuliai"
 | "koseja"
 | "ciaudi"
 | "niezti_oda"
 | "zaizda"
 | "patinimas"
 | "pasikeites_elgesys"
 | "svorio_kritimas"
 | "kitas";

 export type UrgencyLevel = "namuose" | "per_24h" | "siandien" | "skubu";

 export interface UrgencyInfo {
 level: UrgencyLevel;
 label: string;
 explanation: string;
 }

 /** Klausimo tipas simptomų medyje. */
 export type QuestionType = "single_select" | "multi_select" | "boolean" | "number" | "text";

 export interface QuestionOption {
 value: string;
 label: string;
 /** Jei pasirinkus šią reikšmę turi būti iškart keliama raudona vėliava. */
 redFlag?: boolean;
 }

 export interface SymptomQuestion {
 id: string;
 label: string;
 type: QuestionType;
 options?: QuestionOption[];
 unit?: string;
 /** Rodoma tik jei anksčiau atsakyta atitinkamai - kontekstiniai klausimai. */
 showIf?: (answers: Record<string, AnswerValue>) => boolean;
 }

 export type AnswerValue = string | string[] | number | boolean;

 export interface PossibleCause {
 id: string;
 name: string;
 /** Kodėl ji svarstoma - naudojami tik atsargūs formulavimai ("gali būti"). */
 why: string;
 /** Kokie simptomai/atsakymai ją patvirtina. */
 supportingFactors: string[];
 /** Kokie simptomai/atsakymai jai nepritaria. */
 contradictingFactors: string[];
 /** 0-100 santykinis atitikimo balas, naudojamas tik rikiavimui, niekada nerodomas kaip "tikimybė". */
 score: number;
 }

 export interface RedFlagResult {
 triggered: boolean;
 reasons: string[];
 }

 export interface AssessmentResult {
 id: string;
 catId: string;
 createdAt: string;
 symptoms: SymptomId[];
 answers: Record<string, AnswerValue>;
 summary: string;
 possibleCauses: PossibleCause[];
 urgency: UrgencyInfo;
 redFlags: RedFlagResult;
 vetQuestions: string[];
 }

 export interface DiaryEntry {
 id: string;
 catId: string;
 date: string; // YYYY-MM-DD
 weightKg?: number;
 appetite: "normalus" | "sumazejas" | "labai_sumazejas" | "padidejas" | "nevalgo";
 waterIntake: "normalus" | "sumazejas" | "padidejas" | "labai_padidejas";
 activity: "normalus" | "sumazejas" | "labai_sumazejas" | "padidejas";
 urination: "normalus" | "dazniau" | "reciau" | "sunku" | "su_krauju";
 defecation: "normalus" | "viduriuoja" | "vidurius_uzkietejes" | "nera";
 medications?: string;
 notes?: string;
 }

 export interface TrendAlert {
 id: string;
 severity: "info" | "warning" | "critical";
 message: string;
 metric: string;
 }

 export interface RiskAnalysisResult {
 riskScore: number; // 0-100
 alerts: TrendAlert[];
 weightTrendPct: number | null;
 waterTrendPct: number | null;
 windowDays: number;
 }

 /**
 * Prie sveikatos istorijos įrašo pridedamas failas (tyrimo rezultatas, nuotrauka ir pan.).
 * MVP versijoje failai saugomi kaip base64 duomenų URL tiesiai localStorage, todėl
 * UI riboja failo dydį (žr. lib/file-utils.ts). Ateityje pereinant prie API/S3 saugyklos,
 * `dataUrl` laukas paprasčiausiai taptų nuoroda į failą serveryje.
 */
 export interface Attachment {
 id: string;
 name: string;
 mimeType: string;
 sizeBytes: number;
 dataUrl: string;
 }

 export interface HealthHistoryEntry {
 id: string;
 catId: string;
 date: string; // YYYY-MM-DD
 title: string;
 notes?: string;
 attachments: Attachment[];
 createdAt: string;
 }

