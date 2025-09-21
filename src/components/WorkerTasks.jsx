"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  DollarSign,
  Plus,
  CheckCircle2,
  PlayCircle,
  Building2,
  Timer,
  TrendingUp,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function TaskHistory() {
  const tasks = [
    {
      project: "Project Gamma",
      title: "Foundation Concrete Pour",
      status: "Completed",
      description:
        "Poured concrete for the main foundation section of Building A. Ensured proper leveling and curing process.",
      hours: "—",
      date: "—",
      earnings: "—",
      timeType: "—",
      priority: "High",
      category: "Construction",
    },
    {
      project: "Project Alpha",
      title: "Steel Frame Installation",
      status: "In Progress",
      description:
        "Installing steel framework for the second floor structure. Working with crane operator for precise placement.",
      hours: "8 hours",
      date: "Mar 16, 2024",
      earnings: "$120.00",
      timeType: "Regular Hours",
      priority: "Medium",
      category: "Installation",
    },
    {
      project: "Project Beta",
      title: "Site Cleanup & Preparation",
      status: "Completed",
      description:
        "Cleared construction debris and prepared site for next phase of construction work.",
      hours: "10 hours",
      date: "Mar 15, 2024",
      earnings: "$165.00",
      timeType: "8h + 2h OT",
      priority: "Low",
      category: "Preparation",
    },
    {
      project: "Project Alpha",
      title: "Foundation Concrete Pour",
      status: "Completed",
      description:
        "Cleared construction debris and prepared site for next phase of construction work.",
      hours: "6 hours",
      date: "Mar 14, 2024",
      earnings: "$90.00",
      timeType: "6h Regular",
      priority: "High",
      category: "Construction",
    },
  ];

  const projectOptions = [
    "All Projects",
    ...new Set(tasks.map((task) => task.project)),
  ];

  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredTasks =
    selectedProject === "All Projects"
      ? tasks
      : tasks.filter((task) => task.project === selectedProject);

  const completedTasks = filteredTasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const totalEarnings = filteredTasks
    .filter((t) => t.earnings !== "—")
    .reduce((sum, t) => sum + parseFloat(t.earnings.replace("$", "")), 0);
  const totalHours = filteredTasks
    .filter((t) => t.hours !== "—")
    .reduce((sum, t) => sum + parseInt(t.hours), 0);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "In Progress":
        return <PlayCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

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

  const getCategoryColor = (category) => {
    switch (category) {
      case "Construction":
        return "bg-orange-100 text-orange-800";
      case "Installation":
        return "bg-purple-100 text-purple-800";
      case "Preparation":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              Track and manage your completed tasks
            </p>
          </div>
          <div className="flex gap-3">
            {/* Dropdown */}
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
            <button className="bg-white text-indigo-900 cursor-pointer px-6 py-2 rounded-md text-sm font-semibold hover:bg-indigo-50 transition flex items-center gap-2 shadow-md">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 border-b border-gray-100">
        <div className="bg-white rounded-md p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredTasks.length}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {completedTasks} completed
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-md">
              <CheckCircle2 className="w-7 h-7 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-gray-900">{totalHours}</p>
              <p className="text-sm text-blue-600 mt-1">This period</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-md">
              <Timer className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">
                ${totalEarnings.toFixed(2)}
              </p>
              <p className="text-sm text-green-600 mt-1">+12% vs last week</p>
            </div>
            <div className="bg-green-100 p-3 rounded-md">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6 space-y-6">
        {filteredTasks.map((task, i) => (
          <div
            key={i}
            className={`bg-white rounded-md p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${getPriorityColor(
              task.priority
            )}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition cursor-pointer">
                    {task.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-md ${getCategoryColor(
                      task.category
                    )}`}
                  >
                    {task.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{task.project}</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {getStatusIcon(task.status)}
                <span>{task.status}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{task.description}</p>

            {task.hours !== "—" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-md p-4 hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" /> Hours Worked
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {task.hours}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-md p-4 hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" /> Date
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {task.date}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-md p-4 hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" /> Earnings
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {task.earnings}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-md p-4 hover:bg-gray-100 transition cursor-pointer">
                  <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
                    <Timer className="w-4 h-4" /> Time Type
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {task.timeType}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800 flex items-center gap-2 cursor-pointer hover:bg-amber-100 transition">
                <Clock className="w-4 h-4" />
                Task details pending - Hours and earnings to be updated
              </div>
            )}
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-md w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-6">
              No tasks match the selected project. Try another filter or add a
              new task.
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition cursor-pointer shadow-md">
              Add Your First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
