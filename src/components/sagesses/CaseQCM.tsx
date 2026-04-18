import { useState } from "react";
import { motion } from "framer-motion";
import type { LifeCase } from "@/data/cases";

interface Props {
  lifeCase: LifeCase;
  dynamicWord: string;
  onComplete: (selectedOption: number) => void;
}

// Cycle Bénin : vert · jaune · rouge
const ACCENTS = ["hsl(145, 55%, 38%)", "hsl(45, 95%, 45%)", "hsl(358, 75%, 52%)", "hsl(145, 55%, 38%)"];
const optionAccent = (i: number) => ACCENTS[i % ACCENTS.length];

const CaseQCM = ({ lifeCase, dynamicWord, onComplete }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (index: number) => {
    if (confirmed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    setTimeout(() => onComplete(selected), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8 rounded-2xl border p-6"
      style={{
        borderColor: "hsl(145, 55%, 38%)",
        background: "hsl(0, 0%, 100%)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="text-3xl block mb-2"
        >
          {lifeCase.emoji}
        </motion.span>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: "hsl(145, 55%, 38%)" }}
        >
          {lifeCase.label}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display text-lg md:text-xl"
          style={{ color: "hsl(45, 95%, 45%)" }}
        >
          {lifeCase.situation}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs mt-2 italic"
          style={{ color: "hsl(30, 8%, 45%)" }}
        >
          À la lumière de <span style={{ color: "hsl(145, 55%, 38%)" }}>« {dynamicWord} »</span>, que feriez-vous ?
        </motion.p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {lifeCase.options.map((opt, i) => {
          const isSelected = selected === i;
          const isConfirmedSelected = confirmed && isSelected;

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              onClick={() => handleSelect(i)}
              disabled={confirmed}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                confirmed && !isSelected ? "opacity-30" : ""
              }`}
              style={{
                borderColor: isSelected
                  ? optionAccent(i)
                  : `${optionAccent(i)}55`,
                background: isConfirmedSelected
                  ? optionAccent(i)
                  : isSelected
                  ? `${optionAccent(i)}1f`
                  : "hsl(0, 0%, 100%)",
                color: isConfirmedSelected
                  ? "hsl(0, 0%, 100%)"
                  : isSelected
                  ? optionAccent(i)
                  : "hsl(30, 8%, 35%)",
              }}
              whileHover={!confirmed ? { scale: 1.02 } : undefined}
              whileTap={!confirmed ? { scale: 0.98 } : undefined}
            >
              <span className="mr-2 font-bold" style={{ color: optionAccent(i) }}>{String.fromCharCode(65 + i)}.</span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Confirm */}
      {!confirmed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selected !== null ? 1 : 0.3 }}
          className="text-center"
        >
          <button
            onClick={handleConfirm}
            disabled={selected === null}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              background: selected !== null ? "hsl(145, 55%, 38%)" : "hsl(40, 20%, 96%)",
              color: selected !== null ? "hsl(30, 30%, 12%)" : "hsl(30, 8%, 45%)",
              cursor: selected !== null ? "pointer" : "not-allowed",
            }}
          >
            Valider ma réflexion
          </button>
        </motion.div>
      )}

      {/* Confirmed message */}
      {confirmed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm" style={{ color: "hsl(45, 95%, 45%)" }}>
            ✦ Votre réflexion a été enregistrée.
          </p>
          <p className="text-xs mt-1 italic" style={{ color: "hsl(30, 8%, 45%)" }}>
            En Phase 3, vous pourrez enregistrer votre réponse audio.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CaseQCM;
