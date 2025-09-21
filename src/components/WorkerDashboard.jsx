"use client";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, FileText, Briefcase } from "lucide-react";

export default function WorkerDashboard() {
  const stats = [
    { label: "Active Projects", value: "12" },
    { label: "This Month Earnings", value: "$5,200" },
    { label: "Pending Invoices", value: "7" },
    { label: "Hours This Month", value: "120h" },
  ];

  const icons = {
    "Active Projects": <Briefcase className="h-8 w-8 text-blue-600" />,
    "This Month Earnings": <DollarSign className="h-8 w-8 text-green-600" />,
    "Pending Invoices": <FileText className="h-8 w-8 text-yellow-600" />,
    "Hours This Month": <Clock className="h-8 w-8 text-purple-600" />,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
      {stats.map((item, i) => (
        <Card
          key={i}
          className="rounded-md shadow-md hover:shadow-lg transition p-5 border border-gray-200"
        >
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              {icons[item.label]}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
