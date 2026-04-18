export interface LifeCase {
  id: string;
  emoji: string;
  label: string;
  situation: string;
  /** Two-paragraph narrative describing the case in depth */
  narrative: [string, string];
  options: string[];
}

export const LIFE_CASES: LifeCase[] = [
  {
    id: "amour",
    emoji: "❤️",
    label: "Amour",
    situation: "Relation floue / instable.",
    narrative: [
      "Depuis quelques semaines, ce lien que tu pensais clair s'est mis à vaciller. Les mots se font rares, les silences plus pesants, et chaque échange laisse une trace d'incertitude. Tu sens que quelque chose se joue, sans pouvoir le nommer.",
      "Ce flou n'est pas une absence : c'est un appel. Il te demande de regarder ce que tu cherches vraiment dans cette relation, et ce que tu es prêt·e à offrir. La sagesse du Fâ t'invite à honorer ce qui se présente — sans fuir ni forcer.",
    ],
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
    narrative: [
      "Un·e ami·e proche a changé. Plus distant·e, plus fermé·e, ou peut-être simplement ailleurs. Tu te demandes si tu as fait quelque chose, ou si la vie a tout simplement déplacé ses priorités sans prévenir.",
      "Les liens vivants évoluent comme les saisons. Ce moment t'invite à écouter ton ressenti sans précipitation : est-ce un passage, une transformation, ou une fin qui demande à être reconnue avec dignité ?",
    ],
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
    narrative: [
      "Tu reviens chez les tiens et quelque chose ne s'ajuste plus. Les conversations tournent en rond, les attentes sont implicites, et tu sens un fossé silencieux entre qui tu es devenu·e et ce qu'on attend encore de toi.",
      "Le Fâ rappelle que la famille est une racine, pas une cage. Il t'invite à honorer la lignée tout en assumant ta propre voie — trouver le geste juste qui ne renie ni ce que tu deviens, ni ce que tu reçois d'eux.",
    ],
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
    narrative: [
      "Une décision financière se présente : un investissement, un engagement, un risque. Les chiffres sont là, mais ce qui te trouble se situe ailleurs — dans la tension entre la sécurité que tu connais et l'élan qui te pousse à oser.",
      "L'argent n'est jamais qu'un miroir : il révèle ton rapport à la confiance, à la peur, au mérite. Avant d'agir, écoute ce que cette situation te raconte de toi — la réponse juste émerge quand l'intention est claire.",
    ],
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
    narrative: [
      "Ton travail tient debout : les fins de mois sont assurées, l'équipe est correcte, les missions se succèdent. Et pourtant, quelque chose en toi s'éteint doucement. Un vide discret, qui grandit chaque dimanche soir.",
      "Cette dissonance entre extérieur stable et intérieur en sourdine est un signal. Le Fâ t'invite à explorer ce vide comme un message : il pointe peut-être vers une vocation enfouie, ou simplement un besoin de sens à réintroduire dans ton quotidien.",
    ],
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
