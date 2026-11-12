/** Historical labels transcribed from a user-provided FTN.5 chart.
 * Names and broad categories only: these are NOT fabrication presets, and
 * no measurements, printable meshes, or manufacturing files are included.
 * No item is independently safety-verified or authenticated.
 */
export type ReferenceCategory = "Rimfire" | "Rifle" | "Pistol" | "PCC" | "Other";
export type FtnReference = {
  id: string;
  label: string;
  category: ReferenceCategory;
  note: string;
};
export const ftnReferences: readonly FtnReference[] = [
  { id: "rimfire", label: "FTN.5 Rimfire", category: "Rimfire", note: "Entry labeled Rimfire in the submitted project chart." },
  { id: "rimfire-flow", label: "FTN.5 Rimfire Flow", category: "Rimfire", note: "Rimfire-named variant with 'Flow' in its title." },
  { id: "rimfire-tesla", label: "FTN.5 Rimfire Tesla", category: "Rimfire", note: "Rimfire-named entry with 'Tesla' in its title." },
  { id: "rifle-baffled", label: "FTN.5 Rifle Baffled", category: "Rifle", note: "Rifle-named variant in the submitted chart." },
  { id: "rifle-flow", label: "FTN.5 Rifle Flow", category: "Rifle", note: "Rifle-named entry with 'Flow' in its title." },
  { id: "white-monster", label: "FTN.5 White Monster", category: "Rifle", note: "Community nickname listed in the rifle section of the submitted chart." },
  { id: "pistol", label: "FTN.5 Pistol", category: "Pistol", note: "Pistol-named variant in the submitted chart." },
  { id: "pcc-45-alum", label: "FTN4.5 PCC with alum tube", category: "PCC", note: "PCC-named FTN4.5 entry; its title refers to aluminum, without independent safety verification." },
  { id: "pcc", label: "FTN.5 PCC", category: "PCC", note: "PCC-named variant in the submitted chart." },
  { id: "pcc-flow", label: "FTN.5 PCC Flow", category: "PCC", note: "PCC-named variant with 'Flow' in its title." },
  { id: "rifle-five", label: "FTN 4.5 Rifle with Five Baffles (300BLK)", category: "Rifle", note: "Rifle-named FTN4.5 chart entry. The title is a historical label, not an assembly description." },
  { id: "thirty", label: "FTN.5 30 Cal", category: "Rifle", note: "Chart entry labeled 30 Cal. Compatibility and provenance are not verified." },
  { id: "purple-drank", label: "FTN.5 Purple Drank", category: "Other", note: "Community nickname listed in the submitted chart; its design category is not independently verified." },
] as const;

export const referenceCategories: readonly ReferenceCategory[] = ["Rimfire", "Rifle", "Pistol", "PCC", "Other"];
export const ftnReferenceById = (id: string) => ftnReferences.find((entry) => entry.id === id);
export const referenceStorageKey = "suppressor-studio.research-reference.v1";

export function readReferenceSelection(): string {
  if (typeof window === "undefined") return "";
  try {
    const value = window.localStorage.getItem(referenceStorageKey) ?? "";
    return ftnReferenceById(value) ? value : "";
  } catch { return ""; }
}

export function writeReferenceSelection(id: string): void {
  if (typeof window === "undefined") return;
  try {
    if (ftnReferenceById(id)) window.localStorage.setItem(referenceStorageKey, id);
    else window.localStorage.removeItem(referenceStorageKey);
  } catch { /* Browsers may block local storage. */ }
}
