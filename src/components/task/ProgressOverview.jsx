"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaClock, FaCircle, FaChartBar } from "react-icons/fa";
import { fetchSubtasks } from "@/redux/subTask/SubTaskSlice";

export default function ProgressOverview({ taskId }) {
  const dispatch = useDispatch();

  // Get subtasks from Redux
  const subtasksData = useSelector(
    (state) => state.subtasks.subtasks?.[taskId] ?? []
  );
  const loading = useSelector((state) => state.subtasks.loading);
  const error = useSelector((state) => state.subtasks.error);

  const safeSubtasks = Array.isArray(subtasksData) ? subtasksData : [];

  // Fetch subtasks when taskId changes
  useEffect(() => {
    if (taskId) {
      dispatch(fetchSubtasks(taskId));
    }
  }, [taskId, dispatch]);

  console.log("Rendering ProgressOverview with subtasks:", safeSubtasks);

  // Map API status to UI logic
  const getStatusType = (status) => {
    switch (status) {
      case "Completed":
        return "done";
      case "In Progress":
      case "InProgress":
        return "inProgress";
      case "Not Started":
      case "NotStarted":
        return "notStarted";
      default:
        return "notStarted";
    }
  };

  const completed = safeSubtasks.filter(
    (s) => getStatusType(s.status) === "done"
  ).length;
  const inProgress = safeSubtasks.filter(
    (s) => getStatusType(s.status) === "inProgress"
  ).length;
  const notStarted = safeSubtasks.filter(
    (s) => getStatusType(s.status) === "notStarted"
  ).length;
  const totalSubtasks = safeSubtasks.length;
  const percentage =
    totalSubtasks > 0 ? Math.round((completed / totalSubtasks) * 100) : 0;

  const getProgressColor = (percent) => {
    if (percent >= 90) return "bg-green-500";
    if (percent >= 70) return "bg-teal-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent >= 30) return "bg-yellow-500";
    if (percent >= 10) return "bg-orange-500";
    return "bg-red-500";
  };

  const progressColor = getProgressColor(percentage);

  return (
    <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 rounded-md flex items-center justify-center">
          <FaChartBar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Progress Overview
          </h3>
          <p className="text-sm text-gray-500">Task completion tracking</p>
        </div>
      </div>

      {/* Loading / Error States */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading subtasks...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">Error: {error}</p>
      ) : (
        <>
          {/* Main Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-gray-900">
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-md h-3 mb-2 overflow-hidden">
              <div
                className={`h-3 rounded-md transition-all duration-500 ${progressColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {completed} of {totalSubtasks} subtasks completed
            </p>
          </div>

          {/* Progress Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Completed */}
            <div className="text-center p-4 bg-green-50 rounded-md shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                <FaCheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">
                {completed}
              </div>
              <div className="text-xs text-green-600">Completed</div>
            </div>

            {/* In Progress */}
            <div className="text-center p-4 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
                <FaClock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {inProgress}
              </div>
              <div className="text-xs text-blue-600">In Progress</div>
            </div>

            {/* Not Started */}
            <div className="text-center p-4 bg-gray-50 rounded-md shadow-sm hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mx-auto mb-2">
                <FaCircle className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {notStarted}
              </div>
              <div className="text-xs text-gray-600">Not Started</div>
            </div>
          </div>

          {/* Detailed Subtask Breakdown */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Subtask Breakdown
            </h4>
            <div className="space-y-3">
              {safeSubtasks.length > 0 ? (
                safeSubtasks.map((subtask, index) => {
                  const statusType = getStatusType(subtask.status);
                  return (
                    <div
                      key={subtask.id || index}
                      className="flex items-center justify-between bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            statusType === "done"
                              ? "bg-green-500"
                              : statusType === "inProgress"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            statusType === "done"
                              ? "text-green-700 line-through"
                              : statusType === "inProgress"
                              ? "text-blue-700"
                              : "text-gray-600"
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-md ${
                          statusType === "done"
                            ? "bg-green-100 text-green-700"
                            : statusType === "inProgress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {subtask.status || "Not Started"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  No subtasks defined yet.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
