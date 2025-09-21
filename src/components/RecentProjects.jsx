"use client";
import { projects, statusStyles } from "@/data/projects";
import { FolderKanban, Calendar, DollarSign, TrendingUp, Eye } from "lucide-react";

export default function RecentProjects() {
  const recentProjects = projects.slice(-2);

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-2xl -z-10"></div>

      <div className="p-2">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg shadow-sm">
              <FolderKanban className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
              <p className="text-gray-600 text-sm">Latest project updates and progress</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recentProjects.map((project) => (
            <div
              key={project.name}
              className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300"
              role="region"
              aria-label={`Project: ${project.name}`}
            >
              {/* Project Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FolderKanban className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500">Construction Project</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[project.status].badge}`}
                >
                  {project.status}
                </span>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                {/* Budget and Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Budget</p>
                      <p className="text-sm font-medium text-gray-900">{project.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Deadline</p>
                      <p className="text-sm font-medium text-gray-900">{project.deadline}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${statusStyles[project.status].bar} transition-all duration-500 group-hover:brightness-110`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no projects) */}
        {recentProjects.length === 0 && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-white">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-50 rounded-full">
                <FolderKanban className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No recent projects
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Start by creating your first project to see it here
            </p>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <FolderKanban className="w-4 h-4 mr-2" />
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}