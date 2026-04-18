import { motion } from "framer-motion";
import { resolveFaSign, type SignMeaning } from "@/data/signMeanings";

interface Props {
  signXIdx: number;
  signYIdx: number;
  /** Compact mode: smaller image, shorter text */
  compact?: boolean;
  /** Fallback context used when no curated meaning exists yet */
  signXName?: string;
  signYName?: string;
  dynamicWord?: string;
}

/**
 * Displays the authentic Fa sign representation extracted from the PDF
 * along with its reformulated meaning (proverb, essence, vigilance, engagement).
 *
 * For undocumented signs (100-256) or partially documented ones, a contextual
 * description is generated from the combined name + dynamic word so the card
 * never falls back to a "coming soon" placeholder.
 */
const SignDisplay = ({
  signXIdx,
  signYIdx,
  compact = false,
  signXName,
  signYName,
  dynamicWord,
}: Props) => {
  const meaning: SignMeaning | null = resolveFaSign(signXIdx, signYIdx);

  // Build a graceful fallback: name + a contextual sentence
  const combinedName =
    meaning?.name ??
    (signXName && signYName ? `${signXName}-${signYName}` : "Signe combiné");

  const fallbackEssence = buildFallbackEssence({
    signXName,
    signYName,
    dynamicWord,
  });

  const essence = meaning?.essence?.trim() || fallbackEssence;
  const proverb = meaning?.proverb?.trim() || null;
  const vigilance = meaning?.vigilance?.trim() || null;
  const engagement = meaning?.engagement?.trim() || null;
  const isMother = meaning?.tier === "mother";



  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      {/* Description (replaces the embedded sign-name image) */}
      <div>
        <h4 className="font-display text-base sm:text-lg leading-tight text-foreground">
          {combinedName}
        </h4>
        {proverb && (
          <p className="text-xs sm:text-sm italic text-foreground/70 mt-1.5 leading-relaxed">
            « {proverb} »
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">
          {essence}
        </p>
        {isMother && (
          <div className="mt-3">
            <span
              className="inline-block text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full font-medium"
              style={{
                background: "hsl(var(--benin-yellow) / 0.15)",
                color: "hsl(var(--benin-yellow) / 0.9)",
                border: "1px solid hsl(var(--benin-yellow) / 0.3)",
              }}
            >
              Signe mère
            </span>
          </div>
        )}
      </div>

      {/* Detailed reading: vigilance + engagement only (essence already shown above) */}
      {!compact && (vigilance || engagement) && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          {vigilance && (
            <Block label="Vigilance" text={vigilance} dot="hsl(var(--benin-red))" />
          )}
          {engagement && (
            <Block label="Engagement" text={engagement} dot="hsl(var(--benin-yellow))" />
          )}
        </div>
      )}
    </motion.div>
  );
};

/**
 * Builds a meaningful, never-empty description from the available context
 * (sign names + dynamic word). Used when the curated PDF data is not yet
 * available for a given combined sign.
 */
function buildFallbackEssence({
  signXName,
  signYName,
  dynamicWord,
}: {
  signXName?: string;
  signYName?: string;
  dynamicWord?: string;
}): string {
  if (signXName && signYName && dynamicWord) {
    return `Ce signe combine la force de ${signXName} et celle de ${signYName}. Leur rencontre dessine une voie d'${dynamicWord.toLowerCase()} : un appel à honorer ce qui, en toi, cherche à s'accorder. Écoute ce que cette tension intérieure veut révéler — c'est là que se trouve ta réponse.`;
  }
  if (signXName && signYName) {
    return `La rencontre de ${signXName} et ${signYName} ouvre un passage singulier. Prends le temps d'observer ce qui s'éveille en toi à la lecture de ce signe : la sagesse du Fâ se reçoit autant qu'elle se déchiffre.`;
  }
  return "Ce signe t'invite à un temps d'écoute intérieure. Ce qui se présente à toi en ce moment porte une parole — accueille-la sans hâte.";
}

const Block = ({
  label,
  text,
  dot,
}: {
  label: string;
  text: string;
  dot: string;
}) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: dot }}
      />
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        {label}
      </span>
    </div>
    <p className="text-xs sm:text-sm leading-relaxed text-foreground/80">{text}</p>
  </div>
);

export default SignDisplay;
