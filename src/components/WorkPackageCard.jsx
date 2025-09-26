"use client";
import { useSelector } from "react-redux";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function WorkPackageCard({
  pkg,
  phaseId,
  onDeleteWorkPackage,
  onEditWorkPackage,
  loading,
}) {
  // Fetch workers from Redux store
  const workers = useSelector((state) => state.workers?.items ?? []);

  // Map status values from API -> UI badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "InProgress":
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "NotStarted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper to get worker name by ID
  const getWorkerName = (workerId) => {
    const worker = workers.find(
      (w) =>
        w.id === workerId ||
        w.userId === workerId ||
        w.user?.id === workerId ||
        w.employeeId === workerId
    );
    return worker
      ? [worker.firstName, worker.lastName].filter(Boolean).join(" ").trim() ||
          "Unnamed Worker"
      : `Worker #${workerId}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-lg truncate">
            {pkg.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {pkg.description}
          </p>
        </div>
        <div className="flex gap-2 ml-3 flex-shrink-0">
          <button
            onClick={() => onEditWorkPackage(phaseId, pkg)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            aria-label="Edit work package"
            disabled={loading}
          >
            <PencilIcon className="h-5 w-5 text-blue-600" />
          </button>
          <button
            onClick={() => onDeleteWorkPackage(phaseId, pkg.id)}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            aria-label="Delete work package"
            disabled={loading}
          >
            <XMarkIcon className="h-5 w-5 text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadge(
            pkg.status
          )}`}
        >
          {pkg.status}
        </span>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            pkg.priority === "High"
              ? "bg-red-100 text-red-800"
              : pkg.priority === "Medium"
              ? "bg-orange-100 text-orange-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {pkg.priority} Priority
        </span>
        {pkg.dueDate && (
          <span className="flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {new Date(pkg.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {pkg.workerAssignIds && pkg.workerAssignIds.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">
            ASSIGNED WORKERS
          </p>
          <div className="flex flex-wrap gap-2">
            {pkg.workerAssignIds.map((workerId, idx) => (
              <span
                key={`${pkg.id}-worker-${idx}`}
                className="px-3 py-1.5 bg-indigo-50 rounded-full text-xs font-medium text-indigo-700 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {getWorkerName(workerId)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
