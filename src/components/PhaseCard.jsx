"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "@heroicons/react/24/solid";
import WorkPackageCard from "./WorkPackageCard";
import AddWorkPackagePage from "./addWorkPackage";
import { fetchSubtasks } from "@/redux/subTask/SubTaskSlice";

export default function PhaseCard({
  phase,
  onDeleteWorkPackage,
  onEditWorkPackage,
  onAddWorkPackage,
  assignedUserIds = [],
  taskId,
}) {
  const [isAddWorkPackageOpen, setIsAddWorkPackageOpen] = useState(false);
  const dispatch = useDispatch();

  // Redux state with correct path for subtasks from SubtaskSlice
  const subtasksData = useSelector(
    (state) => state.subtasks.subtasks?.[taskId] ?? []
  );
  const loading = useSelector((state) => state.subtasks.loading);
  const error = useSelector((state) => state.subtasks.error);

  const subtasks = Array.isArray(subtasksData) ? subtasksData : [];

  // Fetch subtasks on mount
  useEffect(() => {
    if (taskId) {
      dispatch(fetchSubtasks(taskId));
    }
  }, [taskId, dispatch]);

  // Toggle Add Work Package popup
  const toggleAddWorkPackagePopup = () => {
    setIsAddWorkPackageOpen((prev) => !prev);
  };

  // Handle work package creation
  const handleAddWorkPackage = async (newWorkPackage) => {
    try {
      if (onAddWorkPackage) {
        await onAddWorkPackage(phase?.id, newWorkPackage); 
      }
      setIsAddWorkPackageOpen(false);
      await dispatch(fetchSubtasks(taskId));
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
            <PlusIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sub Tasks</h3>
            <p className="text-gray-600 text-sm">
              {subtasks.length}{" "}
              {subtasks.length === 1 ? "subtask" : "subtasks"} in this phase
            </p>
          </div>
        </div>
        <button
          onClick={toggleAddWorkPackagePopup}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Subtask
        </button>
      </div>

      {/* Subtasks List */}
      {loading ? (
        <div className="bg-gray-50 rounded-lg p-5 text-center border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">Loading subtasks...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-500 p-4 rounded-md text-center">
          <p>Error: {error}</p>
        </div>
      ) : subtasks.length > 0 ? (
        <div className="space-y-3">
          {subtasks.map((pkg, index) => (
            <WorkPackageCard
              key={pkg?.id || `${phase?.id}-pkg-${index}`}
              pkg={pkg}
              phaseId={phase?.id}
              onDeleteWorkPackage={onDeleteWorkPackage}
              onEditWorkPackage={onEditWorkPackage}
              loading={loading} // Pass loading state to WorkPackageCard
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-5 text-center border border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">No subtasks yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Add a subtask to get started
          </p>
        </div>
      )}

      {/* Add Subtask Popup */}
      {isAddWorkPackageOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-6xl xl:max-w-7xl max-h-[95vh] bg-white shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create Subtask</h2>
                    <p className="text-blue-100 text-sm">Add a new subtask to this phase</p>
                  </div>
                </div>
                <button
                  onClick={toggleAddWorkPackagePopup}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
              <AddWorkPackagePage
                onCancel={toggleAddWorkPackagePopup}
                onWorkPackageAdd={handleAddWorkPackage}
                phaseId={phase?.id}
                phaseWorkers={phase?.workers || []}
                assignedUserIds={assignedUserIds || []}
                taskId={taskId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}