import type { AnswerValue, PossibleCause, SymptomId } from "@/lib/types";

type Answers = Record<string, AnswerValue>;

function cause(
  id: string,
  name: string,
  why: string,
  supporting: string[],
  contradicting: string[],
  score: number
): PossibleCause {
  return { id, name, why, supportingFactors: supporting, contradictingFactors: contradicting, score };
}

function causesForVemia(a: Answers): PossibleCause[] {
  const out: PossibleCause[] = [];
  const blood = a["blood"] === true;
  const count = Number(a["count"] ?? 0);
  const eats = a["eats"];
  const toxin = a["plant_or_toxin"] === true;
  const outdoor = a["outdoor_access"] === true;
  const chronic = a["prior_episodes"] === "daznai";

  out.push(cause(
    "gastritas",
    "Skrandžio gleivinės sudirginimas (gastritas)",
    "Gali būti dažniausia ūmaus vėmimo priežastis, ypač jei epizodų nedaug ir katė bendrai jaučiasi neblogai.",
    [count <= 3 ? "Vėmimo epizodų nedaug" : "", eats !== "nevalgo" ? "Katė vis dar valgo bent šiek tiek" : ""].filter(Boolean),
    [count >= 5 ? "Labai dažnas vėmimas" : "", blood ? "Yra kraujo vėmale" : ""].filter(Boolean),
    40 + (count <= 3 ? 15 : 0) - (blood ? 20 : 0)
  ));

  out.push(cause(
    "svetimkunis",
    "Prarytas svetimkūnas ar virškinimo trakto užsikimšimas",
    "Svarstoma, jei vėmimas kartojasi, katė nevalgo arba yra žinoma, kad žaidė su siūlais/mažais daiktais.",
    [count >= 3 ? "Vėmimo epizodai kartojasi" : "", eats === "nevalgo" ? "Katė visiškai nevalgo" : ""].filter(Boolean),
    [outdoor ? "Katė turėjo prieigą lauke, kur tikėtinesnės kitos priežastys" : ""].filter(Boolean),
    30 + (eats === "nevalgo" ? 20 : 0) + (count >= 4 ? 10 : 0)
  ));

  out.push(cause(
    "apsinuodijimas",
    "Apsinuodijimas (augalu, chemine medžiaga ar sugadintu maistu)",
    "Svarstoma, nes nurodėte, kad katė galėjo suėsti augalą ar turėti prieigą prie nuodingos medžiagos.",
    [toxin ? "Galima prieiga prie augalo/nuodų" : ""].filter(Boolean),
    [!toxin ? "Nenurodėte galimo kontakto su nuodinga medžiaga" : ""].filter(Boolean),
    toxin ? 55 : 10
  ));

  out.push(cause(
    "inkstu_liga",
    "Lėtinė inkstų liga",
    "Svarstoma daugiausia vyresnio amžiaus katėms su pasikartojančiu vėmimu, ypač kartu su padidėjusiu troškuliu.",
    [chronic ? "Vėmimas kartojasi jau ilgesnį laiką" : ""].filter(Boolean),
    [!chronic ? "Vėmimas veikiau ūmus, ne lėtinis" : ""].filter(Boolean),
    chronic ? 35 : 12
  ));

  out.push(cause(
    "parazitai",
    "Virškinimo trakto parazitai",
    "Galima priežastis, ypač jaunoms katėms ar jei vėmimas kartojasi jau kurį laiką be aiškios priežasties.",
    [chronic ? "Kartojasi ilgesnį laiką" : ""].filter(Boolean),
    [],
    chronic ? 25 : 15
  ));

  return out;
}

function causesForViduriuoja(a: Answers): PossibleCause[] {
  const blood = a["blood"] === true;
  const chronic = a["prior_episodes"] === "daznai";
  const dietChange = a["plant_or_toxin"] === true;
  const eats = a["eats"];

  return [
    cause(
      "dietos_pokytis_ar_dirginimas",
      "Maisto netoleravimas ar staigus dietos pokytis",
      "Dažniausia viduriavimo priežastis, kai katė šiaip jaučiasi neblogai ir toliau valgo.",
      [eats === "normaliai" ? "Katė toliau valgo normaliai" : ""].filter(Boolean),
      [blood ? "Yra kraujo išmatose" : ""].filter(Boolean),
      45 - (blood ? 15 : 0)
    ),
    cause(
      "parazitai",
      "Virškinimo trakto parazitai",
      "Svarstoma, jei viduriavimas kartojasi arba trunka ilgiau, ypač jaunoms ar lauke buvusioms katėms.",
      [chronic ? "Viduriavimas kartojasi" : ""].filter(Boolean),
      [],
      chronic ? 40 : 20
    ),
    cause(
      "infekcija_virusine_bakterine",
      "Virusinė ar bakterinė žarnyno infekcija",
      "Galima priežastis, ypač jei kartu yra kraujo išmatose ar bendra būklė pablogėjusi.",
      [blood ? "Yra kraujo išmatose" : ""].filter(Boolean),
      [!blood ? "Kraujo išmatose nepastebėta" : ""].filter(Boolean),
      blood ? 45 : 20
    ),
    cause(
      "apsinuodijimas",
      "Apsinuodijimas ar sugadintas maistas",
      "Svarstoma dėl nurodyto galimo kontakto su nuodinga medžiaga ar sugadintu maistu.",
      [dietChange ? "Galimas kontaktas su nuodinga medžiaga/maistu" : ""].filter(Boolean),
      [!dietChange ? "Kontakto nenurodyta" : ""].filter(Boolean),
      dietChange ? 40 : 10
    ),
  ];
}

function causesForNevalgo(a: Answers): PossibleCause[] {
  const vomiting = a["vomiting"] === true;
  const mouthPain = a["mouth_pain"] === true;
  const duration = a["duration"];

  return [
    cause(
      "burnos_dantu_problema",
      "Burnos ar dantų skausmas",
      "Svarstoma, nes pastebėti skausmo prie burnos požymiai gali trukdyti katei valgyti.",
      [mouthPain ? "Pastebėti skausmo prie burnos požymiai" : ""].filter(Boolean),
      [!mouthPain ? "Skausmo prie burnos požymių nepastebėta" : ""].filter(Boolean),
      mouthPain ? 50 : 10
    ),
    cause(
      "virskinimo_sutrikimas",
      "Virškinimo trakto sutrikimas (pvz. gastritas)",
      "Galima priežastis, ypač jei nevalgymą lydi vėmimas.",
      [vomiting ? "Kartu vemia" : ""].filter(Boolean),
      [!vomiting ? "Vėmimo nepastebėta" : ""].filter(Boolean),
      vomiting ? 45 : 15
    ),
    cause(
      "sistemine_liga",
      "Sisteminė liga (pvz. inkstų, kepenų sutrikimas)",
      "Svarstoma, jei nevalgymas trunka ilgiau nei 48 val. ar kartojasi.",
      [duration === "48h_plus" ? "Nevalgo ilgiau nei 48 val." : ""].filter(Boolean),
      [duration === "12h" ? "Trunka trumpai, dar per anksti vertinti" : ""].filter(Boolean),
      duration === "48h_plus" ? 40 : 15
    ),
    cause(
      "stresas",
      "Stresas ar aplinkos pokytis",
      "Svarstoma, jei nėra kitų fizinių simptomų ir neseniai keitėsi aplinka ar rutina.",
      [!vomiting && !mouthPain ? "Kitų fizinių simptomų nepastebėta" : ""].filter(Boolean),
      [],
      !vomiting && !mouthPain ? 25 : 10
    ),
  ];
}

function causesForGeriaDaug(a: Answers): PossibleCause[] {
  const weightLoss = a["weight_change"] === "krito";
  const appetiteUp = a["appetite_change"] === "padidejo";
  const appetiteDown = a["appetite_change"] === "sumazejo";
  const longDuration = a["duration"] === "menesiai";

  return [
    cause(
      "inkstu_liga",
      "Lėtinė inkstų liga",
      "Viena dažniausių priežasčių senstančioms katėms, kai padidėja troškulys ir šlapinimasis.",
      [longDuration ? "Tęsiasi kelis mėnesius" : "", weightLoss ? "Kartu krenta svoris" : ""].filter(Boolean),
      [],
      35 + (longDuration ? 15 : 0) + (weightLoss ? 15 : 0)
    ),
    cause(
      "diabetas",
      "Cukrinis diabetas",
      "Svarstomas, kai padidėjęs troškulys derinasi su padidėjusiu apetitu ir svorio kritimu.",
      [appetiteUp ? "Padidėjęs apetitas" : "", weightLoss ? "Svorio kritimas" : ""].filter(Boolean),
      [appetiteDown ? "Apetitas sumažėjęs, ne padidėjęs" : ""].filter(Boolean),
      30 + (appetiteUp ? 20 : 0) + (weightLoss ? 15 : 0)
    ),
    cause(
      "hipertireoze",
      "Skydliaukės hiperfunkcija (dažniau vyresnėms katėms)",
      "Svarstoma, kai padidėjęs apetitas derinasi su svorio kritimu ir padidėjusiu troškuliu.",
      [appetiteUp ? "Padidėjęs apetitas" : "", weightLoss ? "Svorio kritimas" : ""].filter(Boolean),
      [],
      25 + (appetiteUp && weightLoss ? 25 : 0)
    ),
  ];
}

function causesForSunkuKvepuoti(a: Answers): PossibleCause[] {
  const trauma = a["trauma"] === true;
  const cough = a["cough"] === true;

  return [
    cause(
      "trauma_krutines",
      "Krūtinės ląstos trauma",
      "Svarstoma dėl nurodytos galimos traumos.",
      [trauma ? "Nurodyta galima trauma" : ""].filter(Boolean),
      [!trauma ? "Traumos nenurodyta" : ""].filter(Boolean),
      trauma ? 55 : 10
    ),
    cause(
      "kvepavimo_takutakel_infekcija",
      "Kvėpavimo takų ar plaučių infekcija/uždegimas",
      "Svarstoma, ypač jei kvėpavimo sunkumus lydi kosulys.",
      [cough ? "Kartu yra kosulys" : ""].filter(Boolean),
      [],
      cough ? 45 : 20
    ),
    cause(
      "skysciai_plaucaiuose_ar_sirdies_problema",
      "Skysčių kaupimasis krūtinės ląstoje ar širdies nepakankamumas",
      "Svarstoma esant sunkiam kvėpavimui be aiškios traumos ar kosulio priežasties - tai potencialiai rimta būklė.",
      [!trauma && !cough ? "Nėra aiškios traumos ar kosulio paaiškinimo" : ""].filter(Boolean),
      [],
      !trauma ? 45 : 20
    ),
  ];
}

function causesForSlubuoja(a: Answers): PossibleCause[] {
  const trauma = a["trauma"] === true;
  const noWeight = a["weight_bearing"] === true;
  const swelling = a["swelling"] === true;
  const gradual = a["onset"] === "palaipsniui";

  return [
    cause(
      "minkstuju_audiniu_trauma",
      "Minkštųjų audinių patempimas ar sumušimas",
      "Dažniausia priežastis, kai šlubavimas atsirado staiga ir katė vis dėlto šiek tiek remiasi į koją.",
      [!noWeight ? "Katė vis dar šiek tiek remiasi į koją" : ""].filter(Boolean),
      [noWeight ? "Katė visai nekelia kojos ant žemės" : ""].filter(Boolean),
      !noWeight ? 40 : 15
    ),
    cause(
      "lauzis_ar_dislokacija",
      "Kaulo lūžis ar sąnario išnirimas",
      "Svarstoma, jei katė visiškai nesiremia į koją arba yra žinoma trauma.",
      [noWeight ? "Katė visai nekelia kojos" : "", trauma ? "Nurodyta trauma" : ""].filter(Boolean),
      [!noWeight && !trauma ? "Nėra sunkios traumos požymių" : ""].filter(Boolean),
      (noWeight ? 35 : 0) + (trauma ? 25 : 0) || 15
    ),
    cause(
      "infekcija_ar_absceso",
      "Žaizdos infekcija ar abscesas",
      "Svarstoma, jei šalia šlubavimo pastebimas patinimas.",
      [swelling ? "Pastebėtas patinimas" : ""].filter(Boolean),
      [!swelling ? "Patinimo nepastebėta" : ""].filter(Boolean),
      swelling ? 40 : 10
    ),
    cause(
      "artritas",
      "Sąnarių degeneracija (artritas)",
      "Svarstoma, kai šlubavimas atsiranda palaipsniui, ypač vyresnio amžiaus katėms.",
      [gradual ? "Šlubavimas vystėsi palaipsniui" : ""].filter(Boolean),
      [!gradual ? "Prasidėjo staiga, ne palaipsniui" : ""].filter(Boolean),
      gradual ? 35 : 10
    ),
  ];
}

function causesForNegaliPasislapinti(a: Answers): PossibleCause[] {
  const noOutput = a["straining_no_output"] === true;
  return [
    cause(
      "slapimo_taku_uzsikimsimas",
      "Šlapimo takų užsikimšimas (dažnesnis pas patinus)",
      "Tai potencialiai gyvybei pavojinga būklė, kai katė negali pasišlapinti - reikalinga skubi veterinaro pagalba.",
      [noOutput ? "Katė spraudžiasi, bet šlapimas neišeina" : ""].filter(Boolean),
      [],
      70
    ),
    cause(
      "cistitas",
      "Šlapimo pūslės uždegimas (cistitas)",
      "Gali sukelti dažną spraudimąsi, tačiau paprastai šlapimo bent šiek tiek išeina.",
      [!noOutput ? "Šiek tiek šlapimo vis dėlto išeina" : ""].filter(Boolean),
      [noOutput ? "Šlapimo neišeina visai" : ""].filter(Boolean),
      !noOutput ? 40 : 15
    ),
  ];
}

function causesForKraujasSlapime(a: Answers): PossibleCause[] {
  const straining = a["straining"] === true;
  const canUrinate = a["urinating_at_all"] !== false;
  return [
    cause(
      "cistitas",
      "Šlapimo pūslės uždegimas (cistitas)",
      "Dažna kraujo šlapime priežastis, ypač kai katė sugeba pasišlapinti.",
      [canUrinate ? "Katė sugeba pasišlapinti" : ""].filter(Boolean),
      [],
      canUrinate ? 45 : 15
    ),
    cause(
      "slapimo_takutakel_akmenys",
      "Šlapimo takų akmenys",
      "Svarstoma, ypač jei katė tampo/spraudžiasi šlapindamasi.",
      [straining ? "Katė tampo/spraudžiasi šlapindamasi" : ""].filter(Boolean),
      [],
      straining ? 40 : 20
    ),
    cause(
      "slapimo_taku_uzsikimsimas",
      "Šlapimo takų užsikimšimas",
      "Kritiškai svarbu patikrinti, ar katė apskritai sugeba pasišlapinti - jei ne, reikalinga skubi pagalba.",
      [!canUrinate ? "Katė nesugeba pasišlapinti" : ""].filter(Boolean),
      [canUrinate ? "Katė sugeba pasišlapinti" : ""].filter(Boolean),
      !canUrinate ? 70 : 10
    ),
  ];
}

function causesForTraukuliai(a: Answers): PossibleCause[] {
  const toxin = a["toxin_exposure"] === true;
  const known = a["known_epilepsy"] === true;
  return [
    cause(
      "apsinuodijimas",
      "Apsinuodijimas toksine medžiaga",
      "Svarstoma dėl nurodyto galimo kontakto su nuodais, vaistais ar chemikalais.",
      [toxin ? "Galimas kontaktas su toksine medžiaga" : ""].filter(Boolean),
      [],
      toxin ? 55 : 15
    ),
    cause(
      "epilepsija",
      "Epilepsija ar žinomas traukulių sutrikimas",
      "Svarstoma, jei katei jau anksčiau diagnozuota epilepsija.",
      [known ? "Anksčiau diagnozuota epilepsija" : ""].filter(Boolean),
      [!known ? "Epilepsija anksčiau nediagnozuota" : ""].filter(Boolean),
      known ? 50 : 10
    ),
    cause(
      "metabolinis_sutrikimas",
      "Metabolinis sutrikimas (pvz. kepenų, inkstų ar cukraus kiekio kraujyje problema)",
      "Galima priežastis, ypač jei nėra žinomo toksinų kontakto ar epilepsijos diagnozės.",
      [!toxin && !known ? "Nėra žinomos toksinų ar epilepsijos priežasties" : ""].filter(Boolean),
      [],
      !toxin && !known ? 35 : 15
    ),
  ];
}

function genericCauses(symptom: SymptomId): PossibleCause[] {
  return [
    cause(
      "bendras_ivertinimas_reikalingas",
      "Reikalingas platesnis įvertinimas",
      "Šiam simptomui automatinė analizė yra ribota - veterinaras galės tiksliau įvertinti situaciją apžiūros metu.",
      [],
      [],
      20
    ),
  ];
}

const CAUSE_GENERATORS: Partial<Record<SymptomId, (a: Answers) => PossibleCause[]>> = {
  vemia: causesForVemia,
  viduriuoja: causesForViduriuoja,
  nevalgo: causesForNevalgo,
  geria_daug: causesForGeriaDaug,
  sunku_kvepuoti: causesForSunkuKvepuoti,
  slubuoja: causesForSlubuoja,
  negali_pasislapinti: causesForNegaliPasislapinti,
  kraujas_slapime: causesForKraujasSlapime,
  traukuliai: causesForTraukuliai,
};

export function getPossibleCauses(symptoms: SymptomId[], answers: Answers): PossibleCause[] {
  const merged = new Map<string, PossibleCause>();

  for (const symptom of symptoms) {
    const generator = CAUSE_GENERATORS[symptom] ?? (() => genericCauses(symptom));
    for (const c of generator(answers)) {
      const existing = merged.get(c.id);
      if (existing) {
        existing.score = Math.min(100, existing.score + c.score * 0.35);
        existing.supportingFactors = Array.from(new Set([...existing.supportingFactors, ...c.supportingFactors]));
        existing.contradictingFactors = Array.from(new Set([...existing.contradictingFactors, ...c.contradictingFactors]));
      } else {
        merged.set(c.id, { ...c, score: Math.max(5, Math.min(100, c.score)) });
      }
    }
  }

  return Array.from(merged.values()).sort((a, b) => b.score - a.score);
}
