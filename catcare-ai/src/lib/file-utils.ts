 apdorojimo pagalbinės funkcijos.
*
* MVP versijoje failai (nuotraukos, tyrimų dokumentai) saugomi kaip base64
* duomenų URL tiesiai naršyklės localStorage. localStorage turi ribotą talpą
* (dažniausiai ~5-10MB visai domenui), todėl:
* - katės profilio nuotraukos automatiškai suspaudžiamos/sumažinamos canvas pagalba;
* - kitiems failams (PDF, dokumentų nuotraukos) taikomas dydžio apribojimas su
*   aiškiu perspėjimu vartotojui.
*
* Ateityje pereinant prie API/S3 ar panašios saugyklos, šias funkcijas pakeistų
* tiesiog failo įkėlimas į serverį ir nuorodos saugojimas vietoj base64 duomenų.
*/

export const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024; // 3MB minkštas limitas vienam priedui
export const MAX_PHOTO_DIMENSION = 640; // px - katės profilio nuotraukos ilgesnė kraštinė

export class FileTooLargeError extends Error {}

/** Nuskaito failą kaip base64 data URL (naudojama dokumentams/PDF). */
export function readFileAsDataUrl(file: File): Promise<string> {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = () => resolve(reader.result as string);
reader.onerror = () => reject(reader.error ?? new Error("Nepavyko nuskaityti failo"));
reader.readAsDataURL(file);
});
}

/**
* Nuskaito paveikslėlį ir sumažina jį iki MAX_PHOTO_DIMENSION, grąžindamas
* suspaustą JPEG data URL. Tai leidžia saugoti nuotraukas localStorage
* nerizikuojant greitai išnaudoti visą talpą.
*/
export async function readImageAsCompressedDataUrl(
file: File,
maxDimension: number = MAX_PHOTO_DIMENSION
): Promise<string> {
const originalDataUrl = await readFileAsDataUrl(file);

return new Promise((resolve, reject) => {
const img = new Image();
img.onload = () => {
let { width, height } = img;
if (width > maxDimension || height > maxDimension) {
if (width > height) {
height = Math.round((height * maxDimension) / width);
width = maxDimension;
} else {
width = Math.round((width * maxDimension) / height);
height = maxDimension;
}
}
const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");
if (!ctx) {
resolve(originalDataUrl);
return;
}
ctx.drawImage(img, 0, 0, width, height);
resolve(canvas.toDataURL("image/jpeg", 0.82));
};
img.onerror = () => reject(new Error("Nepavyko apdoroti paveikslėlio"));
img.src = originalDataUrl;
});
}

export function estimateDataUrlBytes(dataUrl: string): number {
const base64 = dataUrl.split(",")[1] ?? "";
return Math.round((base64.length * 3) / 4);
}

export function formatBytes(bytes: number): string {
if (bytes < 1024) return `${bytes} B`;
if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Meta patikra prieš įkeliant dokumentą - meta klaidą, jei failas per didelis. */
export function assertAttachmentSize(file: File): void {
if (file.size > MAX_ATTACHMENT_BYTES) {
throw new FileTooLargeError(
`Failas per didelis (${formatBytes(file.size)}). Maksimalus dydis: ${formatBytes(MAX_ATTACHMENT_BYTES)}.`
);
}
}
