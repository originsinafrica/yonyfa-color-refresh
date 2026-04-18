import { SIGNS, valueToMatrixIndex, type FongbeSign } from "./fongbe";
import { DYNAMICS_MATRIX } from "./dynamics";
import { LIFE_CASES, type LifeCase } from "./cases";

export interface Consultation {
  id: string;
  signX: FongbeSign;
  signY: FongbeSign;
  dynamicWord: string;
  lifeCase: LifeCase;
  selectedOption: number;
  reflection: string;
  author: string;
  isAnonymous: boolean;
  videoSeed: number;
  videoOffset: number;
  scores: {
    resonance: number;
    relevance: number;
    clarity: number;
    count: number;
  };
}

const FIRST_NAMES = [
  "Aïssatou", "Kofi", "Adjoa", "Mawuli", "Folake", "Amadou", "Naya", "Kwame",
  "Sika", "Yao", "Efua", "Babatunde", "Ifeoma", "Selasi", "Akua", "Olamide",
  "Zola", "Demba", "Nia", "Tariq",
];

const REFLECTIONS_BY_CASE: Record<string, string[]> = {
  amour: [
    "J'ai compris qu'aimer, c'est aussi laisser respirer.",
    "Le silence m'a parlé plus fort que les mots.",
    "Clarifier sans précipiter — voilà ma voie.",
    "Méditer sur soi avant de demander à l'autre.",
  ],
  amitie: [
    "Donner de l'espace, c'est aussi une forme de présence.",
    "L'amitié vraie résiste au changement.",
    "Observer sans juger m'a tout enseigné.",
    "Reconsidérer le lien pour mieux l'honorer.",
  ],
  famille: [
    "Recréer le lien commence par soi-même.",
    "Accepter l'évolution, c'est accepter la vie.",
    "Comprendre le sens avant de réagir.",
    "Se recentrer pour mieux revenir aux siens.",
  ],
  argent: [
    "L'argent suit l'alignement, jamais l'inverse.",
    "Sécuriser n'est pas fuir, c'est honorer.",
    "Mon rapport à l'argent reflète mon rapport à moi.",
    "Prendre le risque quand le cœur dit oui.",
  ],
  travail: [
    "Le vide intérieur m'invite à explorer autrement.",
    "Rester pour comprendre, partir pour grandir.",
    "Approfondir le malaise révèle la voie.",
    "Analyser l'origine du vide, c'est déjà avancer.",
  ],
};

// Deterministic pseudo-random for consistent mock data
const seedRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const generateConsultations = (): Consultation[] => {
  const list: Consultation[] = [];
  const rand = seedRandom(42);

  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 16; col++) {
      const signX = SIGNS[col];
      const signY = SIGNS[row];
      const matrixRow = signY.valueIndex;
      const matrixCol = valueToMatrixIndex(signX.value);
      const dynamicWord = DYNAMICS_MATRIX[matrixRow]?.[matrixCol] ?? "";
      const caseIdx = Math.floor(rand() * LIFE_CASES.length);
      const lifeCase = LIFE_CASES[caseIdx];
      const optionIdx = Math.floor(rand() * lifeCase.options.length);
      const reflections = REFLECTIONS_BY_CASE[lifeCase.id] ?? [""];
      const reflection = reflections[Math.floor(rand() * reflections.length)];
      const isAnonymous = rand() > 0.6;
      const author = isAnonymous
        ? "Anonyme"
        : FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];

      // Generate plausible scores (skewed positive for most)
      const baseQuality = 40 + rand() * 50;
      const resonance = Math.max(0, Math.min(100, Math.round(baseQuality + (rand() - 0.5) * 30)));
      const relevance = Math.max(0, Math.min(100, Math.round(baseQuality + (rand() - 0.5) * 30)));
      const clarity = Math.max(0, Math.min(100, Math.round(baseQuality + (rand() - 0.5) * 30)));
      const count = 3 + Math.floor(rand() * 40);

      list.push({
        id: `${row}-${col}`,
        signX,
        signY,
        dynamicWord,
        lifeCase,
        selectedOption: optionIdx,
        reflection,
        author,
        isAnonymous,
        videoSeed: Math.floor(rand() * 1000),
        videoOffset: rand() * 5, // 0-5s offset for the loop
        scores: { resonance, relevance, clarity, count },
      });
    }
  }
  return list;
};

export const CONSULTATIONS: Consultation[] = generateConsultations();

export const getConsultationById = (id: string) =>
  CONSULTATIONS.find((c) => c.id === id);

export const computeGlobalScore = (s: Consultation["scores"]) =>
  Math.round((s.resonance + s.relevance + s.clarity) / 3);
