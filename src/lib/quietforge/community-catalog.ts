/**
 * Unofficial, descriptive community reference. No external firearm-CAD links,
 * download URLs, manufacturing parameters or instructions are stored here.
 * Project names alone do not imply endorsement or verified provenance.
 */
export type CommunityEntry = {
  id: string;
  name: string;
  kind: "Named community project" | "Research topic";
  status: "Name supplied by community" | "General reference";
  summary: string;
  context: string;
  discussion: readonly string[];
  evaluation: readonly string[];
  tags: readonly string[];
};

export const communityEntries: readonly CommunityEntry[] = [
  {
    id: "ftn",
    name: "FTN suppressor project family",
    kind: "Named community project",
    status: "Name supplied by community",
    summary: "A name associated with online, community-created suppressor discussions.",
    context: "FTN is included as a historical/catalog research topic. Specific authorship, revision numbers, source authenticity, and engineering claims have not been independently verified in this directory.",
    discussion: [
      "How online remix culture and version naming make project provenance difficult to establish.",
      "Why a shared CAD file is not evidence of a qualified, tested pressure-bearing product.",
      "The difference between visual demonstration, marketing claims, and independent acoustic or safety assessment.",
    ],
    evaluation: [
      "Identify the original author and publication date using reliable, non-file sources.",
      "Check whether performance claims rely on independent published testing.",
      "Check current federal, state, and local law rather than following an older post.",
    ],
    tags: ["FTN", "community history", "3D printing", "documentation"],
  },
  {
    id: "htn",
    name: "HTN community project",
    kind: "Named community project",
    status: "Name supplied by community",
    summary: "A name referenced in discussions of community suppressor files and designs.",
    context: "This is a placeholder for fact-checked historical coverage. Specific lineage, authorship, and version history are not verified; details will not be invented.",
    discussion: [
      "How archives, mirrors, and unofficial downloads can lose attribution or publication dates.",
      "Why incompatible claims about materials and service life require independent verification.",
      "How community documentation differs from a manufacturer's instructions or certification.",
    ],
    evaluation: [
      "Cross-check dates, labels, and authorship against independently accessible historical documentation.",
      "Do not assume two similarly named files are equivalent.",
      "Treat legal and safety claims as unverified unless supported by current authoritative sources.",
    ],
    tags: ["HTN", "community history", "archiving", "documentation"],
  },
  {
    id: "open-cad",
    name: "Open CAD community and remix culture",
    kind: "Research topic",
    status: "General reference",
    summary: "How versioning, attribution, licenses, and community collaboration work across CAD-sharing platforms.",
    context: "Community catalogs may mix original projects, remixes, previews, partial collections, and media files. Project discovery and provenance assessment should be separated from manufacturing use.",
    discussion: [
      "Version numbers and file timestamps may not reflect the original author's intent.",
      "A license or public listing does not establish legality or physical safety.",
      "Checksums and verified authorship are general software supply-chain concepts.",
    ],
    evaluation: ["Look for author attribution.", "Separate documentation from unverified performance claims.", "Avoid treating an index listing as professional approval."],
    tags: ["CAD", "licensing", "history", "catalogs"],
  },
  {
    id: "printed-materials",
    name: "3D-printing material claims",
    kind: "Research topic",
    status: "General reference",
    summary: "Understanding why claims about PLA+, nylon, composites, and metal-filled filaments need scrutiny.",
    context: "An FDM printer deposits thermoplastic layers. A consumer 'metal-filled' filament is generally not equivalent to a fully dense metal part; properties are determined by the entire process and the final material.",
    discussion: [
      "Layer adhesion, voids, heat sensitivity, and print orientation affect ordinary printed objects.",
      "Material branding is not a qualified structural test.",
      "Real engineering evaluation requires traceable materials, production records, and independent test evidence.",
    ],
    evaluation: ["Check whether tests are for the exact final material.", "Identify testing temperatures and conditions.", "Avoid using informal claims as a safety certification."],
    tags: ["PLA+", "polymers", "composites", "additive manufacturing"],
  },
  {
    id: "measurements",
    name: "Community noise-testing claims",
    kind: "Research topic",
    status: "General reference",
    summary: "How to interpret shared charts and recordings without relying on incompatible comparisons.",
    context: "Sound pressure is logarithmic. Device claims depend on microphone placement, instrumentation, firearm, ammunition, environment, and test methodology.",
    discussion: [
      "Camera microphones compress audio and cannot establish reliable peak gunshot exposure.",
      "A single best-case measurement does not establish a product's entire performance profile.",
      "Hearing protection remains relevant even when sound is reduced.",
    ],
    evaluation: ["Look for documented measurement standards.", "Prefer independent research.", "Avoid unsupported 'hearing safe' declarations."],
    tags: ["acoustics", "testing", "decibels", "hearing protection"],
  },
  {
    id: "community-safety",
    name: "Community files, safety, and legal context",
    kind: "Research topic",
    status: "General reference",
    summary: "Why public access to a digital file is different from legal permission or physical safety.",
    context: "File repositories can host information without validating it. Applicable law can change, and legal rules differ depending on location and whether someone is an individual or a business.",
    discussion: [
      "Product liability, professional testing, and manufacturing regulation are separate from the availability of an online model.",
      "ATF's October 2026 NFA guidance does not eliminate Gun Control Act or state/local requirements.",
      "A downloaded STL, 3MF, or STEP file is not proof of lawful or safe use.",
    ],
    evaluation: ["Read dated official guidance.", "Consult qualified professionals for safety questions.", "Assess source authenticity separately from file popularity."],
    tags: ["law", "safety", "files", "verification"],
  },
];

export type FormatEntry = {
  name: string;
  ext: string;
  family: "3D geometry" | "Documents" | "Metadata";
  details: string;
  caution: string;
};

export const fileFormats: readonly FormatEntry[] = [
  {
    name: "STL", ext: ".stl", family: "3D geometry",
    details: "Triangulated surface geometry, widely used in slicers. Standard STL does not reliably encode units.",
    caution: "A manifold mesh or successful slicer import does not prove a part is mechanically sound.",
  },
  {
    name: "3MF", ext: ".3mf", family: "3D geometry",
    details: "A ZIP-based 3D manufacturing package that can include meshes, units, and optional metadata.",
    caution: "3MF is a file container, not a test report or safety certification.",
  },
  {
    name: "STEP", ext: ".step / .stp", family: "3D geometry",
    details: "An exchange format often used for boundary-representation solids in CAD systems.",
    caution: "CAD precision and material suitability are separate questions.",
  },
  {
    name: "OBJ", ext: ".obj", family: "3D geometry",
    details: "Polygonal model data, often accompanied by material or texture references.",
    caution: "OBJ does not imply a closed or physically manufacturable object.",
  },
  {
    name: "PDF", ext: ".pdf", family: "Documents",
    details: "Fixed-layout documentation, illustrations, notices, and research records.",
    caution: "Documents in open catalogs may be outdated, inaccurate, or missing provenance.",
  },
  {
    name: "README", ext: ".md / .txt", family: "Documents",
    details: "Plain-text documentation that often describes what a repository claims to contain.",
    caution: "A README is an author's assertion, not independent validation.",
  },
  {
    name: "JSON", ext: ".json", family: "Metadata",
    details: "Machine-readable structured project settings or catalog records.",
    caution: "Descriptive metadata is not necessarily complete or verified.",
  },
];

export const getCommunityEntry = (id: string) => communityEntries.find((entry) => entry.id === id);
