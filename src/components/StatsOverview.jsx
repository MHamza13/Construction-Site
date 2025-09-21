"use client";
import {
  BarChart3,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const stats = [
  {
    name: "Total Projects",
    value: "24",
    change: "+12% from last month",
    changeType: "positive",
    icon: BarChart3,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Active Workers",
    value: "156",
    change: "+8% from last month",
    changeType: "positive",
    icon: Users,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    gradient: "from-green-500 to-green-600",
  },
  {
    name: "Hours Logged",
    value: "2,847",
    change: "This week",
    changeType: "neutral",
    icon: Clock,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    name: "Budget Status",
    value: "87%",
    change: "Within budget",
    changeType: "positive",
    icon: DollarSign,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
];

export default function StatsOverview() {
  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

      <div className="p-2">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Overview Statistics</h2>
            <p className="text-gray-600 text-sm">Key metrics and performance indicators</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-lg flex items-center justify-center ${stat.iconBg} 
                              transition-transform duration-300 group-hover:scale-110`}
                >
                  <stat.icon
                    className={`h-6 w-6 ${stat.iconColor}`}
                    aria-hidden="true"
                  />
                </div>
                <div className={`text-right`}>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {stat.name}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <div className="flex items-center space-x-1">
                  {stat.changeType === "positive" && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {stat.changeType === "negative" && (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <p className={`text-sm font-medium ${
                    stat.changeType === "positive" ? "text-green-600" : 
                    stat.changeType === "negative" ? "text-red-600" : 
                    "text-gray-600"
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
