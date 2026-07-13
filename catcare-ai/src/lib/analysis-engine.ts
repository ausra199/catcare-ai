import type {
  AnswerValue,
  AssessmentResult,
  Cat,
  SymptomId,
  UrgencyInfo,
  UrgencyLevel,
} from "@/lib/types";
import { checkRedFlags } from "@/data/red-flags";
import { getPossibleCauses } from "@/data/cause-rules";
import { getSymptomLabel } from "@/data/symptom-list";
import { newId } from "@/lib/storage";

type Answers = Record<string, AnswerValue>;

const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  namuose: "Galima stebėti namuose",
  per_24h: "Rekomenduojama kreiptis į veterinarą per 24 val.",
  siandien: "Reikalinga veterinaro konsultacija šiandien",
  skubu: "Skubi veterinarinė pagalba",
};

function scoreUrgency(symptoms: SymptomId[], answers: Answers): { level: UrgencyLevel; explanation: string } {
  let score = 0;
  const reasons: string[] = [];

  if (symptoms.includes("vemia")) {
    const count = Number(answers["count"] ?? 0);
    if (count >= 4) { score += 3; reasons.push("dažnas vėmimas"); }
    else if (count >= 2) { score += 1; reasons.push("pasikartojantis vėmimas"); }
    if (answers["blood"] === true) { score += 3; reasons.push("kraujas vėmale"); }
  }
  if (symptoms.includes("viduriuoja")) {
    score += 1;
    if (answers["blood"] === true) { score += 2; reasons.push("kraujas išmatose"); }
  }
  if (symptoms.includes("nevalgo")) {
    if (answers["duration"] === "48h_plus") { score += 3; reasons.push("nevalgo daugiau nei 48 val."); }
    else if (answers["duration"] === "24h") { score += 1; reasons.push("nevalgo apie parą"); }
  }
  if (symptoms.includes("slubuoja") && answers["weight_bearing"] === true) {
    score += 2; reasons.push("visai nesiremia į koją");
  }
  if (symptoms.includes("salpinasi_dazniau") || symptoms.includes("kraujas_slapime")) {
    score += 2; reasons.push("šlapimo takų simptomai");
  }
  if (answers["eats"] === "nevalgo" || answers["drinks"] === "mazai") {
    score += 1; reasons.push("nevalgo/negeria");
  }
  if (answers["temperature"] === "pakelta") { score += 2; reasons.push("pakelta temperatūra"); }

  let level: UrgencyLevel = "namuose";
  if (score >= 6) level = "skubu";
  else if (score >= 4) level = "siandien";
  else if (score >= 2) level = "per_24h";

  const explanation =
    reasons.length > 0
      ? `Vertinimas paremtas: ${reasons.join(", ")}.`
      : "Šiuo metu nenustatyta rimtų perspėjimo ženklų, tačiau stebėkite katės būklę.";

  return { level, explanation };
}

function buildSummary(cat: Cat, symptoms: SymptomId[], answers: Answers): string {
  const symptomLabels = symptoms.map((s) => getSymptomLabel(s).toLowerCase());
  const parts: string[] = [];

  parts.push(`${cat.name} pastebimas šis pagrindinis požymis: ${symptomLabels.join(", ")}.`);

  if (answers["onset"]) {
    const onsetMap: Record<string, string> = {
      sian_val: "Prasidėjo prieš kelias valandas.",
      vakar: "Prasidėjo vakar.",
      kelios_dienos: "Prasidėjo prieš kelias dienas.",
      savaite_plus: "Tęsiasi savaitę ar ilgiau.",
      dabar: "Prasidėjo ką tik.",
      diena_plus: "Tęsiasi dieną ar ilgiau.",
      stai: "Prasidėjo staiga.",
      palaipsniui: "Vystėsi palaipsniui.",
      staiga: "Atsirado staiga.",
    };
    if (onsetMap[String(answers["onset"])]) parts.push(onsetMap[String(answers["onset"])]);
  }

  if (typeof answers["count"] === "number") {
    parts.push(`Per pastarą parą tai nutiko apie ${answers["count"]} kartus.`);
  }

  if (answers["eats"]) {
    const eatsMap: Record<string, string> = {
      normaliai: "Apetitas nepakitęs.",
      mazai: "Apetitas sumažėjęs.",
      nevalgo: "Katė visiškai nevalgo.",
    };
    if (eatsMap[String(answers["eats"])]) parts.push(eatsMap[String(answers["eats"])]);
  }

  if (answers["drinks"]) {
    const drinksMap: Record<string, string> = {
      normaliai: "Vandens geria normaliai.",
      daug: "Vandens geria daugiau nei įprastai.",
      mazai: "Vandens geria mažai arba negeria.",
    };
    if (drinksMap[String(answers["drinks"])]) parts.push(drinksMap[String(answers["drinks"])]);
  }

  if (answers["blood"] === true) parts.push("Pastebėta kraujo.");

  return parts.join(" ");
}

function buildVetQuestions(symptoms: SymptomId[], answers: Answers): string[] {
  const questions = new Set<string>();

  questions.add("Kada tiksliai prasidėjo simptomai ir kaip jie keitėsi nuo tada?");
  questions.add("Ar reikalingi papildomi tyrimai (kraujo, šlapimo, echoskopija ar rentgenas)?");

  if (symptoms.includes("vemia") || symptoms.includes("viduriuoja")) {
    questions.add("Ar reikia keisti mitybą arba skirti specialią dietą atsigavimo laikotarpiu?");
    questions.add("Kokie dehidratacijos požymiai man reikėtų stebėti namuose?");
  }
  if (symptoms.includes("geria_daug") || symptoms.includes("svorio_kritimas")) {
    questions.add("Ar verta patikrinti inkstų funkciją ir cukraus kiekį kraujyje?");
  }
  if (symptoms.includes("slubuoja")) {
    questions.add("Ar reikalingas rentgenas įvertinti kaulų/sąnarių būklę?");
    questions.add("Ar reikia riboti katės judėjimą atsigavimo metu?");
  }
  if (symptoms.includes("negali_pasislapinti") || symptoms.includes("kraujas_slapime") || symptoms.includes("salpinasi_dazniau")) {
    questions.add("Ar reikalinga kateterizacija arba šlapimo takų tyrimas?");
    questions.add("Kokia dieta galėtų sumažinti pasikartojimo riziką?");
  }
  if (symptoms.includes("traukuliai")) {
    questions.add("Ar reikalingi neurologiniai tyrimai?");
    questions.add("Ką daryti, jei traukuliai pasikartos namuose?");
  }
  if (symptoms.includes("niezti_oda") || symptoms.includes("zaizda")) {
    questions.add("Ar reikalinga parazitų profilaktikos peržiūra?");
  }

  questions.add("Kokių ženklų namuose turėčiau stebėti, kad suprasčiau, jog būklė blogėja?");

  return Array.from(questions).slice(0, 10);
}

export function runAssessment(
  cat: Cat,
  symptoms: SymptomId[],
  answers: Answers
): AssessmentResult {
  const ageMonthsTotal = cat.ageYears * 12 + cat.ageMonths;
  const redFlags = checkRedFlags(symptoms, answers, ageMonthsTotal);
  const urgencyScore = scoreUrgency(symptoms, answers);

  const urgency: UrgencyInfo = redFlags.triggered
    ? {
        level: "skubu",
        label: URGENCY_LABELS.skubu,
        explanation: `Nustatyti skubūs požymiai: ${redFlags.reasons.join("; ")}.`,
      }
    : {
        level: urgencyScore.level,
        label: URGENCY_LABELS[urgencyScore.level],
        explanation: urgencyScore.explanation,
      };

  const possibleCauses = redFlags.triggered ? [] : getPossibleCauses(symptoms, answers);
  const summary = buildSummary(cat, symptoms, answers);
  const vetQuestions = buildVetQuestions(symptoms, answers);

  return {
    id: newId(),
    catId: cat.id,
    createdAt: new Date().toISOString(),
    symptoms,
    answers,
    summary,
    possibleCauses,
    urgency,
    redFlags,
    vetQuestions,
  };
}
