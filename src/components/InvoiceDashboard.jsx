import { FileText, Hourglass, CheckCircle2, DollarSign } from "lucide-react";

export default function InvoiceDashboard() {
  const stats = [
    {
      title: "Total Invoices",
      value: 24,
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: <FileText className="w-8 h-8 text-blue-600" />,
    },
    {
      title: "Pending Amount",
      value: "$3,240",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      icon: <Hourglass className="w-8 h-8 text-yellow-600" />,
    },
    {
      title: "Approved Amount",
      value: "$2,180",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      icon: <CheckCircle2 className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Paid Amount",
      value: "$8,920",
      color: "text-green-600",
      bg: "bg-green-100",
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="p-5 rounded-md shadow-md bg-white flex items-center justify-between gap-4 transition-transform transform hover:shadow-lg"
        >
          {/* Text content */}
          <div>
            <h2 className="text-sm font-medium text-gray-600">{s.title}</h2>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
          {/* Icon container */}
          <div className={`p-3 rounded-full ${s.bg}`}>{s.icon}</div>
        </div>
      ))}
    </div>
  );
}
