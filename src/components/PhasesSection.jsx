"use client";
import { useState } from "react";
import PhaseCard from "@/components/PhaseCard";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa";
import { PlusIcon } from "lucide-react";
import AddWorkPackagePage from "./addWorkPackage";

// Trash icon component
const TrashIcon = ({ className = "h-5 w-5 text-red-500" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4a1 1 0 011-1h2a1 1 0 011 1v3"
    />
  </svg>
);

export default function PhasesSection({
  assignedUserIds = [],
  initialPhases = [],
  taskId,
}) {
  const [phases, setPhases] = useState(initialPhases);
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null); // for passing phase to popup

  const toggleAddPhasePopup = (phase = null) => {
    setSelectedPhase(phase);
    setIsAddPhaseOpen(!isAddPhaseOpen);
  };

  const handleAddPhase = (newPhase) => {
    setPhases([...phases, newPhase]);
    setIsAddPhaseOpen(false);
  };

  const handleDeletePhase = async (phaseId) => {
    const result = await Swal.fire({
      title: "Delete this phase?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setPhases((prev) => prev.filter((p) => p.id !== phaseId));
      Swal.fire("Deleted!", "Phase has been deleted.", "success");
    }
  };

  const handleDeleteWorkPackage = async (phaseId, pkgId) => {
    const result = await Swal.fire({
      title: "Delete this work package?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setPhases((prev) =>
        prev.map((phase) =>
          phase.id === phaseId
            ? {
                ...phase,
                workPackages: phase.workPackages.filter((p) => p.id !== pkgId),
              }
            : phase
        )
      );
      Swal.fire("Deleted!", "Work package has been deleted.", "success");
    }
  };

  const handleEditPhase = (phase) => {
    console.log("Editing phase:", phase);
  };

  const handleEditWorkPackage = (phaseId, pkg) => {
    console.log("Editing package:", pkg, "in phase:", phaseId);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="max-w-6xl mx-auto">
        {/* Phases List */}
        <div className="space-y-6">
          {phases.length === 0 ? (
            <div className="bg-white rounded-md shadow-md border border-gray-200 p-10 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No phases yet
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first construction phase
              </p>
              <button
                onClick={() => toggleAddPhasePopup(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition cursor-pointer"
              >
                Create First Phase
              </button>
            </div>
          ) : (
            phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                onDeletePhase={handleDeletePhase}
                onEditPhase={handleEditPhase}
                onDeleteWorkPackage={handleDeleteWorkPackage}
                onEditWorkPackage={handleEditWorkPackage}
                TrashIcon={TrashIcon}
                assignedUserIds={assignedUserIds || []}
                taskId={taskId}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Work Package Popup */}
      {isAddPhaseOpen && selectedPhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setIsAddPhaseOpen(false)}
          ></div>

          {/* Popup */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-3xl font-bold text-gray-800">
                Create Work Package
              </h3>
              <button
                onClick={() => setIsAddPhaseOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* AddWorkPackagePage Component */}
            <AddWorkPackagePage
              onCancel={() => setIsAddPhaseOpen(false)}
              onWorkPackageAdd={handleAddPhase}
              phaseId={selectedPhase.id}
              phaseWorkers={selectedPhase.workers}
            />
          </div>
        </div>
      )}
    </div>
  );
}
