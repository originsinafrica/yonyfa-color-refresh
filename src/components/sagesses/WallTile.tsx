import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { PROFILE_PHOTOS } from "@/assets/profiles";
import type { Consultation } from "@/data/consultations";

interface Props {
  consultation: Consultation;
  index: number;
  onClick: (c: Consultation) => void;
}

// Subtle Benin accent rotation — used very sparingly (only on hover ring)
const BENIN_ACCENTS = [
  "hsl(var(--benin-green))",
  "hsl(var(--benin-yellow))",
  "hsl(var(--benin-red))",
];

const WallTile = memo(({ consultation, index, onClick }: Props) => {
  const tileRef = useRef<HTMLButtonElement>(null);

  // Pick a profile photo deterministically from the seed
  const photo = PROFILE_PHOTOS[consultation.videoSeed % PROFILE_PHOTOS.length];
  const accent = BENIN_ACCENTS[index % BENIN_ACCENTS.length];

  // Subtle organic floating per tile
  const driftDelay = (index % 7) * 0.35;
  const driftDuration = 7 + (index % 5);

  // Tiny "breath" on photos to simulate liveness
  const breathDelay = (index % 9) * 0.4;
  const breathDuration = 5 + (index % 4);

  useEffect(() => {
    // No-op; animation handled by framer-motion
  }, []);

  return (
    <motion.button
      ref={tileRef}
      onClick={() => onClick(consultation)}
      className="relative aspect-square overflow-hidden rounded-[4px] cursor-pointer group bg-muted"
      animate={{
        y: [0, -1.5, 0, 1.5, 0],
        opacity: [0.92, 1, 0.92],
      }}
      transition={{
        duration: driftDuration,
        delay: driftDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.35, zIndex: 20, opacity: 1 }}
      style={{
        boxShadow: "inset 0 0 0 1px hsl(var(--border))",
      }}
      aria-label={`Consultation de ${consultation.author}`}
    >
      {/* Profile photo with gentle breathing zoom for "liveness" */}
      <motion.img
        src={photo}
        alt=""
        loading="lazy"
        width={512}
        height={512}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{
          duration: breathDuration,
          delay: breathDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Soft warm wash for visual cohesion (very subtle) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-30"
        style={{
          background: "linear-gradient(135deg, hsl(0, 0%, 100%) 0%, transparent 60%)",
        }}
      />

      {/* Hover: thin Benin accent ring */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[4px]"
        style={{ boxShadow: `inset 0 0 0 2px ${accent}` }}
      />
    </motion.button>
  );
});

WallTile.displayName = "WallTile";
export default WallTile;
