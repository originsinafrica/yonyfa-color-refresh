import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import CombinedTrace from "./CombinedTrace";
import SignDisplay from "./SignDisplay";
import { PROFILE_PHOTOS } from "@/assets/profiles";
import { computeGlobalScore, type Consultation } from "@/data/consultations";

interface Props {
  consultation: Consultation | null;
  onClose: () => void;
}

const ConsultationModal = ({ consultation, onClose }: Props) => {
  const [resonance, setResonance] = useState([50]);
  const [relevance, setRelevance] = useState([50]);
  const [clarity, setClarity] = useState([50]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setResonance([50]);
      setRelevance([50]);
      setClarity([50]);
      onClose();
    }, 1800);
  };

  const photo = consultation
    ? PROFILE_PHOTOS[consultation.videoSeed % PROFILE_PHOTOS.length]
    : null;

  return (
    <AnimatePresence>
      {consultation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-foreground/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border p-6 md:p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-muted text-muted-foreground"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            {/* Profile + community scores side by side */}
            <div className="flex gap-4 mb-5">
              {/* Photo: half width */}
              <div className="relative w-1/2 aspect-[4/3] rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {photo && (
                  <motion.img
                    src={photo}
                    alt={consultation.author}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.05 }}
                    animate={{ scale: [1.05, 1.08, 1.05] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-md bg-background/80 flex items-center justify-center shadow-md">
                  <Play size={12} className="text-foreground ml-0.5" fill="currentColor" />
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full backdrop-blur-md bg-background/85 shadow-sm">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "hsl(var(--benin-green))" }}
                  />
                  <span className="text-[11px] font-medium text-foreground">
                    {consultation.author}
                  </span>
                </div>
              </div>

              {/* Community scores: right of photo */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Score communauté
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-2xl text-foreground">
                      {computeGlobalScore(consultation.scores)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      ({consultation.scores.count} avis)
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-1.5 mt-2">
                  {[
                    { label: "Résonance", value: consultation.scores.resonance, color: "hsl(var(--benin-green))" },
                    { label: "Pertinence", value: consultation.scores.relevance, color: "hsl(var(--benin-yellow))" },
                    { label: "Clarté", value: consultation.scores.clarity, color: "hsl(var(--benin-red))" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 bg-background border border-border"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                          {s.label}
                        </div>
                      </div>
                      <div className="font-display text-sm" style={{ color: s.color }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sign + value */}
            <div className="flex items-center gap-4 mb-5">
              <CombinedTrace
                leftCode={consultation.signX.code}
                rightCode={consultation.signY.code}
                size={56}
                color="hsl(var(--foreground))"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-xl truncate text-foreground">
                  {consultation.signX.name}-{consultation.signY.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {consultation.signX.value} × {consultation.signY.value}
                </p>
                <p className="font-display text-base mt-1 text-accent">
                  {consultation.dynamicWord}
                </p>
              </div>
            </div>

            {/* Authentic Fa sign + reformulated meaning */}
            <div className="mb-5">
              <SignDisplay
                signXIdx={consultation.signX.index}
                signYIdx={consultation.signY.index}
                signXName={consultation.signX.name}
                signYName={consultation.signY.name}
                dynamicWord={consultation.dynamicWord}
              />
            </div>

            {/* Case + answer */}
            <div className="rounded-xl p-4 mb-5 bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                <span className="text-lg">{consultation.lifeCase.emoji}</span>
                <span>{consultation.lifeCase.label}</span>
              </div>
              <p className="text-sm italic mb-3 text-foreground/70">
                « {consultation.lifeCase.situation} »
              </p>
              <div className="text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">
                Réponse choisie
              </div>
              <p className="text-sm mb-3 font-medium text-foreground">
                {String.fromCharCode(65 + consultation.selectedOption)}.{" "}
                {consultation.lifeCase.options[consultation.selectedOption]}
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">
                {consultation.reflection}
              </p>
            </div>

            {/* Evaluation */}
            {!submitted ? (
              <div className="space-y-5 pt-5 border-t border-border">
                <p className="text-xs uppercase tracking-widest text-center text-muted-foreground">
                  Votre évaluation
                </p>

                {[
                  { label: "Résonance", question: "Cette réponse résonne-t-elle en vous ?", value: resonance, set: setResonance, color: "hsl(var(--benin-green))" },
                  { label: "Pertinence", question: "Le conseil est-il adapté à la situation ?", value: relevance, set: setRelevance, color: "hsl(var(--benin-yellow))" },
                  { label: "Clarté", question: "Le message est-il clair et bien exprimé ?", value: clarity, set: setClarity, color: "hsl(var(--benin-red))" },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full self-center" style={{ background: c.color }} />
                        <span className="text-sm font-medium text-foreground">{c.label}</span>
                        <span className="text-xs italic text-muted-foreground hidden sm:inline">
                          {c.question}
                        </span>
                      </div>
                      <span className="font-display text-lg text-foreground">
                        {c.value[0]}
                      </span>
                    </div>
                    <Slider
                      value={c.value}
                      onValueChange={c.set}
                      max={100}
                      step={1}
                      style={{ ["--slider-track" as string]: c.color }}
                    />
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-full text-sm font-semibold transition-all bg-foreground text-background hover:opacity-90"
                >
                  Transmettre mon évaluation
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <p className="font-display text-lg text-foreground">
                  ✦ Votre regard a été reçu.
                </p>
                <p className="text-xs mt-2 italic text-muted-foreground">
                  Chaque évaluation nourrit le discernement collectif.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;
