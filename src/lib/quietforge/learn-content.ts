/**
 * Suppressor Studio's public, read-only educational reference library.
 * Content is conceptual; intentionally contains no fabrication procedure,
 * suppressor CAD dimensions, build recipes, tuning parameters, or printable parts.
 * Primary sources are linked in the Sources view and legal material is dated.
 */

export type LessonCategory =
  | "Foundations" | "Acoustics" | "Design language" | "Materials"
  | "Ownership & safety" | "History & research";

export type LessonSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type Lesson = {
  id: string;
  title: string;
  category: LessonCategory;
  minutes: number;
  summary: string;
  keyPoints: readonly string[];
  sections: readonly LessonSection[];
  sources: readonly string[];
};

export const lessonCategories: readonly LessonCategory[] = [
  "Foundations", "Acoustics", "Design language", "Materials",
  "Ownership & safety", "History & research",
];

export const sources = [
  {
    id: "atf-2026",
    name: "ATF — Update to NFA transfer guidance (October 2026)",
    url: "https://www.atf.gov/firearms/update-to-nfa-transfer-guidance",
    note: "Current federal enforcement guidance, its limitations, and continuing GCA/state-law duties.",
  },
  {
    id: "atf-nfa",
    name: "ATF — National Firearms Act overview",
    url: "https://www.atf.gov/rules-and-regulations/laws-alcohol-tobacco-firearms-and-explosives/national-firearms-act",
    note: "Historical legal background; consult the 2026 update for changed enforcement.",
  },
  {
    id: "cdc-study",
    name: "CDC/NIOSH — The reduction of gunshot noise and auditory risk",
    url: "https://stacks.cdc.gov/view/cdc/111710/",
    note: "Peer-reviewed measurements showing noise reduction varies and hearing protection remains important.",
  },
  {
    id: "cdc-noise",
    name: "CDC/NIOSH — The Noise Manual, sixth edition",
    url: "https://stacks.cdc.gov/view/cdc/248802",
    note: "General impulse-noise science, measurement, and hearing conservation.",
  },
  {
    id: "aao",
    name: "AAO-HNS — Suppressors for Hearing Preservation",
    url: "https://www.entnet.org/resource/suppressors-for-hearing-preservation/",
    note: "Medical society statement on suppressors alongside conventional hearing protection.",
  },
  {
    id: "osha",
    name: "OSHA — Occupational Noise Exposure",
    url: "https://www.osha.gov/noise/",
    note: "General information on hearing conservation and logarithmic decibel scales.",
  },
] as const;

export const lessons: readonly Lesson[] = [
  {
    id: "how-it-works", title: "How suppressors work", category: "Foundations", minutes: 7,
    summary: "What a suppressor changes—and what it cannot remove—from a firearm's sound signature.",
    keyPoints: [
      "The main target is the high-pressure muzzle-gas report.",
      "A suppressor does not remove a supersonic projectile's shock wave.",
      "Mechanical action noise and the shooter's surroundings still matter.",
    ],
    sections: [
      { heading: "A sound has several sources", paragraphs: [
        "A gunshot is not one sound. It includes the rapidly expanding gas at the muzzle, mechanical noises from the firearm, and—when a projectile travels faster than the speed of sound—a shock wave along its flight path.",
        "A suppressor is a muzzle-mounted noise-control device intended to reduce the intensity of the expanding-gas impulse. Its physical operation involves managing rapidly moving hot gases; it does not make the firearm silent.",
      ] },
      { heading: "Why comparisons are difficult", paragraphs: [
        "A sound level measured near the muzzle differs from one measured at a shooter's ear or an observer's position. Barrel length, ammunition, atmospheric conditions, nearby surfaces, and the firearm's operating system all affect the reported result.",
        "Real-world marketing measurements can be informative, but they should be compared only when the test conditions and measurement standards are disclosed.",
      ] },
      { heading: "What people often misunderstand", bullets: [
        "The word 'silencer' is common in law and history, but it does not imply silence.",
        "Reduced blast does not guarantee a hearing-safe shot.",
        "One decibel reading cannot describe every firearm, ammunition, or environment.",
        "Appearance alone cannot establish compatibility, sound performance, or safety.",
      ], paragraphs: [] },
    ], sources: ["cdc-study", "cdc-noise", "aao"],
  },
  {
    id: "sound-sources", title: "Muzzle blast, sonic crack, and action noise", category: "Acoustics", minutes: 6,
    summary: "Understand the main contributors to the perceived gunshot without confusing them.",
    keyPoints: ["A shock wave follows a supersonic projectile.", "Mechanism noise can remain noticeable.", "The environment changes reflections."],
    sections: [
      { heading: "Muzzle blast", paragraphs: [
        "Muzzle blast is the acoustic impulse produced when propellant gases expand into the outside atmosphere. Its short duration and high peak level make it particularly important to impulse-noise exposure.",
      ] },
      { heading: "Projectile shock wave", paragraphs: [
        "A supersonic object creates a pressure discontinuity often perceived as a sharp crack. That wave travels with the projectile and is not identical to muzzle blast.",
        "The speed of sound varies with temperature and surrounding gas composition, so 'subsonic' and 'supersonic' describe a physical condition, not a universal fixed ammunition label.",
      ] },
      { heading: "Other contributions", paragraphs: [
        "Cycling parts, the ejection process, and impacts can be audible even when muzzle blast is reduced. Reflections from floors, vehicles, canopies, or walls change what listeners hear.",
      ] },
    ], sources: ["cdc-noise", "cdc-study"],
  },
  {
    id: "decibels", title: "Decibels and impulse-noise measurements", category: "Acoustics", minutes: 8,
    summary: "Peak sound pressure, frequency weighting, and why advertised dB numbers are context-dependent.",
    keyPoints: ["Decibels are logarithmic, not linear.", "Peak and average measurements are different.", "Microphone placement and methods matter."],
    sections: [
      { heading: "The logarithmic scale", paragraphs: [
        "The decibel is a logarithmic expression of a ratio. In sound measurements, a change of a few decibels can represent a substantial change in acoustic energy. It is not meaningful to subtract one seller's number from another's without knowing the testing conventions.",
      ] },
      { heading: "Peak and time-weighted readings", paragraphs: [
        "Impulse-noise studies distinguish instantaneous peak sound pressure from measures that accumulate sound energy over time. A brief, powerful transient can be hazardous even if the average sound level looks modest.",
        "A-weighted values, unweighted peaks, and different microphone positions answer different questions; they are not interchangeable.",
      ] },
      { heading: "Reading a test report", bullets: [
        "Look for the measurement location, instrument specifications, calibration, and ambient conditions.",
        "Check whether the result is an average or a single shot and whether variability is reported.",
        "Confirm whether the comparison used equivalent firearms and ammunition.",
        "Treat the word 'hearing safe' as a marketing claim unless it is backed by appropriate assessment.",
      ], paragraphs: [] },
    ], sources: ["cdc-study", "cdc-noise", "osha"],
  },
  {
    id: "pressure-heat", title: "Pressure, temperature, and thermal cycling", category: "Materials", minutes: 7,
    summary: "Why short, hot, transient events are not equivalent to static pipe-pressure calculations.",
    keyPoints: ["Gas conditions change rapidly in time and space.", "Material properties change with temperature.", "Repeated heating and cooling can accumulate damage."],
    sections: [
      { heading: "Transient versus static loading", paragraphs: [
        "A suppressor experiences a rapidly changing event, not a uniform steady pressure. Simple classroom equations cannot capture local reflections, moving fronts, erosion, thermal gradients, or fatigue.",
        "Neither an attractive CAD cross-section nor a large static 'factor of safety' is proof that an object is safe to manufacture or fire.",
      ] },
      { heading: "What heat changes", paragraphs: [
        "Elevated temperature can alter a metal's strength, stiffness, oxidation behavior, expansion, and microstructure. Different parts of an assembly may heat at different rates.",
        "Repeated thermal cycling can contribute to distortion and fatigue. Coatings and surface finishes also have their own service limits.",
      ] },
      { heading: "Responsible interpretation", paragraphs: [
        "Comparative data on metals should always state the test temperature, material condition, manufacturing process, and source. The educational material cards here intentionally avoid providing design allowables or build specifications.",
      ] },
    ], sources: ["cdc-noise"],
  },
  {
    id: "design-families", title: "Common design families", category: "Design language", minutes: 7,
    summary: "How industry terms such as baffle, monolithic, flow-through, and reflex are used.",
    keyPoints: ["A label describes a broad approach, not a performance guarantee.", "Commercial products often mix approaches.", "No family is universally best."],
    sections: [
      { heading: "Conventional and alternate pathways", paragraphs: [
        "Many products are described in terms of a series of internal chambers or a single-piece core; other products advertise multiple gas pathways or reduced flow restriction. These are broad product categories, not standardized specifications.",
        "Marketing terms often overlap. The words 'flow-through' and 'low backpressure' describe design goals or reported behavior rather than one agreed construction method.",
      ] },
      { heading: "Configuration differences", paragraphs: [
        "Sealed, user-serviceable, modular, reflex, and integrally suppressed configurations describe different aspects of an assembly. These labels can relate to maintenance, product packaging, or the relationship between the firearm and accessory.",
      ] },
      { heading: "How to compare claims", bullets: [
        "Independent sound data under matching test conditions.",
        "Manufacturer-stated compatibility and warranty limitations.",
        "Weight, length, service arrangements, and access to support.",
        "Clear instructions from the maker and qualified professional inspection when needed.",
      ], paragraphs: [] },
    ], sources: ["cdc-study"],
  },
  {
    id: "baffles-cores", title: "Baffles, chambers, and monolithic cores", category: "Design language", minutes: 6,
    summary: "A non-dimensional explanation of common internal terminology.",
    keyPoints: ["Baffles and chambers are common terms.", "A monolithic core is an assembly concept.", "A sketch is not a manufacturing validation."],
    sections: [
      { heading: "What the words mean", paragraphs: [
        "A baffle is an internal feature associated with how gas moves through a device. A chamber is a region of space; a core is a major internal assembly. A monolithic core is generally discussed as a single-piece integrated structure.",
        "These broad words do not specify the shape, number, dimension, or manufacture of any internal part.",
      ] },
      { heading: "Why pictures can mislead", paragraphs: [
        "Cutaways are useful for recognizing vocabulary, but they omit tolerances, surface condition, material history, manufacturing defects, complex transient behavior, and regulatory classification.",
        "For the same reason, Suppressor Studio's concept sketches and classroom calculations are not engineering approvals or files for fabrication.",
      ] },
    ], sources: ["atf-nfa"],
  },
  {
    id: "materials-intro", title: "Understanding material families", category: "Materials", minutes: 8,
    summary: "Steel, titanium, aluminum, nickel alloys, composites, and their general material-science trade-offs.",
    keyPoints: ["Material grade and condition matter.", "Corrosion resistance is not the same as heat strength.", "No material name alone establishes safety."],
    sections: [
      { heading: "A material name is only the beginning", paragraphs: [
        "Engineering specifications depend on alloy chemistry, processing history, heat treatment, manufacturing route, surface condition, and temperature. The same named alloy may behave differently after welding, machining, cold work, or additive manufacturing.",
        "Use the Materials tab for comparative descriptions rather than definitive rankings or design approvals.",
      ] },
      { heading: "Main trade-offs", bullets: [
        "Density and the weight of a finished article.",
        "Corrosion behavior in moisture, salts, and combustion byproducts.",
        "Mechanical performance across changing temperatures.",
        "Cost, availability, and inspectability.",
        "Surface treatments, dissimilar-metal contact, and repairability.",
      ], paragraphs: [] },
      { heading: "Caution on online charts", paragraphs: [
        "Room-temperature yield strength, especially for specially processed specimens, should not be treated as an allowable operating limit in a hot cyclic system. Actual safety depends on a validated design and qualified engineering work.",
      ] },
    ], sources: [],
  },
  {
    id: "metal-processes", title: "How metal processing changes properties", category: "Materials", minutes: 7,
    summary: "Cast, wrought, heat-treated, welded, and additively made parts—conceptually.",
    keyPoints: ["Processing affects grain structure and defects.", "Heat treatment names do not tell the full story.", "Additive manufacturing still needs qualification."],
    sections: [
      { heading: "Wrought versus cast", paragraphs: [
        "Wrought metals undergo mechanical working that changes their microstructure. Cast parts solidify in a mold. The routes can produce different defect populations, anisotropy, and mechanical properties even within an alloy family.",
      ] },
      { heading: "Thermal and joining effects", paragraphs: [
        "Heat treatments can change the distribution of phases or precipitates. Welding and other joining methods create regions with different thermal histories. Inspection and process documentation matter as much as the material label.",
      ] },
      { heading: "Additive manufacturing", paragraphs: [
        "Metal additive manufacturing can produce complex commercial components. Powder quality, orientation, porosity, residual stress, surface finish, and post-processing have consequences for reliability.",
        "The existence of a printable model does not establish that a completed part is legal, safe, or suitable for use.",
      ] },
    ], sources: [],
  },
  {
    id: "corrosion", title: "Corrosion, surface finishes, and fouling", category: "Materials", minutes: 6,
    summary: "How corrosion resistance, surface chemistry, and residue are different issues.",
    keyPoints: ["Stainless means corrosion-resistant, not corrosion-proof.", "Dissimilar metals can create galvanic couples.", "Residue and surface damage are distinct from rust."],
    sections: [
      { heading: "Stainless steels and passive films", paragraphs: [
        "Chromium-containing stainless steels are known for forming a protective oxide film, but aggressive environments, crevices, and damaged surfaces can still lead to corrosion.",
      ] },
      { heading: "Galvanic corrosion", paragraphs: [
        "When unlike metals are electrically connected in the presence of a suitable electrolyte, electrochemical corrosion may be accelerated. The result depends on the material pairing, surface area, environment, and exposure.",
      ] },
      { heading: "Finish and residue", paragraphs: [
        "Anodizing, passivation, and hard coatings are different surface technologies. None can erase underlying damage or establish the strength of a component.",
        "Combustion residue is not interchangeable with corrosion, and not every discoloration indicates the same mechanism.",
      ] },
    ], sources: [],
  },
  {
    id: "lightweight", title: "Weight versus durability", category: "Materials", minutes: 5,
    summary: "The general engineering compromise behind lightweight and heat-resistant products.",
    keyPoints: ["Low density is useful but is not free.", "High temperature changes material comparisons.", "Durability is a system-level claim."],
    sections: [
      { heading: "A systems trade-off", paragraphs: [
        "Lightweight materials can lower carried mass, while other materials are valued for abrasion resistance, toughness, corrosion behavior, or hot mechanical properties. No one property answers all questions.",
      ] },
      { heading: "What a sales specification omits", paragraphs: [
        "Quoted weight does not describe service life, and a single tensile figure does not describe fatigue, erosion, thermal distortion, or real-world quality control.",
        "Product evaluation should consider independently tested performance, manufacturer limitations, intended use, and available after-sales service.",
      ] },
    ], sources: [],
  },
  {
    id: "ownership", title: "Federal, state, and local law: 2026 update", category: "Ownership & safety", minutes: 9,
    summary: "Recent ATF enforcement changes and why legal advice must be checked at the time of action.",
    keyPoints: ["ATF updated its enforcement posture in October 2026.", "The Gun Control Act and state laws still matter.", "Manufacturer/dealer duties differ from individual ownership."],
    sections: [
      { heading: "What changed", paragraphs: [
        "On October 9, 2026, ATF published guidance explaining that it would not enforce certain NFA making, registration, or transfer provisions for suppressors and some other formerly taxed items, including outside the parties named in a court injunction.",
        "This is an agency enforcement posture in a changing legal landscape. It is not a promise that every activity or item is lawful in every jurisdiction.",
      ] },
      { heading: "What did not disappear", paragraphs: [
        "ATF states that Gun Control Act requirements remain applicable and state or local restrictions can still prohibit possession or transactions. Licensed dealers have background-check and recordkeeping duties. Business manufacturing and dealing have additional licensing and occupational-tax issues.",
        "ATF also warns that state-law references to federal registration can complicate the legal status of unregistered items. Do not assume an older Form 1 guide—or an informal online post—accurately describes present obligations.",
      ] },
      { heading: "How to research responsibly", bullets: [
        "Read ATF's dated guidance and official state statutes rather than relying on old screenshots.",
        "Separate individual possession, making, retail sales, repair, transport, and business manufacturing rules.",
        "Check relevant local restrictions and consult a qualified attorney or regulator before taking action.",
        "Do not regard an app's educational drawings as a license, classification determination, or legal authorization.",
      ], paragraphs: [] },
    ], sources: ["atf-2026", "atf-nfa"],
  },
  {
    id: "hearing", title: "Hearing protection and exposure", category: "Ownership & safety", minutes: 7,
    summary: "Why reduced muzzle blast does not mean zero risk.",
    keyPoints: ["Impulse noise can damage hearing.", "Suppressors can reduce exposure but not eliminate it.", "Conventional hearing protection remains recommended."],
    sections: [
      { heading: "What research shows", paragraphs: [
        "CDC/NIOSH research has documented meaningful but variable reductions in firearm noise exposure with suppressors. The reduction depends on firearm, ammunition, position, and the metric being measured.",
        "The same research concludes that cumulative exposure from suppressed firearms can still present significant hearing risk and recommends hearing protection whenever shooting or hunting.",
      ] },
      { heading: "Protecting people nearby", paragraphs: [
        "Shooter-ear readings are not a complete picture. Instructors, companions, and other people positioned behind or to the side of the shooter may experience a different impulse-noise exposure.",
        "Indoor and partially enclosed spaces can amplify reflective exposure. Follow venue rules, qualified safety supervision, and appropriate eye and hearing protection.",
      ] },
      { heading: "Medical perspective", paragraphs: [
        "The American Academy of Otolaryngology–Head and Neck Surgery supports suppressors as one hearing-risk reduction measure, especially in combination with conventional hearing protection.",
      ] },
    ], sources: ["cdc-study", "aao", "osha"],
  },
  {
    id: "care", title: "Inspection, care, and manufacturer instructions", category: "Ownership & safety", minutes: 6,
    summary: "General ownership precautions without disassembly or modification guidance.",
    keyPoints: ["Treat used suppressors as potentially extremely hot.", "Maker instructions take precedence.", "Damage calls for qualified evaluation."],
    sections: [
      { heading: "General owner safety", paragraphs: [
        "Suppressors can remain dangerously hot after use. Keep people and heat-sensitive objects clear until the equipment has cooled sufficiently under the manufacturer's guidance.",
        "Cleaning, inspections, and service intervals vary with commercial design. Some products are sealed or are intended for factory service; do not assume all are user-serviceable.",
      ] },
      { heading: "Warning signs", bullets: [
        "Visible damage, unexpected sound or behavior, or unusual loosening is a reason to stop use.",
        "Unknown-origin parts, questionable repairs, or suspected obstruction require a qualified manufacturer's assessment.",
        "Avoid improvising modifications or mixing components without the maker's explicit approval.",
        "Follow the firearm and accessory manuals together, and ensure all handling follows established firearm safety practices.",
      ], paragraphs: [] },
    ], sources: [],
  },
  {
    id: "testing", title: "Evaluating commercial claims", category: "History & research", minutes: 7,
    summary: "Sound reduction, weight, 'flow-through,' and service claims in context.",
    keyPoints: ["Test protocols determine what dB numbers mean.", "Weight alone does not predict performance.", "Marketing categories are not standardized."],
    sections: [
      { heading: "Performance is multi-dimensional", paragraphs: [
        "A commercial unit may be evaluated on peak noise, exposure at multiple positions, mass, service life, repeatability, handling, and manufacturer support. One headline number is unlikely to represent all of these attributes.",
      ] },
      { heading: "A fair comparison", bullets: [
        "Compare results from equivalent firearms and ammunition with measurement methods disclosed.",
        "Look for independent testing and variability rather than a single best-case demonstration.",
        "Check the maker's stated use restrictions and warranty details.",
        "Distinguish objective data from subjective descriptions like 'soft' or 'pleasant' sound.",
      ], paragraphs: [] },
      { heading: "Red flags", paragraphs: [
        "Be skeptical of unspecified 'hearing safe' claims, impossible promises of silence, and advice that substitutes internet anecdotes for qualified safety or legal review.",
      ] },
    ], sources: ["cdc-study", "aao"],
  },
  {
    id: "history", title: "History and terminology", category: "History & research", minutes: 6,
    summary: "The terms silencer and suppressor, historical patents, and evolution of commercial design.",
    keyPoints: ["Both 'silencer' and 'suppressor' are widely used terms.", "Historical names can be misleading.", "Modern design language includes additive manufacturing."],
    sections: [
      { heading: "Where the terminology came from", paragraphs: [
        "The term 'silencer' is entrenched in U.S. statutory language and historical commercial branding; 'suppressor' is often preferred because it more accurately describes acoustic attenuation.",
        "The two words are generally used for the same class of firearm muzzle noise-control devices.",
      ] },
      { heading: "Broad evolution", paragraphs: [
        "Across the twentieth century, commercial offerings diversified in construction materials, mounting systems, maintenance philosophy, and manufacturing processes. Modern companies also advertise sophisticated internal gas-routing and metal-additive manufacturing.",
        "Patents are historical documents, not verification that a design is effective, lawful, safe, or suitable for replication.",
      ] },
    ], sources: ["atf-nfa", "cdc-noise"],
  },
  {
    id: "interactive-learning", title: "Safe classroom exercises", category: "History & research", minutes: 5,
    summary: "Hands-on learning without firearm components or fabrication instructions.",
    keyPoints: ["Sound and materials science can be explored safely.", "Keep experiments unrelated to firearms.", "Record uncertainty and measurement limits."],
    sections: [
      { heading: "Exercise: room acoustics", paragraphs: [
        "Use the same low-volume speaker recording in two ordinary listening spaces, and note differences in reflection and reverberation. Keep sound at a comfortable level and avoid high-volume tests.",
        "Discuss why the room changes what you hear even though the source recording is unchanged.",
      ] },
      { heading: "Exercise: materials reference cards", paragraphs: [
        "Create a comparison chart for ordinary household objects made from aluminum, stainless steel, titanium, and polymer. Look up manufacturer-confirmed material grades where available and compare broad categories such as weight, corrosion behavior, and cost.",
        "Treat this as materials-literacy practice, not a recipe for selecting or fabricating a pressure-bearing firearm part.",
      ] },
      { heading: "Exercise: research methods", paragraphs: [
        "Take two public commercial product brochures and identify which claims are directly measured, which are subjective, and which omit their test conditions. Research the difference between correlation and controlled comparison.",
      ] },
    ], sources: ["cdc-study", "osha"],
  },
];

export type MaterialCard = {
  id: string; name: string; family: string; context: string;
  strengths: readonly string[]; limitations: readonly string[]; misconception: string;
};
export const materials: readonly MaterialCard[] = [
  { id: "al6061", name: "6061 aluminum", family: "Aluminum", context: "General-purpose wrought aluminum, widely used throughout industry.",
    strengths: ["Relatively low density", "Broad availability and machinability", "Often has good general corrosion behavior"],
    limitations: ["Temperature can change mechanical properties", "Surface damage and galvanic exposure deserve attention"],
    misconception: "Lightweight does not automatically mean suitable for a hot pressure-bearing assembly." },
  { id: "al7075", name: "7075 aluminum", family: "Aluminum", context: "A high-strength aluminum alloy family associated with aerospace components.",
    strengths: ["High strength-to-weight potential in specified tempers", "Lower density than steels"],
    limitations: ["Corrosion and stress-corrosion susceptibility depend on condition", "High-temperature behavior is not captured by room-temperature strengths"],
    misconception: "A high room-temperature tensile number is not a universal durability rating." },
  { id: "ss304", name: "304 stainless steel", family: "Stainless steel", context: "Common austenitic stainless used in many fabricated products.",
    strengths: ["General corrosion resistance", "Common industrial supply chains", "Useful general forming characteristics"],
    limitations: ["Not corrosion-proof", "Thermal expansion and processing history matter"],
    misconception: "The word stainless describes a family, not immunity to rust or heat-related damage." },
  { id: "ss316l", name: "316L stainless steel", family: "Stainless steel", context: "A low-carbon austenitic grade often discussed for wet or chloride-prone environments.",
    strengths: ["Strong general corrosion-resistance reputation", "Widely documented industrial material"],
    limitations: ["Still susceptible to some corrosive environments", "Not automatically the strongest option at every temperature"],
    misconception: "Better corrosion resistance does not guarantee higher mechanical strength." },
  { id: "ss17-4", name: "17-4 PH stainless steel", family: "Precipitation-hardening steel", context: "A precipitation-hardening stainless grade used in varied engineered hardware.",
    strengths: ["Properties can be adjusted by controlled processing", "Combines corrosion resistance with engineered strength levels"],
    limitations: ["Condition and heat-treatment history are essential", "Hot properties and fatigue differ from room-temperature datasheets"],
    misconception: "An alloy designation without a verified processing condition tells only part of the story." },
  { id: "ss15-5", name: "15-5 PH stainless steel", family: "Precipitation-hardening steel", context: "A precipitation-hardening stainless grade seen in aerospace and precision engineering.",
    strengths: ["Documented strength/corrosion trade-offs", "Controlled processing can produce consistent conditions"],
    limitations: ["Actual condition requires traceability", "Expensive or specialized compared with common steels"],
    misconception: "Similar names do not make two PH stainless grades interchangeable." },
  { id: "ss416", name: "416 stainless steel", family: "Martensitic stainless steel", context: "A machinability-focused stainless grade with different corrosion characteristics from austenitic stainless.",
    strengths: ["Known for machinability", "Can achieve distinct mechanical property states"],
    limitations: ["Corrosion resistance varies significantly from other stainless families", "Sulfur-bearing free-machining grades involve trade-offs"],
    misconception: "Every stainless grade has the same corrosion behavior." },
  { id: "steel4140", name: "4140 alloy steel", family: "Low-alloy steel", context: "Chromium-molybdenum engineering steel used in mechanical equipment.",
    strengths: ["Wide industrial familiarity", "Mechanical properties depend on defined heat treatment"],
    limitations: ["Generally needs attention to corrosion protection", "Joining and heat treatment affect performance"],
    misconception: "A tough steel is not automatically corrosion-resistant or qualified for every use." },
  { id: "ti64", name: "Ti-6Al-4V (Grade 5 titanium)", family: "Titanium alloy", context: "A widely recognized structural titanium alloy.",
    strengths: ["Low density relative to steel", "Good general corrosion resistance", "Strong strength-to-weight potential in verified conditions"],
    limitations: ["Cost and processing complexity", "Heat, wear, and galling considerations", "Surface quality and condition remain important"],
    misconception: "Titanium is not invulnerable to heat, wear, or fatigue." },
  { id: "ti-cp", name: "Commercially pure titanium", family: "Titanium", context: "Titanium grades valued for corrosion resistance in chemical and medical industries.",
    strengths: ["Excellent general corrosion resistance in many environments", "Lower density than steel"],
    limitations: ["Properties differ markedly from Grade 5 alloy", "Surface galling and processing may matter"],
    misconception: "All products described as titanium use the same grade or properties." },
  { id: "ni718", name: "Inconel 718", family: "Nickel superalloy", context: "A nickel-based alloy associated with elevated-temperature aerospace and industrial applications.",
    strengths: ["Designed for demanding temperature environments", "High-value performance in qualified industrial use"],
    limitations: ["Expense", "Difficult processing and inspection", "Requires defined metallurgical condition"],
    misconception: "A heat-resistant alloy name alone is not evidence of a safe manufactured product." },
  { id: "ni625", name: "Inconel 625", family: "Nickel alloy", context: "A nickel-chromium alloy known for corrosion and oxidation resistance.",
    strengths: ["Resistance to many aggressive environments", "Widely recognized in marine and chemical equipment"],
    limitations: ["Cost and processing complexity", "Different performance profile from 718"],
    misconception: "All Inconel grades are interchangeable." },
  { id: "cobalt", name: "Cobalt-based wear alloys", family: "Cobalt alloy", context: "Specialized material families used in severe industrial wear and heat environments.",
    strengths: ["Some grades have strong hot-wear or corrosion properties", "Useful case studies in surface engineering"],
    limitations: ["High expense and specialized handling", "Properties depend heavily on the exact composition"],
    misconception: "Wear resistance is not the same as overall structural safety." },
  { id: "polymer", name: "Engineering polymers and composites", family: "Nonmetallic materials", context: "A broad group covering high-temperature polymers, reinforced plastics, and fiber composites.",
    strengths: ["Low density in many formulations", "Possibility of complex nonstructural products", "Wide range of chemical and electrical characteristics"],
    limitations: ["Temperature and creep limits vary substantially", "Anisotropy and defects in printed objects", "No general-purpose pressure qualification"],
    misconception: "A consumer 3D printer or advertised heat-resistant filament does not certify firearm-part safety." },
  { id: "finish", name: "Surface finishes and coatings", family: "Surface technology", context: "Anodizing, passivation, conversion coatings, and wear-resistant surface layers.",
    strengths: ["Can modify surface corrosion or wear behavior", "May improve appearance or cleanability"],
    limitations: ["Coating performance depends on substrate and process", "Damage to a coating can expose the base material"],
    misconception: "A surface finish does not transform the strength of an underlying part." },
];

export type DesignFamily = {
  name: string; summary: string; typicalClaims: readonly string[];
  remember: string; questions: readonly string[];
};
export const designFamilies: readonly DesignFamily[] = [
  { name: "Baffle-based assemblies", summary: "A common umbrella term for commercial products described as containing multiple internal gas-interaction elements.",
    typicalClaims: ["Familiar category in cutaway illustrations", "A wide variety of claimed acoustic behaviors"], remember: "The label does not identify the number, geometry, or safety of internal features.",
    questions: ["Is independent acoustic testing available?", "How does the maker describe service and inspection?"] },
  { name: "Monolithic cores", summary: "A product category referring to a largely integrated internal core rather than a set of distinct components.",
    typicalClaims: ["Part-count or assembly claims", "Distinct manufacturing approaches"], remember: "Single-piece construction alone does not establish reliability, performance, or ease of cleaning.",
    questions: ["Is the design factory-serviceable?", "What does its warranty actually cover?"] },
  { name: "Low-backpressure / flow-through", summary: "Broad marketing and technical categories associated with gas flow management and reduced restriction.",
    typicalClaims: ["Lower operating-system influence", "Different distribution of perceived noise"], remember: "Terms and test methods are not universally standardized, and product claims must be evaluated independently.",
    questions: ["Are measurement conditions disclosed?", "Do claims distinguish muzzle and ear positions?"] },
  { name: "Reflex / over-barrel", summary: "Describes a category of packaging relative to the host firearm, not an intrinsic sound rating.",
    typicalClaims: ["Different length and handling trade-offs", "Distinct compatibility considerations"], remember: "Mounting compatibility must be determined by the manufacturer, not appearance.",
    questions: ["Does the manufacturer list this exact firearm as compatible?", "Are support and inspection arrangements clear?"] },
  { name: "Sealed construction", summary: "Commercial products where ordinary user disassembly may not be intended or supported.",
    typicalClaims: ["Factory-defined service model", "Potentially fewer user-accessible interfaces"], remember: "Never assume sealed means maintenance-free.",
    questions: ["What are the maker's care instructions?", "How are inspections and repairs handled?"] },
  { name: "User-serviceable construction", summary: "Commercial products whose makers provide authorized maintenance procedures.",
    typicalClaims: ["Accessible routine service", "Different maintenance workload"], remember: "User service is only appropriate when the original manufacturer's instructions explicitly allow it.",
    questions: ["Are authentic manuals available?", "What tools and procedures does the manufacturer authorize?"] },
  { name: "Modular commercial systems", summary: "Product families sold with manufacturer-approved configurations or accessories.",
    typicalClaims: ["Accessory and configuration choices", "Potential differences in product length and mass"], remember: "This category does not justify mixing parts across models or altering them.",
    questions: ["Are all configurations maker-approved?", "How do warranty and legal restrictions apply?"] },
  { name: "Integrally suppressed products", summary: "A category where a firearm and noise-reduction system are designed as an integrated commercial product.",
    typicalClaims: ["Package-level design", "Specialized factory service requirements"], remember: "Legal classification and servicing can differ significantly from standalone accessories.",
    questions: ["What is the precise legal classification?", "Is qualified factory service available?"] },
];

export const glossary = [
  ["Attenuation", "A reduction in the level or energy of a signal; the measurement method matters."],
  ["Muzzle blast", "The acoustic impulse from rapidly expanding propellant gases."],
  ["Impulse noise", "A brief, high-intensity sound event; peak and cumulative exposures matter."],
  ["Peak SPL", "The maximum instantaneous sound-pressure level measured during an event."],
  ["A-weighting", "A frequency weighting commonly used for sound-exposure measurements."],
  ["Decibel", "A logarithmic unit expressing a ratio; the reference must be known."],
  ["Sonic crack", "The shock-wave sound associated with a supersonic projectile."],
  ["Subsonic", "Moving slower than the local speed of sound."],
  ["Supersonic", "Moving faster than the local speed of sound."],
  ["Backpressure", "A general term for flow resistance effects; product metrics can differ."],
  ["Baffle", "A general name for an internal gas-interaction feature."],
  ["Chamber", "A contained region; its existence alone says little about safety or performance."],
  ["Core", "A major internal assembly in some products."],
  ["Monolithic", "Describing an integrated single-piece construction."],
  ["Flow-through", "An umbrella term used for multiple gas-routing product concepts."],
  ["Reflex", "A packaging/layout term used in descriptions of some commercial devices."],
  ["First-round pop", "A colloquial term for a reported difference involving an initial discharge."],
  ["Fouling", "Residue or deposits accumulated during use."],
  ["Passivation", "Formation or treatment of a protective surface film, especially on stainless steels."],
  ["Galvanic corrosion", "Electrochemical corrosion influenced by dissimilar metals and an electrolyte."],
  ["Anodizing", "Electrochemical surface processing commonly associated with aluminum and titanium."],
  ["Precipitation hardening", "A heat-treatment family in which fine precipitates alter material properties."],
  ["Fatigue", "Progressive damage associated with repeated loading cycles."],
  ["Creep", "Time-dependent deformation under sustained stress, often important at elevated temperature."],
  ["Thermal expansion", "Change in dimensions associated with temperature."],
  ["Additive manufacturing", "Building objects by adding material through a controlled process."],
  ["Metrology", "The science of measurement, calibration, traceability, and uncertainty."],
  ["NFA", "National Firearms Act; consult the latest ATF guidance for current enforcement."],
  ["GCA", "Gun Control Act; federal requirements that ATF says continue to apply."],
  ["Serviceability", "Whether a manufacturer provides and permits maintenance or repair pathways."],
] as const;

export type KnowledgeQuestion = {
  id: string; prompt: string; choices: readonly string[]; correct: number; explanation: string; lessonId: string;
};
export const knowledgeQuestions: readonly KnowledgeQuestion[] = [
  { id: "q1", prompt: "Which sound source is a muzzle suppressor primarily intended to reduce?",
    choices: ["The expanding muzzle-gas report", "Every mechanical noise", "The projectile's entire shock wave"], correct: 0,
    explanation: "Muzzle blast is the principal target. Mechanical sound and a supersonic projectile's shock wave may remain.", lessonId: "how-it-works" },
  { id: "q2", prompt: "What is true about comparing two advertised dB numbers?",
    choices: ["The smaller number always means a safer product", "Only the color of the chart matters", "You need compatible test methods and locations"], correct: 2,
    explanation: "Measurement position, instrument method, ammunition, firearm, and environment can change the interpretation.", lessonId: "decibels" },
  { id: "q3", prompt: "Is a firearm described as 'suppressed' automatically hearing-safe?",
    choices: ["Yes", "No", "Only outdoors"], correct: 1,
    explanation: "CDC/NIOSH research warns that reduced gunshot exposure can still present a significant hearing risk.", lessonId: "hearing" },
  { id: "q4", prompt: "What does an alloy name by itself establish?",
    choices: ["Its exact reliability under every condition", "Its final condition and quality control", "Neither: processing, environment, and condition also matter"], correct: 2,
    explanation: "Material names do not substitute for traceability, qualified engineering, or inspection.", lessonId: "materials-intro" },
  { id: "q5", prompt: "Which statement fits ATF's October 2026 guidance?",
    choices: ["Every state restriction vanished", "GCA and state rules can still apply", "Licensed dealers no longer have any obligations"], correct: 1,
    explanation: "ATF explains that its changed NFA enforcement posture does not erase GCA or state/local requirements.", lessonId: "ownership" },
  { id: "q6", prompt: "A commercial product described as 'flow-through' tells you what, by itself?",
    choices: ["Its exact measured noise level", "Its legal classification everywhere", "A broad design goal, not guaranteed measured performance"], correct: 2,
    explanation: "Marketing categories overlap and require evidence from comparable tests.", lessonId: "design-families" },
  { id: "q7", prompt: "Which is a safe educational project for learning about acoustics?",
    choices: ["Comparing low-volume room reflections using an ordinary speaker", "Assembling an untested high-pressure firearm accessory", "Replicating an unknown internal component"], correct: 0,
    explanation: "Low-volume room acoustics demonstrates a general concept without manufacturing firearm parts.", lessonId: "interactive-learning" },
];

export const getLesson = (id: string): Lesson | undefined => lessons.find((lesson) => lesson.id === id);
