"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  Clock,
  User,
  UserCheck,
  HardHat,
} from "lucide-react";
import profileFallback from "@/assets/profilebgRemove.png";
import AssignWorkerPage from "./assignWorkerPage";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";

export default function AssignedWorkers({ assignedUserIds = [], task }) {
  const [isAssignWorkerOpen, setIsAssignWorkerOpen] = useState(false);
  const dispatch = useDispatch();

  const allWorkers = useSelector((state) => state.workers?.items ?? []);
  const loading = useSelector((state) => state.workers?.loading);
  const error = useSelector((state) => state.workers?.error);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const getWorkerId = (w) =>
    w?.id ?? w?.userId ?? w?.user?.id ?? w?.employeeId ?? null;

  const assignedIdsSet = useMemo(
    () => new Set((assignedUserIds ?? []).map((id) => String(id))),
    [assignedUserIds]
  );

  const assignedWorkers = (allWorkers || []).filter((w) => {
    const wid = getWorkerId(w);
    if (wid === null || wid === undefined) return false;
    return assignedIdsSet.has(String(wid));
  });

  // Display helpers updated for user data
  const displayName = (w) =>
    [w?.firstName, w?.lastName].filter(Boolean).join(" ").trim() || "Unnamed";

  const displayRole = (w) => w?.specializationName || "Worker"; // Use specializationName as role

  const displayHours = (w) => w?.hours ?? w?.loggedHours ?? w?.totalHours ?? 0;

  const displayEfficiency = (w) =>
    w?.efficiency ?? w?.efficiencyPercentage ?? null;

  const getRoleIcon = (role = "") => {
    const r = String(role);
    if (/supervisor|manager|lead/i.test(r)) {
      return <UserCheck className="w-3 h-3 text-blue-600" />;
    }
    return <HardHat className="w-3 h-3 text-gray-600" />;
  };

  const getRoleColor = (role = "") => {
    const r = String(role);
    if (/supervisor|manager|lead/i.test(r)) {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const toggleAssignWorkerPopup = () => {
    setIsAssignWorkerOpen((s) => !s);
  };

  const handleWorkerAssigned = (assignmentData) => {
    console.log("Workers assigned (from popup):", assignmentData);
    setIsAssignWorkerOpen(false);
  };

  // Improved function to check if profilePictureUrl exists and is valid
  const hasValidProfileImage = (worker) => {
    const url = worker?.profilePictureUrl;
    return url && typeof url === "string" && url.trim() !== "";
  };

  const fallbackSrc = profileFallback?.src || profileFallback || "";

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Assign Worker Popup */}
      {isAssignWorkerOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl xl:max-w-6xl max-h-[95vh] bg-white shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Assign Workers</h2>
                    <p className="text-blue-100 text-sm">Select workers for this task</p>
                  </div>
                </div>
                <button
                  onClick={toggleAssignWorkerPopup}
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
              <AssignWorkerPage
                onCancel={toggleAssignWorkerPopup}
                onWorkerAssigned={handleWorkerAssigned}
                assignedUserIds={assignedUserIds}
              />
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg shadow-sm">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Assigned Workers</h3>
            <p className="text-gray-600 text-sm">
              {assignedWorkers.length}{" "}
              {assignedWorkers.length === 1 ? "person" : "people"} assigned to this task
            </p>
          </div>
        </div>
        <button
          onClick={toggleAssignWorkerPopup}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Worker
        </button>
      </div>

      {/* Loading / Error indicators (optional) */}
      {loading && (
        <div className="text-sm text-gray-500 mb-3">Loading workers...</div>
      )}
      {error && (
        <div className="text-sm text-red-500 mb-3">
          Failed to load workers: {String(error)}
        </div>
      )}

      {assignedWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignedWorkers.map((worker) => {
            const name = displayName(worker);
            const role = displayRole(worker);
            const hours = displayHours(worker);
            const efficiency = displayEfficiency(worker);
            const hasImage = hasValidProfileImage(worker);

            return (
              <div
                key={String(getWorkerId(worker) ?? name)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    {hasImage ? (
                      <img
                        src={worker.profilePictureUrl}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                        onError={(e) => {
                          // If image fails to load, replace with icon
                          const iconContainer = document.createElement("div");
                          iconContainer.className =
                            "w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm";
                          iconContainer.innerHTML =
                            '<svg class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                          e.target.parentNode.replaceChild(
                            iconContainer,
                            e.target
                          );
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
                        <User className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${getRoleColor(
                          role
                        )}`}
                      >
                        {getRoleIcon(role)}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-gray-900 truncate">
                        {name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          role
                        )}`}
                      >
                        {role}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      <span>{hours}h logged</span>
                    </div>

                    {efficiency !== null && efficiency !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Efficiency</span>
                          <span>{efficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              efficiency >= 80
                                ? "bg-green-500"
                                : efficiency >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, efficiency)
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-purple-50 rounded-full">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h4 className="text-gray-700 font-medium mb-1">
            No workers assigned
          </h4>
          <p className="text-gray-500 text-sm mb-4">
            Assign workers to get this task started
          </p>
          <button
            onClick={toggleAssignWorkerPopup}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Assign First Worker
          </button>
        </div>
      )}
    </div>
  );
}
