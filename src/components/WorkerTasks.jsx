"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasksByWorkerId } from "@/redux/task/TaskSlice";

import {
  Clock,
  Calendar,
  CheckCircle2,
  PlayCircle,
  Building2,
  Timer,
  TrendingUp,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function TaskHistory({ workerId }) {
  const dispatch = useDispatch();
  const {
    items: tasksData,
    loading,
    error,
  } = useSelector((state) => state.tasks);

  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // NOTE: openSubtaskDetails state is no longer needed as details are always visible.
  // const [openSubtaskDetails, setOpenSubtaskDetails] = useState({});

  // ✅ FIX: Ensure tasks is always an array to prevent "tasks.map is not a function"
  const tasks = Array.isArray(tasksData)
    ? tasksData
    : tasksData
    ? [tasksData]
    : [];

  useEffect(() => {
    if (workerId) {
      dispatch(fetchTasksByWorkerId(workerId));
    } else {
      console.error("Worker ID is missing. Cannot fetch tasks.");
    }
  }, [dispatch, workerId]);

  // ✅ Project filter options
  const projectOptions = [
    "All Projects",
    ...new Set(tasks.map((task) => task.project_name)?.filter(Boolean)),
  ];

  const filteredTasks =
    selectedProject === "All Projects"
      ? tasks
      : tasks.filter((task) => task.project_name === selectedProject);

  // NOTE: toggleSubtaskDetails function is no longer needed.
  // const toggleSubtaskDetails = (taskId) => {
  //   setOpenSubtaskDetails((prev) => ({
  //     ...prev,
  //     [taskId]: !prev[taskId],
  //   }));
  // };

  // ✅ Icons by status
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in_progress":
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case "overdue":
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // ✅ Priority border color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "border-l-4 border-red-500 hover:border-red-600";
      case "Medium":
        return "border-l-4 border-amber-500 hover:border-amber-600";
      case "Low":
        return "border-l-4 border-green-500 hover:border-green-600";
      default:
        return "border-l-4 border-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-md shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 px-8 py-6 rounded-t-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Task History</h2>
            <p className="text-indigo-200 text-sm">
              Worker assigned tasks overview
            </p>
          </div>

          {/* Project Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white/10 backdrop-blur-sm cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white/20 transition flex items-center gap-2 shadow-sm"
            >
              <Filter className="w-4 h-4" />
              {selectedProject}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                {projectOptions.map((project, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer rounded-md"
                  >
                    {project}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6 space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const summary = task.subtasks_summary || {}; // Default to empty object if null
            const parentStatusColor = summary.parent_status_color || "#333";
            // const isDetailsOpen = openSubtaskDetails[task.task_id]; // Not used now
            const hasSubtasks = summary.total > 0;
            // const showToggleButton = summary.total > 1; // Not used now

            return (
              <div
                key={task.task_id}
                className={`bg-white rounded-md p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${getPriorityColor(
                  task.task_priority
                )}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition cursor-pointer">
                        {task.task_name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{task.project_name}</span>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: parentStatusColor + "20",
                      color: parentStatusColor,
                      border: `1px solid ${parentStatusColor}60`,
                    }}
                  >
                    {getStatusIcon(summary.parent_status)}
                    <span>{summary.parent_status || "Not Started"}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{task.task_description}</p>

                {/* Subtasks & Progress - Top Row (Visible Always) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-4 mb-4">
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" /> Deadline
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {task.task_deadline}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                      <Timer className="w-4 h-4" /> Total Subtasks
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {summary.total || 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" /> Progress
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {summary.progress_percent || 0}%
                    </p>
                  </div>
                </div>

                {hasSubtasks && (
                  <div className="mt-4 ">
                    <h4 className="text-md font-semibold text-gray-800 mb-3">
                      Subtask Status Breakdown
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      {/* Completed */}
                      <div className="bg-green-50 rounded-md p-3">
                        <p className="text-xl font-bold text-green-700">
                          {summary.completed || 0}
                        </p>
                        <p className="text-xs text-green-600">Completed</p>
                      </div>
                      {/* In Progress */}
                      <div className="bg-blue-50 rounded-md p-3">
                        <p className="text-xl font-bold text-blue-700">
                          {summary.in_progress || 0}
                        </p>
                        <p className="text-xs text-blue-600">In Progress</p>
                      </div>
                      {/* Not Started */}
                      <div className="bg-gray-100 rounded-md p-3">
                        <p className="text-xl font-bold text-gray-700">
                          {summary.not_started || 0}
                        </p>
                        <p className="text-xs text-gray-600">Not Started</p>
                      </div>
                      {/* Overdue */}
                      <div className="bg-red-50 rounded-md p-3">
                        <p className="text-xl font-bold text-red-700">
                          {summary.overdue || 0}
                        </p>
                        <p className="text-xs text-red-600">Overdue</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16">
            {error ? (
              <p className="text-red-500 font-medium">
                Error fetching tasks: {JSON.stringify(error)}
              </p>
            ) : (
              <>
                <div className="bg-gray-100 rounded-md w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Worker Tasks Found
                </h3>
                <p className="text-gray-500 mb-6">
                  This worker doesn’t have any assigned tasks yet.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
