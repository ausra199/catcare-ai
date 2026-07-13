import type { SymptomId, SymptomQuestion } from "@/lib/types";

/**
 * Kiekvienam simptomui priskirtas kontekstinių klausimų sąrašas.
 * `showIf` leidžia klausimą rodyti tik priklausomai nuo ankstesnių atsakymų,
 * kad vartotojas nematytų nereikalingų klausimų (pvz. "ar yra kraujo išmatose"
 * rodomas tik jei vartotojas jau pažymėjo, kad katė viduriuoja).
 *
 * Norint pridėti naują simptomą: (1) įtrauk jį į SymptomId (lib/types.ts),
 * (2) į SYMPTOM_LIST (data/symptom-list.ts), (3) čia pridėk klausimų masyvą,
 * (4) data/cause-rules.ts pridėk atitinkamas galimų priežasčių taisykles.
 */

const commonFollowUps: SymptomQuestion[] = [
  {
    id: "eats",
    label: "Ar katė valgo?",
    type: "single_select",
    options: [
      { value: "normaliai", label: "Valgo normaliai" },
      { value: "mazai", label: "Valgo mažiau nei įprastai" },
      { value: "nevalgo", label: "Visiškai nevalgo" },
    ],
  },
  {
    id: "drinks",
    label: "Ar katė geria vandenį?",
    type: "single_select",
    options: [
      { value: "normaliai", label: "Geria normaliai" },
      { value: "daug", label: "Geria daugiau nei įprastai" },
      { value: "mazai", label: "Geria mažiau arba negeria" },
    ],
  },
  {
    id: "outdoor_access",
    label: "Ar katė buvo lauke per pastarąsias 48 val.?",
    type: "boolean",
  },
  {
    id: "plant_or_toxin",
    label: "Ar galėjo suėsti augalą, nuodus ar sugadintą maistą?",
    type: "boolean",
  },
  {
    id: "on_medication",
    label: "Ar katė šiuo metu gauna kokius nors vaistus?",
    type: "boolean",
  },
  {
    id: "prior_episodes",
    label: "Ar panašių epizodų buvo anksčiau?",
    type: "single_select",
    options: [
      { value: "ne", label: "Ne, tai pirmas kartas" },
      { value: "retai", label: "Taip, retkarčiais" },
      { value: "daznai", label: "Taip, tai kartojasi dažnai" },
    ],
  },
];

export const SYMPTOM_QUESTIONS: Record<SymptomId, SymptomQuestion[]> = {
  vemia: [
    { id: "onset", label: "Kada prasidėjo vėmimas?", type: "single_select", options: [
      { value: "sian_val", label: "Prieš kelias valandas" },
      { value: "vakar", label: "Vakar" },
      { value: "kelios_dienos", label: "Prieš kelias dienas" },
      { value: "savaite_plus", label: "Savaitę ar ilgiau" },
    ]},
    { id: "count", label: "Kiek kartų vėmė per pastarąsias 24 val.?", type: "number", unit: "kartai" },
    { id: "blood", label: "Ar vėmale yra kraujo?", type: "boolean" },
    ...commonFollowUps,
    { id: "temperature", label: "Ar žinote katės kūno temperatūrą?", type: "single_select", options: [
      { value: "nezinoma", label: "Nežinau / nematavau" },
      { value: "normali", label: "Normali (38–39.2°C)" },
      { value: "pakelta", label: "Pakelta (virš 39.5°C)" },
      { value: "labai_auksta", label: "Labai aukšta (virš 40°C)" },
    ]},
  ],
  viduriuoja: [
    { id: "onset", label: "Kada prasidėjo viduriavimas?", type: "single_select", options: [
      { value: "sian_val", label: "Prieš kelias valandas" },
      { value: "vakar", label: "Vakar" },
      { value: "kelios_dienos", label: "Prieš kelias dienas" },
      { value: "savaite_plus", label: "Savaitę ar ilgiau" },
    ]},
    { id: "blood", label: "Ar išmatose yra kraujo?", type: "boolean" },
    { id: "consistency", label: "Kokios konsistencijos išmatos?", type: "single_select", options: [
      { value: "minkstos", label: "Minkštesnės nei įprastai" },
      { value: "vandeningos", label: "Visiškai vandeningos" },
      { value: "gleives", label: "Su gleivėmis" },
    ]},
    ...commonFollowUps,
  ],
  nevalgo: [
    { id: "duration", label: "Kiek laiko katė nevalgo arba valgo mažai?", type: "single_select", options: [
      { value: "12h", label: "Mažiau nei 12 val." },
      { value: "24h", label: "Apie 24 val." },
      { value: "48h_plus", label: "Daugiau nei 48 val." },
    ]},
    { id: "vomiting", label: "Ar kartu vemia?", type: "boolean" },
    { id: "drinks", label: "Ar geria vandenį?", type: "single_select", options: [
      { value: "normaliai", label: "Geria normaliai" },
      { value: "daug", label: "Geria daugiau nei įprastai" },
      { value: "mazai", label: "Geria mažiau arba negeria" },
    ]},
    { id: "mouth_pain", label: "Ar pastebite skausmo ženklų prie burnos (seilėjimasis, vengia kramtyti)?", type: "boolean" },
    ...commonFollowUps.filter((q) => q.id !== "drinks"),
  ],
  geria_daug: [
    { id: "duration", label: "Kiek laiko trunka padidėjęs vandens vartojimas?", type: "single_select", options: [
      { value: "savaite", label: "Mažiau nei savaitę" },
      { value: "menuo", label: "Kelias savaites" },
      { value: "menesiai", label: "Kelis mėnesius ar ilgiau" },
    ]},
    { id: "urination_change", label: "Ar pastebite, kad šlapinasi dažniau ar gausiau?", type: "boolean" },
    { id: "weight_change", label: "Ar pastebėjote svorio pokyčių pastaruoju metu?", type: "single_select", options: [
      { value: "ne", label: "Nepastebėjau" },
      { value: "krito", label: "Svoris krito" },
      { value: "augo", label: "Svoris augo" },
    ]},
    { id: "appetite_change", label: "Ar pasikeitė apetitas?", type: "single_select", options: [
      { value: "normalus", label: "Nepasikeitė" },
      { value: "padidejo", label: "Padidėjo" },
      { value: "sumazejo", label: "Sumažėjo" },
    ]},
  ],
  mazai_geria: [
    { id: "eats", label: "Ar katė valgo?", type: "single_select", options: [
      { value: "normaliai", label: "Valgo normaliai" },
      { value: "mazai", label: "Valgo mažiau" },
      { value: "nevalgo", label: "Nevalgo" },
    ]},
    { id: "wet_food", label: "Ar katė gauna drėgno maisto (konservų)?", type: "boolean" },
    { id: "lethargy", label: "Ar katė mieguistesnė / mažiau aktyvi nei įprastai?", type: "boolean" },
    { id: "skin_turgor", label: "Jei suspaudžiate odą ties sprandu, ar ji greitai grįžta į vietą?", type: "single_select", options: [
      { value: "greitai", label: "Taip, iškart grįžta" },
      { value: "lenai", label: "Grįžta lėtai" },
      { value: "nezinau", label: "Nebandžiau / nežinau" },
    ]},
  ],
  sunku_kvepuoti: [
    { id: "onset", label: "Kada prasidėjo kvėpavimo sunkumai?", type: "single_select", options: [
      { value: "dabar", label: "Ką tik / šiuo metu" },
      { value: "sian_val", label: "Prieš kelias valandas" },
      { value: "diena_plus", label: "Dieną ar ilgiau" },
    ]},
    { id: "severity", label: "Kaip apibūdintumėte kvėpavimą?", type: "single_select", options: [
      { value: "greitesnis", label: "Šiek tiek greitesnis nei įprastai", },
      { value: "pastangos", label: "Kvėpuoja su pastangomis, atviromis nasrais", redFlag: true },
      { value: "melynos", label: "Dantenos ar liežuvis melsvi/pilki", redFlag: true },
    ]},
    { id: "gum_color", label: "Kokia dantenų spalva?", type: "single_select", options: [
      { value: "rausva", label: "Rausva (normalu)" },
      { value: "blyski", label: "Blyški" },
      { value: "melyna", label: "Melsva arba pilka", redFlag: true },
    ]},
    { id: "cough", label: "Ar kartu kosėja?", type: "boolean" },
    { id: "trauma", label: "Ar galėjo patirti traumą (kritimas, smūgis, eismo įvykis)?", type: "boolean" },
  ],
  slubuoja: [
    { id: "leg", label: "Kuri koja paveikta?", type: "single_select", options: [
      { value: "priekine", label: "Priekinė" },
      { value: "galine", label: "Galinė" },
      { value: "nezinau", label: "Sunku pasakyti" },
    ]},
    { id: "onset", label: "Kada pastebėjote šlubavimą?", type: "single_select", options: [
      { value: "stai", label: "Staiga, prieš kelias valandas" },
      { value: "vakar", label: "Vakar ar užvakar" },
      { value: "palaipsniui", label: "Palaipsniui, per kelias savaites" },
    ]},
    { id: "weight_bearing", label: "Ar katė visai nekelia tos kojos ant žemės?", type: "boolean", },
    { id: "trauma", label: "Ar galėjo patirti traumą (kritimas, smūgis)?", type: "boolean" },
    { id: "swelling", label: "Ar matote patinimą ar žaizdą toje vietoje?", type: "boolean" },
  ],
  salpinasi_dazniau: [
    { id: "straining", label: "Ar katė tuo pačiu tampo/spraudžiasi lovelyje, bet mažai išeina šlapimo?", type: "boolean", },
    { id: "blood", label: "Ar šlapime yra kraujo?", type: "boolean" },
    { id: "water_intake", label: "Ar padidėjo vandens vartojimas?", type: "boolean" },
    { id: "vocalizing", label: "Ar katė miaukia / rodo skausmą šlapindamasi?", type: "boolean" },
  ],
  negali_pasislapinti: [
    { id: "straining_no_output", label: "Ar katė spraudžiasi lovelyje, bet šlapimo neišeina visai?", type: "boolean" },
    { id: "duration", label: "Kiek laiko katė nesišlapina?", type: "single_select", options: [
      { value: "iki_12h", label: "Iki 12 val." },
      { value: "12_24h", label: "12–24 val." },
      { value: "virs_24h", label: "Daugiau nei 24 val.", redFlag: true },
    ]},
    { id: "vocalizing_pain", label: "Ar katė rodo aiškų skausmą (miaukia, slepiasi)?", type: "boolean" },
    { id: "vomiting", label: "Ar kartu vemia arba yra mieguista?", type: "boolean" },
  ],
  kraujas_slapime: [
    { id: "amount", label: "Kiek kraujo pastebite?", type: "single_select", options: [
      { value: "nedaug", label: "Šiek tiek, rausvas atspalvis" },
      { value: "daug", label: "Daug, ryškiai raudonas šlapimas" },
    ]},
    { id: "straining", label: "Ar katė tampo/spraudžiasi šlapindamasi?", type: "boolean" },
    { id: "urinating_at_all", label: "Ar katė apskritai sugeba pasišlapinti?", type: "boolean" },
    { id: "trauma", label: "Ar galėjo patirti traumą?", type: "boolean" },
  ],
  traukuliai: [
    { id: "duration_sec", label: "Kiek truko traukuliai (sekundėmis)?", type: "number", unit: "sek." },
    { id: "count_today", label: "Kiek epizodų buvo per pastarąsias 24 val.?", type: "number", unit: "kartai" },
    { id: "consciousness", label: "Ar katė dabar sąmoninga ir reaguoja?", type: "boolean" },
    { id: "toxin_exposure", label: "Ar galėjo turėti prieigą prie nuodų, vaistų ar chemikalų?", type: "boolean" },
    { id: "known_epilepsy", label: "Ar katei anksčiau diagnozuota epilepsija?", type: "boolean" },
  ],
  koseja: [
    { id: "duration", label: "Kiek laiko kosėja?", type: "single_select", options: [
      { value: "diena", label: "Vieną dieną" },
      { value: "savaite", label: "Kelias dienas / savaitę" },
      { value: "ilgiau", label: "Ilgiau nei savaitę" },
    ]},
    { id: "productive", label: "Ar kosint kažkas išeina (skrepliai, putos)?", type: "boolean" },
    { id: "breathing_difficulty", label: "Ar sunku kvėpuoti tarp kosulio priepuolių?", type: "boolean", },
    { id: "lethargy", label: "Ar katė mieguistesnė nei įprastai?", type: "boolean" },
  ],
  ciaudi: [
    { id: "duration", label: "Kiek laiko čiaudi?", type: "single_select", options: [
      { value: "diena", label: "Vieną dieną" },
      { value: "savaite", label: "Kelias dienas / savaitę" },
      { value: "ilgiau", label: "Ilgiau nei savaitę" },
    ]},
    { id: "discharge", label: "Ar yra išskyrų iš nosies ar akių?", type: "single_select", options: [
      { value: "nera", label: "Nėra" },
      { value: "skaidrios", label: "Skaidrios" },
      { value: "spalvotos", label: "Geltonos / žalios" },
    ]},
    { id: "appetite", label: "Ar apetitas nepakitęs?", type: "boolean" },
  ],
  niezti_oda: [
    { id: "location", label: "Kur labiausiai niežti?", type: "single_select", options: [
      { value: "visur", label: "Visame kūne" },
      { value: "galva_ausys", label: "Galva / ausys" },
      { value: "nugara", label: "Nugara / uodegos pradžia" },
    ]},
    { id: "hair_loss", label: "Ar pastebite plaukų slinkimą toje vietoje?", type: "boolean" },
    { id: "redness", label: "Ar oda paraudusi ar pažeista nuo kasymosi?", type: "boolean" },
    { id: "parasites", label: "Ar tikrinote dėl blusų ar erkių?", type: "boolean" },
  ],
  zaizda: [
    { id: "size", label: "Koks žaizdos dydis?", type: "single_select", options: [
      { value: "maza", label: "Maža, paviršinė" },
      { value: "vidutine", label: "Vidutinė, gilesnė" },
      { value: "didele", label: "Didelė ar stipriai kraujuojanti", redFlag: true },
    ]},
    { id: "bleeding", label: "Ar žaizda vis dar kraujuoja?", type: "boolean" },
    { id: "cause", label: "Ar žinote priežastį (kova, trauma, pjautinis daiktas)?", type: "boolean" },
    { id: "swelling_infection", label: "Ar aplink žaizdą yra patinimo ar pūlių?", type: "boolean" },
  ],
  patinimas: [
    { id: "location", label: "Kur pastebėjote patinimą?", type: "text" },
    { id: "pain", label: "Ar zona skausminga liečiant?", type: "boolean" },
    { id: "onset", label: "Kada patinimas atsirado?", type: "single_select", options: [
      { value: "staiga", label: "Staiga" },
      { value: "palaipsniui", label: "Palaipsniui, per kelias dienas ar savaites" },
    ]},
    { id: "warm", label: "Ar zona šilta liečiant, palyginus su aplinkine oda?", type: "boolean" },
  ],
  pasikeites_elgesys: [
    { id: "change_type", label: "Koks elgesio pokytis pastebėtas?", type: "single_select", options: [
      { value: "slepiasi", label: "Slepiasi, vengia kontakto" },
      { value: "agresyvus", label: "Tapo agresyvesnis" },
      { value: "letargiskas", label: "Mieguistas, mažiau aktyvus" },
      { value: "nerimastingas", label: "Nerimastingas, neramus" },
    ]},
    { id: "duration", label: "Kiek laiko trunka šis pokytis?", type: "single_select", options: [
      { value: "diena", label: "Vieną dieną" },
      { value: "savaite", label: "Kelias dienas" },
      { value: "ilgiau", label: "Ilgiau nei savaitę" },
    ]},
    { id: "other_symptoms", label: "Ar kartu yra kitų fizinių simptomų?", type: "boolean" },
  ],
  svorio_kritimas: [
    { id: "amount_pct", label: "Kiek procentų svorio (apytiksliai) prarado?", type: "number", unit: "%" },
    { id: "period", label: "Per kokį laikotarpį?", type: "single_select", options: [
      { value: "savaites", label: "Kelias savaites" },
      { value: "menesius", label: "Kelis mėnesius" },
    ]},
    { id: "appetite", label: "Koks apetitas šiuo metu?", type: "single_select", options: [
      { value: "padidejas", label: "Padidėjęs" },
      { value: "normalus", label: "Normalus" },
      { value: "sumazejas", label: "Sumažėjęs" },
    ]},
    { id: "water_intake", label: "Ar pasikeitė vandens vartojimas?", type: "boolean" },
  ],
  kitas: [
    { id: "description", label: "Trumpai aprašykite, ką pastebėjote", type: "text" },
    { id: "duration", label: "Kiek laiko tai trunka?", type: "single_select", options: [
      { value: "diena", label: "Vieną dieną" },
      { value: "savaite", label: "Kelias dienas / savaitę" },
      { value: "ilgiau", label: "Ilgiau" },
    ]},
    { id: "affects_daily_life", label: "Ar tai trukdo kasdienei veiklai (valgymui, judėjimui)?", type: "boolean" },
  ],
};
