import jsPDF from "jspdf";
import type { AssessmentResult, Cat } from "@/lib/types";
import { getSymptomLabel } from "@/data/symptom-list";

function wrapText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function exportVisitSummaryPdf(cat: Cat, result: AssessmentResult) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Vizito pas veterinarą suvestinė", margin, y);
  y += 26;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90);
  y = wrapText(
    doc,
    "Ši suvestinė sugeneruota programos CatCare AI. Ji nepakeičia veterinaro konsultacijos ir yra skirta tik padėti pasiruošti vizitui.",
    margin,
    y,
    width,
    13
  );
  y += 12;
  doc.setTextColor(20);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Katės duomenys", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const catLines = [
    `Vardas: ${cat.name}`,
    `Amžius: ${cat.ageYears} m. ${cat.ageMonths} mėn.`,
    `Lytis: ${cat.gender === "patinas" ? "Patinas" : "Patelė"}${cat.neutered ? " (sterilizuotas/kastruotas)" : ""}`,
    `Veislė: ${cat.breed || "Nenurodyta"}`,
    `Svoris: ${cat.weightKg} kg`,
  ];
  for (const line of catLines) {
    doc.text(line, margin, y);
    y += 15;
  }
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Skubumo įvertinimas", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(result.urgency.label, margin, y);
  y += 15;
  y = wrapText(doc, result.urgency.explanation, margin, y, width, 13);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Trumpa ligos istorija", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = wrapText(doc, result.summary, margin, y, width, 14);
  y += 10;

  if (result.possibleCauses.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Galimos priežastys (tik orientacinis sąrašas)", margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    for (const c of result.possibleCauses.slice(0, 4)) {
      y = wrapText(doc, `• ${c.name} - ${c.why}`, margin, y, width, 13);
      y += 4;
    }
    y += 8;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Klausimai veterinarui", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  for (const q of result.vetQuestions.slice(0, 8)) {
    if (y > 760) {
      doc.addPage();
      y = margin;
    }
    y = wrapText(doc, `• ${q}`, margin, y, width, 13);
    y += 4;
  }

  doc.setFontSize(9);
  doc.setTextColor(140);
  doc.text(
    `Sugeneruota: ${new Date(result.createdAt).toLocaleString("lt-LT")}`,
    margin,
    doc.internal.pageSize.getHeight() - margin / 2
  );

  doc.save(`${cat.name}_vizito_suvestine.pdf`);
}
