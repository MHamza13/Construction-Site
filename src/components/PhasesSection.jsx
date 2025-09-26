"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  createSubtask,
  deleteSubtask,
  fetchSubtasks,
  updateSubtask,
  fetchSubtaskById,
} from "@/redux/subTask/SubTaskSlice";
import AddWorkPackagePage from "./addWorkPackage";
import PhaseCard from "@/components/PhaseCard";

const PhasesSection = ({ taskId, assignedUserIds, initialPhases = [] }) => {
  const dispatch = useDispatch();
  const [phases, setPhases] = useState(initialPhases);
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedSubtask, setSelectedSubtask] = useState(null); // For editing
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"

  // Get subtasks from Redux store
  const { loading, error, subtasks } = useSelector((state) => state.subtasks);

  // Fetch subtasks on component mount
  useEffect(() => {
    if (taskId) {
      console.log("Fetching subtasks for taskId:", taskId);
      dispatch(fetchSubtasks(taskId));
    }
  }, [dispatch, taskId]);

  // Update phases with fetched subtasks
  useEffect(() => {
    const subtaskList = Array.isArray(subtasks[taskId]) ? subtasks[taskId] : [];
    console.log("Subtasks received:", subtaskList);
    setPhases((prev) =>
      prev.map((phase) => ({
        ...phase,
        workPackages:
          subtaskList.filter((subtask) => subtask.phaseId === phase.id) || [],
      }))
    );
  }, [subtasks, taskId]);

  const toggleAddPhasePopup = (
    phase = null,
    subtask = null,
    mode = "create"
  ) => {
    setSelectedPhase(phase);
    setSelectedSubtask(subtask);
    setModalMode(mode);
    setIsAddPhaseOpen(!isAddPhaseOpen);
  };

  // Handle work package submit (create or update)
  const handleSubmitWorkPackage = async (subtaskData) => {
    try {
      if (!subtaskData || !taskId) {
        throw new Error("Missing required data");
      }

      const payload = {
        ...subtaskData,
        parentTaskId: taskId,
        phaseId: selectedPhase?.id,
      };

      console.log("Submitting subtask with payload:", payload);

      let result;
      if (modalMode === "edit" && selectedSubtask?.id) {
        // Update existing subtask
        result = await dispatch(
          updateSubtask({ subTaskId: selectedSubtask.id, subtaskData: payload })
        ).unwrap();
        console.log("Update subtask response:", result);
        Swal.fire("Success!", "Work package updated successfully.", "success");
      } else {
        // Create new subtask
        result = await dispatch(
          createSubtask({ taskId, subtaskData: payload })
        ).unwrap();
        console.log("Create subtask response:", result);
        Swal.fire("Success!", "Work package created successfully.", "success");
      }

      // Refresh subtasks
      await dispatch(fetchSubtasks(taskId));

      setIsAddPhaseOpen(false);
      setSelectedSubtask(null);
      setModalMode("create");
    } catch (err) {
      console.error("Subtask error:", err);
      Swal.fire(
        "Error",
        `Failed to ${
          modalMode === "edit" ? "update" : "create"
        } work package: ${
          typeof err === "string" ? err : err.message || "An error occurred"
        }`,
        "error"
      );
    }
  };

  // Delete Phase
  const handleDeletePhase = async (phaseId) => {
    const result = await Swal.fire({
      title: "Delete this phase?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setPhases((prev) => prev.filter((p) => p.id !== phaseId));
      Swal.fire("Deleted!", "Phase has been deleted.", "success");
    }
  };

  // Delete Work Package
  const handleDeleteWorkPackage = async (phaseId, pkgId) => {
    const result = await Swal.fire({
      title: "Delete this work package?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await dispatch(deleteSubtask({ subTaskId: pkgId })).unwrap();
          await dispatch(fetchSubtasks(taskId));

          // Update local state
          setPhases((prev) =>
            prev.map((phase) =>
              phase.id === phaseId
                ? {
                    ...phase,
                    workPackages: phase.workPackages.filter(
                      (p) => p.id !== pkgId
                    ),
                  }
                : phase
            )
          );

          return true;
        } catch (err) {
          Swal.showValidationMessage(
            `Error: ${
              typeof err === "string"
                ? err
                : err.message || "Failed to delete work package"
            }`
          );
          return false;
        }
      },
    });

    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Work package has been deleted.", "success");
    }
  };

  const handleEditPhase = (phase) => {
    console.log("Editing phase:", phase);
  };

  const handleEditWorkPackage = async (phaseId, pkg) => {
    try {
      // Fetch subtask details by ID
      const result = await dispatch(fetchSubtaskById(pkg.id)).unwrap();
      console.log("Fetched subtask for editing:", result);
      toggleAddPhasePopup(
        phases.find((p) => p.id === phaseId),
        result,
        "edit"
      );
    } catch (err) {
      console.error("Error fetching subtask:", err);
      Swal.fire(
        "Error",
        `Failed to load subtask: ${
          typeof err === "string" ? err : err.message || "An error occurred"
        }`,
        "error"
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <div className="max-w-6xl mx-auto">
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
                assignedUserIds={assignedUserIds || []}
                taskId={taskId}
                onAddWorkPackage={() => toggleAddPhasePopup(phase)}
                subtasks={subtasks[taskId] || []}
                loading={loading}
                error={error}
                onSubmitWorkPackage={handleSubmitWorkPackage}
              />
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Work Package Popup */}
      {isAddPhaseOpen && selectedPhase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-6xl xl:max-w-7xl max-h-[95vh] bg-white shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {modalMode === "edit" ? "Edit Subtask" : "Create Subtask"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {modalMode === "edit"
                        ? "Update the subtask details"
                        : "Add a new subtask to this phase"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddPhaseOpen(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
              <AddWorkPackagePage
                onCancel={() => setIsAddPhaseOpen(false)}
                taskId={taskId}
                assignedUserIds={assignedUserIds}
                onSubmitWorkPackage={handleSubmitWorkPackage}
                subtask={selectedSubtask}
                mode={modalMode}
                phaseId={selectedPhase.id}
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          Error:{" "}
          {typeof error === "string"
            ? error
            : error.message || "An error occurred"}
        </div>
      )}
    </div>
  );
};

export default PhasesSection;
