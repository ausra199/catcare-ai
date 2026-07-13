import type { AnswerValue, RedFlagResult, SymptomId } from "@/lib/types";

/**
 * Raudonos vėliavos - jei bent viena suveikia, programa iškart nutraukia
 * įprastą analizę ir rodo skubios pagalbos pranešimą (žr. spec. 5 skyrių).
 */
export function checkRedFlags(
  symptoms: SymptomId[],
  answers: Record<string, AnswerValue>,
  catAgeMonthsTotal: number
): RedFlagResult {
  const reasons: string[] = [];

  if (symptoms.includes("sunku_kvepuoti")) {
    reasons.push("Katė negali normaliai kvėpuoti");
  }
  if (answers["severity"] === "pastangos" || answers["severity"] === "melynos") {
    reasons.push("Kvėpavimas su akivaizdžiomis pastangomis arba pamėlusios dantenos");
  }
  if (answers["gum_color"] === "melyna") {
    reasons.push("Dantenų ar liežuvio spalva melsva/pilka");
  }
  if (symptoms.includes("negali_pasislapinti") && answers["straining_no_output"] === true) {
    reasons.push("Katė negali pasišlapinti - tai gali būti šlapimo takų užsikimšimas");
  }
  if (answers["duration"] === "virs_24h" && symptoms.includes("negali_pasislapinti")) {
    reasons.push("Negali pasišlapinti ilgiau nei 24 valandas");
  }
  if (symptoms.includes("traukuliai")) {
    reasons.push("Katei ištiko traukuliai");
  }
  if (answers["toxin_exposure"] === true && symptoms.includes("traukuliai")) {
    reasons.push("Įtariamas apsinuodijimas kartu su traukuliais");
  }
  if (answers["plant_or_toxin"] === true && (symptoms.includes("vemia") || symptoms.includes("viduriuoja"))) {
    // apsinuodijimas galimas, bet savaime nebūtinai kritinis - tik jei kartu yra kitų sunkių ženklų
    if (answers["temperature"] === "labai_auksta" || answers["consciousness"] === false) {
      reasons.push("Galimas apsinuodijimas su sunkiais požymiais");
    }
  }
  if (answers["blood"] === true && symptoms.includes("vemia") && answers["count"] && Number(answers["count"]) >= 4) {
    reasons.push("Gausus kraujavimas vemiant");
  }
  if (answers["consciousness"] === false) {
    reasons.push("Katė nereaguoja / prarado sąmonę");
  }
  if (answers["temperature"] === "labai_auksta") {
    reasons.push("Labai aukšta kūno temperatūra (virš 40°C)");
  }
  if (symptoms.includes("zaizda") && answers["size"] === "didele") {
    reasons.push("Didelė ar stipriai kraujuojanti žaizda");
  }
  if (catAgeMonthsTotal <= 2 && (symptoms.includes("vemia") || symptoms.includes("viduriuoja") || symptoms.includes("nevalgo"))) {
    reasons.push("Kačiukas iki 8 savaičių su sunkiais simptomais - didelė dehidratacijos rizika");
  }

  return { triggered: reasons.length > 0, reasons };
}
