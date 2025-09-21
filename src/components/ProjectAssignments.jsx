"use client";

import { Calendar, Clock, DollarSign, TrendingUp } from "lucide-react";

export default function ProjectAssignments() {
  const projects = [
    {
      name: "Website Redesign",
      startDate: "March 1, 2024",
      endDate: "March 20, 2024",
      hours: 40,
      earnings: 1200,
      progress: 70,
      status: "In Progress",
      client: "TechCorp Inc.",
      priority: "High",
    },
    {
      name: "Mobile App Development",
      startDate: "Feb 15, 2024",
      endDate: "April 10, 2024",
      hours: 85,
      earnings: 3400,
      progress: 45,
      status: "In Progress",
      client: "StartupXYZ",
      priority: "Medium",
    },
    {
      name: "Marketing Campaign",
      startDate: "March 5, 2024",
      endDate: "March 25, 2024",
      hours: 25,
      earnings: 750,
      progress: 100,
      status: "Completed",
      client: "BrandStudio",
      priority: "Low",
    },
    {
      name: "Backend Revamp",
      startDate: "April 1, 2024",
      endDate: "May 1, 2024",
      hours: 0,
      earnings: 0,
      progress: 0,
      status: "Not Started",
      client: "DataFlow Ltd.",
      priority: "High",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Not Started":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 70) return "bg-blue-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-gray-400";
  };

  const totalEarnings = projects.reduce((sum, proj) => sum + proj.earnings, 0);
  const totalHours = projects.reduce((sum, proj) => sum + proj.hours, 0);
  const avgProgress = Math.round(
    projects.reduce((sum, proj) => sum + proj.progress, 0) / projects.length
  );

  return (
    <div className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Project Assignments
            </h2>
            <p className="text-indigo-200 text-sm">
              Track your active projects and progress
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {projects.length}
            </div>
            <div className="text-indigo-200 text-xs">Active Projects</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-100">
        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Earnings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-md">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalHours}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-md">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgProgress}%
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-md">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="p-6 space-y-4">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {proj.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-md ${getPriorityColor(
                      proj.priority
                    )}`}
                  >
                    {proj.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{proj.client}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-md ${getStatusColor(
                  proj.status
                )}`}
              >
                {proj.status}
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-md p-3">
                <Calendar className="w-4 h-4 text-gray-500 mb-1" />
                <p className="text-xs text-gray-600">Duration</p>
                <p className="text-sm font-medium">
                  {proj.startDate} → {proj.endDate}
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <Clock className="w-4 h-4 text-gray-500 mb-1" />
                <p className="text-xs text-gray-600">Hours</p>
                <p className="text-base font-bold">{proj.hours}</p>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <DollarSign className="w-4 h-4 text-gray-500 mb-1" />
                <p className="text-xs text-gray-600">Earnings</p>
                <p className="text-base font-bold">
                  ${proj.earnings.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <TrendingUp className="w-4 h-4 text-gray-500 mb-1" />
                <p className="text-xs text-gray-600">Progress</p>
                <p className="text-base font-bold">{proj.progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Project Completion</span>
                <span>{proj.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-md overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(
                    proj.progress
                  )} transition-all`}
                  style={{ width: `${proj.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Action */}
            <div className="text-right">
              <button className="text-indigo-600 text-sm font-medium hover:underline cursor-pointer">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
