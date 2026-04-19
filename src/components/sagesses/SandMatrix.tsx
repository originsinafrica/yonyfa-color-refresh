import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { SIGNS, shuffle, valueToMatrixIndex, type FongbeSign } from "@/data/fongbe";
import { DYNAMICS_MATRIX, DYNAMICS_AXIS } from "@/data/dynamics";
import { pickRandomCase, type LifeCase } from "@/data/cases";
import DotIdeogram from "./DotIdeogram";
import SignDisplay from "./SignDisplay";
import CaseCard from "./CaseCard";
import AudioRecorder from "./AudioRecorder";

type Phase = "case" | "matrix" | "revealed";

interface RevealedCell {
  row: number;
  col: number;
  signX: FongbeSign;
  signY: FongbeSign;
  dynamicWord: string;
  axisXWord: string;
  axisYWord: string;
}

const SandMatrix = () => {
  const [phase, setPhase] = useState<Phase>("case");
  const [lifeCase, setLifeCase] = useState<LifeCase>(() => pickRandomCase());
  const [intuitiveChoice, setIntuitiveChoice] = useState<number | null>(null);
  const [shuffledX, setShuffledX] = useState(() => shuffle(SIGNS));
  const [shuffledY, setShuffledY] = useState(() => shuffle(SIGNS));
  const [revealed, setRevealed] = useState<RevealedCell | null>(null);
  const [caseOpen, setCaseOpen] = useState(false);
  const [finalChoice, setFinalChoice] = useState<number | null>(null);

  const restart = useCallback(() => {
    setLifeCase(pickRandomCase());
    setIntuitiveChoice(null);
    setShuffledX(shuffle(SIGNS));
    setShuffledY(shuffle(SIGNS));
    setRevealed(null);
    setFinalChoice(null);
    setPhase("case");
  }, []);

  const openMatrix = useCallback((selectedOption: number | null) => {
    setIntuitiveChoice(selectedOption);
    setPhase("matrix");
  }, []);

  const closeRevealed = useCallback(() => {
    setRevealed(null);
    setPhase("matrix");
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      const signX = shuffledX[col];
      const signY = shuffledY[row];
      const matrixRow = signY.valueIndex;
      const matrixCol = valueToMatrixIndex(signX.value);
      const dynamicWord = DYNAMICS_MATRIX[matrixRow]?.[matrixCol] ?? "";
      const axisXWord = DYNAMICS_AXIS[matrixCol] ?? "";
      const axisYWord = DYNAMICS_AXIS[matrixRow] ?? "";
      setRevealed({ row, col, signX, signY, dynamicWord, axisXWord, axisYWord });
      setPhase("revealed");
    },
    [shuffledX, shuffledY]
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {/* PHASE 1 — Case card */}
        {phase === "case" && (
          <motion.div
            key="case"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <CaseCard lifeCase={lifeCase} onOpenMatrix={openMatrix} />
          </motion.div>
        )}

        {/* PHASE 2 — Matrix */}
        {phase === "matrix" && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-6">
              <p
                className="text-xs uppercase tracking-widest font-semibold mb-2"
                style={{ color: "hsl(145, 55%, 38%)" }}
              >
                {lifeCase.emoji} {lifeCase.label}
              </p>
              <p
                className="font-display text-lg md:text-xl"
                style={{ color: "hsl(45, 95%, 45%)" }}
              >
                Choisis une case — laisse ta main être guidée.
              </p>
            </div>
            <div className="overflow-x-auto">
              <div
                className="grid gap-[2px] min-w-[400px]"
                style={{ gridTemplateColumns: `repeat(16, 1fr)` }}
              >
                {shuffledY.map((_, row) =>
                  shuffledX.map((_, col) => (
                    <motion.button
                      key={`${row}-${col}`}
                      onClick={() => handleCellClick(row, col)}
                      className="aspect-square rounded-[3px] transition-all duration-200 cursor-pointer bg-[hsl(40,20%,96%)] hover:bg-[hsl(40,15%,92%)]"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      aria-label={`Case ${row + 1}-${col + 1}`}
                    />
                  ))
                )}
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setPhase("case")}
                className="text-xs underline"
                style={{ color: "hsl(30, 8%, 45%)" }}
              >
                ← Revenir à la situation
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3 — Revealed sign */}
        {phase === "revealed" && revealed && (
          <motion.div
            key={`revealed-${revealed.row}-${revealed.col}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative p-6 md:p-8 rounded-2xl border bg-[hsl(0,0%,100%)]"
            style={{ borderColor: "hsl(145, 55%, 38%)" }}
          >
            <button
              onClick={closeRevealed}
              aria-label="Fermer"
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: "hsl(40, 20%, 96%)",
                color: "hsl(358, 75%, 52%)",
                border: "1px solid hsl(358, 75%, 52% / 0.3)",
              }}
            >
              <X size={18} />
            </button>

            {/* Collapsible case reminder at top */}
            <div className="mb-6 mr-12">
              <button
                onClick={() => setCaseOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl transition-all hover:opacity-90"
                style={{ background: "hsl(40, 20%, 96%)" }}
                aria-expanded={caseOpen}
              >
                <span className="flex items-center gap-2 text-left">
                  <span className="text-base">{lifeCase.emoji}</span>
                  <span
                    className="text-[10px] uppercase tracking-widest font-semibold"
                    style={{ color: "hsl(145, 55%, 38%)" }}
                  >
                    Rappel du cas
                  </span>
                  <span className="text-xs font-display truncate" style={{ color: "hsl(45, 95%, 45%)" }}>
                    — {lifeCase.label}
                  </span>
                </span>
                {caseOpen ? (
                  <ChevronUp size={16} style={{ color: "hsl(30, 8%, 45%)" }} />
                ) : (
                  <ChevronDown size={16} style={{ color: "hsl(30, 8%, 45%)" }} />
                )}
              </button>
              <AnimatePresence initial={false}>
                {caseOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-sm font-display mb-2" style={{ color: "hsl(45, 95%, 45%)" }}>
                        {lifeCase.situation}
                      </p>
                      <p className="text-xs leading-relaxed mb-1.5" style={{ color: "hsl(30, 8%, 30%)" }}>
                        {lifeCase.narrative[0]}
                      </p>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "hsl(30, 8%, 30%)" }}>
                        {lifeCase.narrative[1]}
                      </p>
                      <div className="mt-3 mb-2">
                        <p
                          className="text-[10px] uppercase tracking-widest font-semibold mb-1.5"
                          style={{ color: "hsl(145, 55%, 38%)" }}
                        >
                          Les 4 propositions et ton intuition initiale
                        </p>
                        <ul className="space-y-1">
                          {lifeCase.options.map((opt, i) => {
                            const isPicked = intuitiveChoice === i;
                            return (
                              <li
                                key={i}
                                className="text-xs leading-relaxed flex gap-2"
                                style={{
                                  color: isPicked ? "hsl(145, 55%, 38%)" : "hsl(30, 8%, 35%)",
                                  fontWeight: isPicked ? 700 : 400,
                                }}
                              >
                                <span style={{ color: "hsl(45, 95%, 45%)" }}>
                                  {String.fromCharCode(65 + i)}.
                                </span>
                                <span>{opt}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-display text-3xl md:text-4xl text-center mb-8"
              style={{ color: "hsl(45, 95%, 45%)" }}
            >
              {revealed.signX.name}-{revealed.signY.name}
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="flex flex-col items-center justify-center"
              >
                <DotIdeogram
                  leftCode={revealed.signX.code}
                  rightCode={revealed.signY.code}
                  size={220}
                  color="hsl(30, 30%, 12%)"
                />
                <p
                  className="text-xs mt-4 tracking-widest uppercase"
                  style={{ color: "hsl(30, 8%, 50%)" }}
                >
                  {revealed.signX.value} × {revealed.signY.value}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <SignDisplay
                  signXIdx={revealed.signX.index}
                  signYIdx={revealed.signY.index}
                  signXName={revealed.signX.name}
                  signYName={revealed.signY.name}
                  dynamicWord={revealed.dynamicWord}
                />
              </motion.div>
            </div>

            {/* Values formula */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="my-8 flex items-center gap-4"
            >
              <div className="flex-1 h-px" style={{ background: "hsl(145, 55%, 38% / 0.25)" }} />
              <div className="text-center px-3">
                <p
                  className="text-[10px] uppercase tracking-widest mb-1.5 font-semibold"
                  style={{ color: "hsl(30, 8%, 45%)" }}
                >
                  Résonances à explorer
                </p>
                <p className="font-display text-base md:text-lg flex items-center justify-center gap-2 flex-wrap">
                  <span style={{ color: "hsl(145, 55%, 38%)" }}>{revealed.axisYWord}</span>
                  <span style={{ color: "hsl(30, 8%, 45%)" }}>×</span>
                  <span style={{ color: "hsl(45, 95%, 45%)" }}>{revealed.axisXWord}</span>
                  <span style={{ color: "hsl(30, 8%, 45%)" }}>=</span>
                  <span style={{ color: "hsl(358, 75%, 52%)" }}>{revealed.dynamicWord}</span>
                </p>
              </div>
              <div className="flex-1 h-px" style={{ background: "hsl(145, 55%, 38% / 0.25)" }} />
            </motion.div>

            {/* (Case reminder moved to top of panel) */}

            {/* Final choice + Audio interpretation — 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* LEFT — Final choice among the 4 options */}
              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: "hsl(145, 55%, 38%)", background: "hsl(0, 0%, 100%)" }}
              >
                <p
                  className="text-xs uppercase tracking-widest font-semibold"
                  style={{ color: "hsl(145, 55%, 38%)" }}
                >
                  Ton choix définitif
                </p>
                <p className="text-xs mt-0.5 mb-3" style={{ color: "hsl(30, 8%, 45%)" }}>
                  À la lumière de ce signe, quelle voie choisis-tu ?
                </p>
                <div className="flex flex-col gap-2">
                  {lifeCase.options.map((opt, i) => {
                    const isFinal = finalChoice === i;
                    const wasIntuition = intuitiveChoice === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setFinalChoice(i)}
                        className="text-left px-3 py-2 rounded-xl text-xs font-medium transition-all border-2 flex gap-2 items-start"
                        style={{
                          borderColor: isFinal
                            ? "hsl(145, 55%, 38%)"
                            : "hsl(145, 55%, 38% / 0.25)",
                          background: isFinal ? "hsl(145, 55%, 38% / 0.12)" : "hsl(0, 0%, 100%)",
                          color: isFinal ? "hsl(145, 55%, 38%)" : "hsl(30, 8%, 35%)",
                          fontWeight: isFinal ? 700 : 400,
                        }}
                      >
                        <span style={{ color: "hsl(45, 95%, 45%)", fontWeight: 700 }}>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                        {wasIntuition && (
                          <span
                            className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded"
                            style={{
                              background: "hsl(45, 95%, 45% / 0.15)",
                              color: "hsl(45, 95%, 45%)",
                            }}
                          >
                            intuition
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT — Audio recorder */}
              <AudioRecorder />
            </motion.div>

            {/* Restart */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={restart}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: "hsl(145, 55%, 38%)",
                  color: "hsl(0, 0%, 100%)",
                }}
              >
                <RotateCcw size={14} /> Nouveau cas
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SandMatrix;
