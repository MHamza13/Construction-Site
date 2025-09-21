"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Flag, Search } from "lucide-react";
import { fetchProjects } from "@/redux/projects/ProjectSlice";

export default function FiltersBar({
  filters,
  setFilters,
  toggleAddTaskPopup,
}) {
  const dispatch = useDispatch();
  const {
    items: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);

  // Fetch projects on mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="bg-white p-6 rounded-md shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          Filter Tasks
        </h3>
        <button
          onClick={toggleAddTaskPopup}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add New Task
        </button>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {/* Top Row: Status Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              "All Tasks",
              "In Progress",
              "Completed",
              "Not Started",
              "Overdue",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilters({ ...filters, status: filter })}
                className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors ${
                  filters.status === filter
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 
              text-gray-900 placeholder-gray-400 
              focus:border-blue-500 focus:outline-none sm:text-sm transition"
            />
          </div>
        </div>

        {/* Bottom Row: Project, Priority Filters, and Clear Button */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Project Filter */}
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <Building2 className="absolute left-3 top-9 text-gray-400 h-5 w-5 pointer-events-none" />
            <select
              value={filters.project}
              onChange={(e) =>
                setFilters({ ...filters, project: e.target.value })
              }
              disabled={projectsLoading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {projectsLoading ? "Loading..." : "All Projects"}
              </option>
              {projectsError && (
                <option value="">Error loading projects</option>
              )}
              {!projectsLoading &&
                !projectsError &&
                projects.map((project) => (
                  <option key={project.id} value={project.id.toString()}>
                    {project.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <Flag className="absolute left-3 top-9 text-gray-400 h-5 w-5 pointer-events-none" />
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  status: "All Tasks",
                  search: "",
                  project: "",
                  priority: "",
                })
              }
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
