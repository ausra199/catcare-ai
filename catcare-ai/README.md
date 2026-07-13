# CatCare AI

Kačių sveikatos konsultavimo web aplikacija (MVP). Programa NEPAKEIČIA veterinaro
konsultacijos - ji padeda sistemingai surinkti simptomus, įvertinti skubumą,
pasiruošti vizitui pas veterinarą ir stebėti sveikatos pokyčius ilgalaikėje
perspektyvoje.

## Paleidimas lokaliai

```bash
npm install
npm run dev
```

Atidarykite http://localhost:3000

## Įkėlimas į GitHub

Projektas jau paruoštas kaip Git repozitorija (yra `.git` aplankas su pirmu commit'u).

**A variantas - be komandinės eilutės (paprasčiausia):**
1. Eikite į https://github.com/new ir sukurkite naują tuščią repozitoriją (be README, be .gitignore)
2. Repozitorijos puslapyje spauskite "uploading an existing file"
3. Įtempkite visą `catcare-ai` aplanko turinį (išskyrus `node_modules` ir `.next`, jei jie sugeneruoti)
4. Commit'inkite tiesiai per GitHub web sąsają

**B variantas - su Git komandine eilute:**
```bash
cd catcare-ai
git remote add origin https://github.com/JUSU_VARDAS/catcare-ai.git
git branch -M main
git push -u origin main
```
(pirma sukurkite tuščią repozitoriją adresu https://github.com/new, tada naudokite jos URL vietoj aukščiau esančio)

## Deploy į Vercel (vieno klick'o principu)

1. Eikite į https://vercel.com ir prisijunkite (galima tiesiai su GitHub paskyra)
2. Spauskite **"Add New..." → "Project"**
3. Pasirinkite ką tik sukurtą `catcare-ai` GitHub repozitoriją ir spauskite **Import**
4. Vercel automatiškai atpažins, kad tai Next.js projektas - jokių papildomų nustatymų keisti nereikia
5. Spauskite **Deploy**

Po ~1 minutės gausite viešą nuorodą, pvz. `catcare-ai.vercel.app`. Kiekvienas naujas
`git push` į `main` šaką automatiškai atnaujins svetainę (CI/CD jau veikia be papildomo
konfigūravimo).

> **Svarbu:** kadangi duomenys saugomi naršyklės `localStorage`, kiekvienas vartotojas
> matys tik savo įrenginyje įvestus duomenis - tai normalu MVP versijai.

## Technologijos

- Next.js 14 (App Router) + TypeScript
- TailwindCSS + rankomis sukurti shadcn/ui stiliaus komponentai
- React Hook Form + Zod validacijai
- Recharts grafikams
- jsPDF vizito suvestinės PDF eksportui
- localStorage duomenų saugojimui (MVP) per `Repository` sąsają (žr. `src/lib/storage.ts`),
  paruoštą pakeisti API/PostgreSQL realizacija ateityje
- next-themes šviesiai/tamsiai temai
- PWA: `public/manifest.json` + ikonos

## Katalogų struktūra

```
src/
  app/                 Next.js App Router puslapiai
    page.tsx           Pradinis puslapis (katės profilis + meniu)
    pet/               Katės profilio redagavimas
    assessment/        Simptomų vedlys + rezultato puslapis
    history/           Sveikatos istorija
    diary/             Sveikatos dienoraštis
    risk-analysis/      Ilgalaikė rizikos analizė
  components/          Daugkartinio naudojimo React komponentai
    ui/                Bazinis dizaino sistemos komponentų rinkinys
  data/                Simptomų medžio, priežasčių ir raudonų vėliavų duomenys/taisyklės
  lib/                 Duomenų tipai, analizės variklis, saugykla, PDF eksportas
  i18n/                Minimali internacionalizacijos architektūra (šiuo metu tik LT)
```

## Ateities plėtra (architektūra jau paruošta)

- `Repository` sąsaja (`src/lib/storage.ts`) leidžia pakeisti localStorage į API/PostgreSQL
  nekeičiant komponentų kodo.
- `src/i18n/lt.ts` demonstruoja žodyno struktūrą naujoms kalboms pridėti.
- `src/data/symptom-questions.ts` ir `src/data/cause-rules.ts` yra duomenimis paremta
  struktūra - naujus simptomus/priežastis lengva pridėti nekeičiant variklio logikos.
- Autentifikacijai, kelioms katėms, veterinarų paskyroms ir debesijos sinchronizacijai
  pakanka papildyti `Cat`/`Repository` tipus - UI komponentai jau naudoja abstrakciją.

## Svarbu

Ši programa yra MVP demonstracinis projektas ir NĖRA medicininis prietaisas. Ji
neteikia diagnozių. Visada kreipkitės į veterinarą, kai kyla abejonių dėl katės
sveikatos.
