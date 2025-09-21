// src/app/phases/page.jsx
"use client";
import { useState } from "react";
import PhasesSection from "@/components/PhasesSection";

export default function PhasesPage() {
  const [phases, setPhases] = useState([]);

  // 🔹 Delete a phase
  const handleDeletePhase = (id) => {
    setPhases((prev) => prev.filter((phase) => phase.id !== id));
  };

  // 🔹 Edit a phase
  const handleEditPhase = (updatedPhase) => {
    setPhases((prev) =>
      prev.map((phase) => (phase.id === updatedPhase.id ? updatedPhase : phase))
    );
  };

  // 🔹 Delete a work package
  const handleDeleteWorkPackage = (phaseId, pkgId) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              workPackages: phase.workPackages.filter((pkg) => pkg.id !== pkgId),
            }
          : phase
      )
    );
  };

  // 🔹 Edit a work package
  const handleEditWorkPackage = (phaseId, updatedPkg) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              workPackages: phase.workPackages.map((pkg) =>
                pkg.id === updatedPkg.id ? updatedPkg : pkg
              ),
            }
          : phase
      )
    );
  };

  return (
    <div className="p-6">
      <PhasesSection
        initialPhases={phases}
        onDeletePhase={handleDeletePhase}
        onEditPhase={handleEditPhase}
        onDeleteWorkPackage={handleDeleteWorkPackage}
        onEditWorkPackage={handleEditWorkPackage}
      />
    </div>
  );
}
