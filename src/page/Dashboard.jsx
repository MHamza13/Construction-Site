"use client";
import StatsOverview from "../components/StatsOverview";
import RecentProjects from "../components/RecentProjects";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import Banner from "@/components/layout/Banner";

export default function Dashboard() {
  return (
    <div className="w-full">
      {/* Header */}
      {/* Banner */}
      <Banner
        title="Dashboard"
        subtitle="Overview & insights of your projects"
        breadcrumb={[
          { label: "Home", href: "/dashboard" },
          { label: "Dashboard" },
        ]}
      />

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
