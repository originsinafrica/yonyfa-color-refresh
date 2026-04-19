import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import SandMatrix from "@/components/sagesses/SandMatrix";
import SynchronicityWall from "@/components/sagesses/SynchronicityWall";

export const Route = createFileRoute("/sagesses")({
  head: () => ({
    meta: [
      { title: "Les Sagesses — YonyFâ" },
      {
        name: "description",
        content:
          "Matrice des choix et Mur des consultations — explorez les voix du Bénin à travers les 16 signes mères du Fâ.",
      },
      { property: "og:title", content: "Les Sagesses — YonyFâ" },
      {
        property: "og:description",
        content:
          "Matrice de Sable et Mur de Synchronicité — explorez les voix du Bénin à travers les 16 signes mères du Fâ.",
      },
    ],
  }),
  component: SagessesPage,
});

type Tab = "matrice" | "mur";

function SagessesPage() {
  const [tab, setTab] = useState<Tab>("matrice");
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main content */}
      <main className="pt-10 pb-16 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Intro */}
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4 text-foreground">
              {tab === "matrice" ? "Matrice des choix" : "Mur des consultations"}
            </h2>
            <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed text-muted-foreground">
              {tab === "matrice"
                ? "Tirez dans la matrice pour révéler un signe combiné du Fâ. Chaque case mêle deux des 16 signes mères, ouvrant une dynamique unique à explorer."
                : "Un mur vivant de sagesses partagées. Laissez un visage vous appeler."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 rounded-full bg-muted border border-border">
              {(
                [
                  { id: "matrice" as Tab, label: "Matrice des choix" },
                  { id: "mur" as Tab, label: "Mur des consultations" },
                ]
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative px-5 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-full transition-all"
                  style={{
                    color:
                      tab === t.id
                        ? "hsl(var(--background))"
                        : "hsl(var(--muted-foreground))",
                    background:
                      tab === t.id ? "hsl(var(--foreground))" : "transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {tab === "matrice" ? <SandMatrix /> : <SynchronicityWall />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
