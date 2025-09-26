"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/redux/projects/ProjectSlice";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import Swal from "sweetalert2";
import {
  Search,
  FileCheck2,
  CreditCard,
  FolderOpen,
  Users,
  Calendar,
  XCircle,
} from "lucide-react";

export default function InvoiceFilters({ onFilterChange }) {
  const dispatch = useDispatch();
  const {
    items: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);
  const {
    items: workers,
    loading: workersLoading,
    error: workersError,
  } = useSelector((state) => state.workers);
  const [filters, setFilters] = useState({
    status: "",
    payment: "",
    project: "",
    worker: "",
    from: "",
    to: "",
    search: "",
  });

  // Fetch projects and workers on mount
  useEffect(() => {
    console.log("Fetching projects and workers...");
    dispatch(fetchProjects()).then((result) => {
      if (result.error) {
        console.error("Failed to fetch projects:", result.error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Projects",
          text: "Unable to fetch projects from the server. Please try again.",
          confirmButtonColor: "#dc2626",
        });
      }
    });
    dispatch(fetchWorkers()).then((result) => {
      if (result.error) {
        console.error("Failed to fetch workers:", result.error);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Workers",
          text: "Unable to fetch workers from the server. Please try again.",
          confirmButtonColor: "#dc2626",
        });
      }
    });
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFilters = { ...filters, [name]: value };

    // Validate date range
    if (name === "from" && filters.to && value > filters.to) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Date Range",
        text: "From date cannot be after To date.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (name === "to" && filters.from && value < filters.from) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Date Range",
        text: "To date cannot be before From date.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: "",
      payment: "",
      project: "",
      worker: "",
      from: "",
      to: "",
      search: "",
    };
    setFilters(emptyFilters);
    console.log("Filters cleared:", emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Filter Invoices
              </h2>
              <p className="text-gray-600 text-sm">
                Refine your invoice search with multiple criteria
              </p>
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Invoices
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search by worker name or invoice ID..."
                value={filters.search}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approval Status
            </label>
            <div className="relative">
              <FileCheck2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none text-sm"
              >
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="payment"
                value={filters.payment}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none text-sm"
              >
                <option value="">All Payments</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="project"
                value={filters.project}
                onChange={handleChange}
                disabled={projectsLoading || projectsError}
                className="w-full pl-10 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none text-sm"
              >
                <option value="">
                  {projectsLoading
                    ? "Loading..."
                    : projectsError
                    ? "Error"
                    : "All Projects"}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Worker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Worker
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="worker"
                value={filters.worker}
                onChange={handleChange}
                disabled={workersLoading || workersError}
                className="w-full pl-10 pr-8 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white appearance-none text-sm"
              >
                <option value="">
                  {workersLoading
                    ? "Loading..."
                    : workersError
                    ? "Error"
                    : "All Workers"}
                </option>
                {workers.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.firstName} {w.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="from"
                  value={filters.from}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="to"
                  value={filters.to}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
