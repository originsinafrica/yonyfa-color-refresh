import { useState } from "react";
import { motion } from "framer-motion";
import type { LifeCase } from "@/data/cases";
import AudioRecorder from "./AudioRecorder";

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
    setTimeout(() => onComplete(selected), 600);
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
        <span className="text-3xl block mb-2">{lifeCase.emoji}</span>
        <p
          className="text-xs uppercase tracking-widest mb-1 font-semibold"
          style={{ color: "hsl(145, 55%, 38%)" }}
        >
          {lifeCase.label}
        </p>
        <p
          className="font-display text-lg md:text-xl"
          style={{ color: "hsl(45, 95%, 45%)" }}
        >
          {lifeCase.situation}
        </p>
        <p className="text-xs mt-2 italic" style={{ color: "hsl(30, 8%, 45%)" }}>
          À la lumière de{" "}
          <span style={{ color: "hsl(145, 55%, 38%)" }}>« {dynamicWord} »</span>, que ferais-tu ?
        </p>
      </div>

      {/* Two-column: narrative left, options right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* LEFT — Two paragraphs */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed" style={{ color: "hsl(30, 8%, 25%)" }}>
            {lifeCase.narrative[0]}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "hsl(30, 8%, 25%)" }}>
            {lifeCase.narrative[1]}
          </p>
        </div>

        {/* RIGHT — 4 options stacked */}
        <div className="flex flex-col gap-2.5">
          {lifeCase.options.map((opt, i) => {
            const isSelected = selected === i;
            const isConfirmedSelected = confirmed && isSelected;

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                onClick={() => handleSelect(i)}
                disabled={confirmed}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                  confirmed && !isSelected ? "opacity-30" : ""
                }`}
                style={{
                  borderColor: isSelected ? optionAccent(i) : `${optionAccent(i)}55`,
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
                <span className="mr-2 font-bold" style={{ color: optionAccent(i) }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </motion.button>
            );
          })}

          {/* Confirm button */}
          {!confirmed && (
            <button
              onClick={handleConfirm}
              disabled={selected === null}
              className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: selected !== null ? "hsl(145, 55%, 38%)" : "hsl(40, 20%, 96%)",
                color: selected !== null ? "hsl(0, 0%, 100%)" : "hsl(30, 8%, 45%)",
                cursor: selected !== null ? "pointer" : "not-allowed",
              }}
            >
              Valider ma réflexion
            </button>
          )}
        </div>
      </div>

      {/* Audio recorder — appears once a choice is selected */}
      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 pt-6 border-t"
          style={{ borderColor: "hsl(40, 20%, 90%)" }}
        >
          <AudioRecorder />
        </motion.div>
      )}
    </motion.div>
  );
};

export default CaseQCM;
