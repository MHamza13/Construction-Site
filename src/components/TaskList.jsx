"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Flag,
  Eye,
  Pencil,
  AlertTriangle,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import { fetchTasks } from "@/redux/task/TaskSlice";
import { fetchProjects } from "@/redux/projects/ProjectSlice"; // ✅ import project slice

export default function TaskList({ tasks: propTasks }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [expandedTasks, setExpandedTasks] = useState({});

  // Redux state - tasks
  const reduxTasks = useSelector((state) => state.tasks.items);
  const { loading, error } = useSelector((state) => state.tasks);

  // Redux state - projects
  const projects = useSelector((state) => state.projects.items);

  const displayTasks = propTasks || reduxTasks;

  // Fetch tasks & projects
  useEffect(() => {
    if (!propTasks) {
      dispatch(fetchTasks());
    }
    dispatch(fetchProjects()); // ✅ also fetch projects
  }, [dispatch, propTasks]);

  const getProjectName = (projectIdOrObj) => {
    if (!projectIdOrObj) return "Unknown Project";

    // If already populated object
    if (typeof projectIdOrObj === "object" && projectIdOrObj.name) {
      return projectIdOrObj.name;
    }

    // Otherwise treat as id & find from projects list
    const project = projects.find((p) => p.id === projectIdOrObj);
    return project ? project.name : "Unknown Project";
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Loading state (only if no props)
  if (!propTasks && loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  // Error state (only if no props)
  if (!propTasks && error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Error loading tasks
            </p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No tasks state
  if (!displayTasks || displayTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first task.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayTasks.map((task, i) => {
        const subtasks = task.subtasks || [];
        const completedCount = subtasks.filter((s) => s.done).length;
        const totalCount = subtasks.length;
        const progressPercentage =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        const dueDate = task.dueDate || task.deadline;
        const overdue = isOverdue(dueDate);
        const isExpanded = expandedTasks[task.id || i];

        return (
          <div
            key={task.id || i}
            className="bg-white rounded-md shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Status indicator bar */}
            <div
              className={`h-1 ${
                task.status === "Completed"
                  ? "bg-green-500"
                  : task.status === "InProgress" ||
                    task.status === "In Progress"
                  ? "bg-yellow-500"
                  : overdue
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            ></div>

            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    {task.name || task.title}
                  </h3>
                  <div className="flex items-center text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                    <Briefcase size={14} className="mr-2 text-gray-400" />
                    <span>
                      {getProjectName(task.projectId || task.project)}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium flex items-center whitespace-nowrap ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "InProgress" ||
                        task.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : overdue
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      task.status === "Completed"
                        ? "bg-green-500"
                        : task.status === "InProgress" ||
                          task.status === "In Progress"
                        ? "bg-yellow-500"
                        : overdue
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  ></span>
                  {overdue ? "Overdue" : task.status || "Not Started"}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ease-out ${
                      task.status === "Completed"
                        ? "bg-green-500"
                        : task.status === "InProgress" ||
                          task.status === "In Progress"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {completedCount}/{totalCount} subtasks completed
                </p>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <Flag
                    size={16}
                    className={`mr-2 ${
                      task.priority === "High"
                        ? "text-red-500"
                        : task.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-blue-500"
                    }`}
                  />
                  <span className="font-medium">{task.priority} Priority</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <User size={16} className="mr-2 text-gray-400" />
                  <span>{task.assignedUserIds?.length || 0} assigned</span>
                </div>

                <div
                  className={`flex items-center ${
                    overdue ? "text-red-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {overdue ? (
                    <AlertTriangle size={16} className="mr-2 text-red-500" />
                  ) : (
                    <Calendar size={16} className="mr-2 text-gray-400" />
                  )}
                  <span>
                    {dueDate
                      ? new Date(dueDate).toLocaleDateString()
                      : "No due date"}
                  </span>
                </div>
              </div>

              {/* Subtasks */}
              {subtasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-500">
                      SUBTASKS
                    </p>
                    {subtasks.length > 3 && (
                      <button
                        onClick={() => toggleExpand(task.id || i)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {isExpanded
                          ? "Show less"
                          : `+${subtasks.length - 3} more`}
                      </button>
                    )}
                  </div>
                  <div
                    className={`space-y-1 transition-all duration-500 py-2 ${
                      isExpanded ? "max-h-96" : "max-h-20 overflow-hidden"
                    }`}
                  >
                    {(isExpanded ? subtasks : subtasks.slice(0, 3)).map(
                      (sub, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center px-3 py-1.5 rounded-full text-sm shadow-sm ${
                            sub.done
                              ? "bg-green-50 text-green-700"
                              : sub.inProgress
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between gap-3 pt-2">
                <button
                  className="flex-1 py-2.5 rounded-md border border-gray-300 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  onClick={() => router.push(`/taskDetails/${task.id}`)}
                >
                  <Eye size={16} className="mr-1" /> Details
                </button>
                <button
                  className="px-4 py-2.5 rounded-md cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center justify-center"
                  onClick={() => router.push(`/edit-task/${task.id}`)}
                >
                  <Pencil size={16} className="mr-1" /> Edit
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
