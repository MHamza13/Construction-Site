"use client";
import { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Building2,
  Timer,
} from "lucide-react";

export default function InvoiceHistory() {
  const invoices = [
    {
      id: "INV-2024-001",
      date: "Mar 17, 2024",
      hours: "8h + 2h OT",
      projects: "Alpha, Beta",
      amount: "$165.00",
      status: "Approved",
      action: "View Details",
      invoiceNumber: "#001",
      totalHours: 10,
      regularHours: 8,
      overtimeHours: 2,
    },
    {
      id: "INV-2024-002",
      date: "Mar 16, 2024",
      hours: "8h + 3h OT",
      projects: "Alpha",
      amount: "$187.50",
      status: "Pending",
      action: "Review",
      invoiceNumber: "#002",
      totalHours: 11,
      regularHours: 8,
      overtimeHours: 3,
    },
    {
      id: "INV-2024-003",
      date: "Mar 15, 2024",
      hours: "8h + 1h OT",
      projects: "Beta",
      amount: "$142.50",
      status: "Paid",
      action: "View Receipt",
      invoiceNumber: "#003",
      totalHours: 9,
      regularHours: 8,
      overtimeHours: 1,
    },
    {
      id: "INV-2024-004",
      date: "Mar 14, 2024",
      hours: "6h Regular",
      projects: "Alpha",
      amount: "$90.00",
      status: "Paid",
      action: "View Receipt",
      invoiceNumber: "#004",
      totalHours: 6,
      regularHours: 6,
      overtimeHours: 0,
    },
    {
      id: "INV-2024-005",
      date: "Mar 13, 2024",
      hours: "8h + 2h OT",
      projects: "Alpha, Gamma",
      amount: "$165.00",
      status: "Paid",
      action: "View Receipt",
      invoiceNumber: "#005",
      totalHours: 10,
      regularHours: 8,
      overtimeHours: 2,
    },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getActionButton = (invoice) => {
    switch (invoice.status) {
      case "Paid":
        return (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
            Receipt
          </button>
        );
      case "Approved":
        return (
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
            <Eye className="w-4 h-4" />
            Details
          </button>
        );
      case "Pending":
        return (
          <button className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer">
            <AlertCircle className="w-4 h-4" />
            Review
          </button>
        );
      default:
        return (
          <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer">
            <Eye className="w-4 h-4" />
            View
          </button>
        );
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = Object.values(inv)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = invoices.reduce(
    (sum, inv) => sum + parseFloat(inv.amount.replace("$", "")),
    0
  );
  const paidAmount = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace("$", "")), 0);
  const pendingCount = invoices.filter(
    (inv) => inv.status === "Pending"
  ).length;
  const totalHours = invoices.reduce((sum, inv) => sum + inv.totalHours, 0);

  return (
    <div className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Invoice History
            </h2>
            <p className="text-slate-300">Track payments and manage invoices</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-300 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md pl-10 pr-4 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
              >
                <option value="All Status" className="text-gray-900">
                  All Status
                </option>
                <option value="Approved" className="text-gray-900">
                  Approved
                </option>
                <option value="Pending" className="text-gray-900">
                  Pending
                </option>
                <option value="Paid" className="text-gray-900">
                  Paid
                </option>
              </select>
            </div>

            {/* Generate Report Button */}
            <button className="bg-white text-slate-900 px-6 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer">
              <BarChart3 className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-gray-50 border-b border-gray-100">
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-md">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Paid Amount
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${paidAmount.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-md">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-md">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Hours
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-md">
              <Timer className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="p-8">
        {filteredInvoices.length > 0 ? (
          <div className="space-y-4">
            {filteredInvoices.map((inv, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Invoice Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-slate-100 p-2 rounded-md">
                        <FileText className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {inv.id}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Invoice {inv.invoiceNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            Date
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {inv.date}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Timer className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            Hours
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {inv.hours}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            Projects
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {inv.projects}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            Amount
                          </span>
                        </div>
                        <p className="font-bold text-green-600 text-lg">
                          {inv.amount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-md border font-medium ${getStatusColor(
                        inv.status
                      )}`}
                    >
                      {getStatusIcon(inv.status)}
                      <span>{inv.status}</span>
                    </div>

                    {getActionButton(inv)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No invoices found
            </h3>
            <p className="text-gray-500 mb-6">
              {search || statusFilter !== "All Status"
                ? "Try adjusting your search or filter criteria"
                : "Your invoices will appear here once created"}
            </p>
            {search || statusFilter !== "All Status" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All Status");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
