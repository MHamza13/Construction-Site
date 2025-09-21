"use client";
import StatsOverview from "../components/StatsOverview";
import RecentProjects from "../components/RecentProjects";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 text-sm">Overview & insights of your projects</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-white shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Stats Section */}
          <div className="mb-8">
            <StatsOverview />
          </div>

          {/* Recent Projects Section */}
          <div>
            <RecentProjects />
          </div>
        </div>
      </div>
    </div>
  );
}
