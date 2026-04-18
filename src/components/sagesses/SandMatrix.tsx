import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SIGNS, shuffle, valueToMatrixIndex, type FongbeSign } from "@/data/fongbe";
import { DYNAMICS_MATRIX } from "@/data/dynamics";
import { pickRandomCase, type LifeCase } from "@/data/cases";
import CombinedTrace from "./CombinedTrace";
import CaseQCM from "./CaseQCM";
import SignDisplay from "./SignDisplay";

interface RevealedCell {
  row: number;
  col: number;
  signX: FongbeSign;
  signY: FongbeSign;
  dynamicWord: string;
  lifeCase: LifeCase;
}

const SandMatrix = () => {
  const [shuffledX, setShuffledX] = useState(() => shuffle(SIGNS));
  const [shuffledY, setShuffledY] = useState(() => shuffle(SIGNS));
  const [revealed, setRevealed] = useState<RevealedCell | null>(null);
  const [qcmDone, setQcmDone] = useState(false);

  const reshuffle = useCallback(() => {
    setShuffledX(shuffle(SIGNS));
    setShuffledY(shuffle(SIGNS));
    setRevealed(null);
    setQcmDone(false);
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    const signX = shuffledX[col];
    const signY = shuffledY[row];
    const matrixRow = signY.valueIndex;
    const matrixCol = valueToMatrixIndex(signX.value);
    const dynamicWord = DYNAMICS_MATRIX[matrixRow]?.[matrixCol] ?? "";
    setRevealed({ row, col, signX, signY, dynamicWord, lifeCase: pickRandomCase() });
    setQcmDone(false);
  }, [shuffledX, shuffledY]);

  const handleQcmComplete = useCallback(() => {
    setQcmDone(true);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Reveal panel */}
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.div
            key={`${revealed.row}-${revealed.col}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-8 p-6 rounded-2xl border border-[hsl(145,55%,38%)] bg-[hsl(0,0%,100%)]"
          >
            {/* Two-column layout: sign | description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
              {/* LEFT — Sign: name + ideogram */}
              <div className="flex flex-col items-center justify-center text-center md:py-4">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-display text-3xl md:text-4xl mb-6"
                  style={{ color: "hsl(45, 95%, 45%)" }}
                >
                  {revealed.signX.name}-{revealed.signY.name}
                </motion.h3>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="flex justify-center"
                >
                  <CombinedTrace
                    leftCode={revealed.signX.code}
                    rightCode={revealed.signY.code}
                    size={180}
                    color="hsl(45, 95%, 45%)"
                  />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm mt-5"
                  style={{ color: "hsl(30, 8%, 50%)" }}
                >
                  {revealed.signX.value} × {revealed.signY.value}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="font-display text-xl md:text-2xl mt-2"
                  style={{ color: "hsl(145, 55%, 38%)" }}
                >
                  {revealed.dynamicWord}
                </motion.p>
              </div>

              {/* RIGHT — Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-left"
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

            {/* QCM */}
            {!qcmDone && (
              <CaseQCM
                lifeCase={revealed.lifeCase}
                dynamicWord={revealed.dynamicWord}
                onComplete={handleQcmComplete}
              />
            )}

            {qcmDone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6"
              >
                <button
                  onClick={reshuffle}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "hsl(145, 55%, 38%)",
                    color: "hsl(30, 30%, 12%)",
                  }}
                >
                  Nouveau tirage
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Grid - hidden once a cell is revealed */}
      {!revealed && (
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
      )}

    </div>
  );
};

export default SandMatrix;
