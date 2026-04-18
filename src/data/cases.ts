export interface LifeCase {
  id: string;
  emoji: string;
  label: string;
  situation: string;
  options: string[];
}

export const LIFE_CASES: LifeCase[] = [
  {
    id: "amour",
    emoji: "❤️",
    label: "Amour",
    situation: "Relation floue / instable.",
    options: [
      "S'investir pour clarifier",
      "Prendre de la distance",
      "Accepter sans définir",
      "Méditer sur soi",
    ],
  },
  {
    id: "amitie",
    emoji: "🤝",
    label: "Amitié",
    situation: "Changement d'attitude d'un proche.",
    options: [
      "Aller vers lui",
      "Laisser de l'espace",
      "Observer son ressenti",
      "Reconsidérer le lien",
    ],
  },
  {
    id: "famille",
    emoji: "👨‍👩‍👧",
    label: "Famille",
    situation: "Décalage avec les siens.",
    options: [
      "Recréer du lien",
      "Se recentrer",
      "Accepter l'évolution",
      "Comprendre le sens",
    ],
  },
  {
    id: "argent",
    emoji: "💰",
    label: "Argent",
    situation: "Décision financière incertaine.",
    options: [
      "Prendre le risque",
      "Sécuriser et attendre",
      "Questionner son rapport à l'argent",
      "Vérifier l'alignement",
    ],
  },
  {
    id: "travail",
    emoji: "💼",
    label: "Travail",
    situation: "Stabilité mais vide intérieur.",
    options: [
      "Changer rapidement",
      "Explorer en restant",
      "Approfondir le malaise",
      "Analyser l'origine du vide",
    ],
  },
];

/** Pick a random case */
export const pickRandomCase = (): LifeCase =>
  LIFE_CASES[Math.floor(Math.random() * LIFE_CASES.length)];
