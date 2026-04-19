import { useState } from "react";
import { motion } from "framer-motion";
import type { LifeCase } from "@/data/cases";

interface Props {
  lifeCase: LifeCase;
  onOpenMatrix: (selectedOption: number | null) => void;
}

const ACCENTS = [
  "hsl(145, 55%, 38%)",
  "hsl(45, 95%, 45%)",
  "hsl(358, 75%, 52%)",
  "hsl(145, 55%, 38%)",
];
const optionAccent = (i: number) => ACCENTS[i % ACCENTS.length];

const CaseCard = ({ lifeCase, onOpenMatrix }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border p-6 md:p-8 bg-[hsl(0,0%,100%)]"
      style={{ borderColor: "hsl(145, 55%, 38%)" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-4xl block mb-2">{lifeCase.emoji}</span>
        <p
          className="text-xs uppercase tracking-widest mb-1 font-semibold"
          style={{ color: "hsl(145, 55%, 38%)" }}
        >
          {lifeCase.label}
        </p>
        <p
          className="font-display text-xl md:text-2xl"
          style={{ color: "hsl(45, 95%, 45%)" }}
        >
          {lifeCase.situation}
        </p>
      </div>

      {/* Two-column: narrative left, options right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-3">
          <div className="rounded-xl p-3" style={{ background: "hsl(40, 20%, 96%)" }}>
            <p
              className="text-[10px] uppercase tracking-widest font-semibold mb-2"
              style={{ color: "hsl(145, 55%, 38%)" }}
            >
              🎧 Écoute du cas
            </p>
            <audio controls className="w-full h-9" preload="none">
              <source src={`/audio/cases/${lifeCase.id}.mp3`} type="audio/mpeg" />
              Votre navigateur ne supporte pas l'audio.
            </audio>
            <p className="text-[10px] mt-1.5 italic" style={{ color: "hsl(30, 8%, 50%)" }}>
              Transcription ci-dessous
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(30, 8%, 25%)" }}>
            {lifeCase.narrative[0]}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(30, 8%, 25%)" }}>
            {lifeCase.narrative[1]}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-1"
            style={{ color: "hsl(30, 8%, 45%)" }}
          >
            Quelle voie t'attire ?
          </p>
          {lifeCase.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                onClick={() => setSelected(i)}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2"
                style={{
                  borderColor: isSelected ? optionAccent(i) : `${optionAccent(i)}55`,
                  background: isSelected ? `${optionAccent(i)}1f` : "hsl(0, 0%, 100%)",
                  color: "hsl(30, 8%, 12%)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2 font-bold" style={{ color: "hsl(30, 8%, 12%)" }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          onClick={() => onOpenMatrix(selected)}
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{
            background: "hsl(145, 55%, 38%)",
            color: "hsl(0, 0%, 100%)",
          }}
        >
          Ouvrir la matrice des choix ✦
        </button>
        <p className="text-xs italic" style={{ color: "hsl(30, 8%, 50%)" }}>
          {selected !== null
            ? "Ton intuition est notée. Laisse maintenant le Fâ parler."
            : "Tu peux ouvrir la matrice sans choisir — le Fâ guide aussi sans présupposé."}
        </p>
      </div>
    </motion.div>
  );
};

export default CaseCard;
