import { useState } from "react";
import { motion } from "framer-motion";
import { CONSULTATIONS, type Consultation } from "@/data/consultations";
import WallTile from "./WallTile";
import ConsultationModal from "./ConsultationModal";

const SynchronicityWall = () => {
  const [selected, setSelected] = useState<Consultation | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="overflow-x-auto">
          <div
            className="grid gap-[3px] mx-auto p-2 rounded-xl bg-card"
            style={{
              gridTemplateColumns: "repeat(16, 1fr)",
              maxWidth: "min(900px, 100%)",
              boxShadow: "0 1px 0 hsl(var(--border)), 0 12px 40px -20px hsl(30 10% 15% / 0.15)",
            }}
          >
            {CONSULTATIONS.map((c, i) => (
              <WallTile
                key={c.id}
                consultation={c}
                index={i}
                onClick={setSelected}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <ConsultationModal consultation={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default SynchronicityWall;
