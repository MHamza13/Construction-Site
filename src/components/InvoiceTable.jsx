"use client";
import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/redux/projects/ProjectSlice";
import DivideAmountModal from "@/components/DivideAmountModal";
import BulkPaymentModal from "@/components/BulkPaymentModal";
import EditInvoiceModal from "@/components/EditInvoiceModal";
import ViewInvoiceModal from "@/components/ViewInvoiceModal";
import Swal from "sweetalert2";
import {
  Eye,
  Edit,
  Trash2,
  DollarSign,
  FileText,
  Clock,
  Plus,
  Calendar,
} from "lucide-react";
import { ProcessPaymentModal } from "./ProcessPaymentModal";

export default function InvoiceTable({ filters = {} }) {
  const dispatch = useDispatch();
  const {
    items: projects,
    loading,
    error,
  } = useSelector((state) => state.projects);
  const [selected, setSelected] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showDivideModal, setShowDivideModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBulkPaymentModal, setShowBulkPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      workerId: 1,
      workerName: "Admin User",
      email: "admin123@gmail.com",
      overtimeRate: 1.5,
      ShiftDetails: [
        {
          shiftId: 9,
          date: "2025-09-18T12:33:17Z",
          checkIn: "12:33",
          endShift: "12:34",
          calculatedHours: 0.02,
          adjustedHours: 0.02,
          dailyWage: null,
          payData: {
            overtimeHours: 0,
            totalPay: null,
          },
        },
      ],
      shiftIds: [9],
      Shifts: 1,
      totals: {
        totalShifts: 1,
        totalHours: 0.02,
        totalRegularHours: 0.02,
        totalOvertimeHours: 0,
        totalRegularPay: null,
        totalOvertimePay: 0,
        totalPay: null,
      },
      internalNotes: "Short shift, pending manual review.",
      payPeriod: "Sep 18-18, 2025",
      Status: "Pending Review",
      projects: "General",
      approval: "Pending",
      payment: "Unpaid",
    },
    {
      id: 2,
      workerId: 9,
      workerName: "Shahzaib Mughal Shahzaib Mughal",
      email: "fortest372.sms@gmail.com",
      overtimeRate: 1.5,
      ShiftDetails: [
        {
          shiftId: 2,
          date: "2025-09-11T09:45:00Z",
          checkIn: "09:45",
          endShift: "15:00",
          calculatedHours: 5.25,
          adjustedHours: 5.25,
          dailyWage: 200,
          payData: {
            overtimeHours: 0,
            totalPay: 131.25,
          },
        },
        {
          shiftId: 3,
          date: "2025-09-11T16:00:00Z",
          checkIn: "16:00",
          endShift: "18:00",
          calculatedHours: 2,
          adjustedHours: 2,
          dailyWage: 200,
          payData: {
            overtimeHours: 0,
            totalPay: 50,
          },
        },
      ],
      shiftIds: [2, 3],
      Shifts: 2,
      totals: {
        totalShifts: 2,
        totalHours: 7.25,
        totalRegularHours: 7.25,
        totalOvertimeHours: 0,
        totalRegularPay: 181.25,
        totalOvertimePay: 0,
        totalPay: 181.25,
      },
      internalNotes: "No overtime. Regular hours only.",
      payPeriod: "Sep 11-11, 2025",
      Status: "Pending Review",
      projects: "General",
      approval: "Pending",
      payment: "Unpaid",
    },
    {
      id: 3,
      workerId: 12,
      workerName: "M M",
      email: "iamhamza013@gmail.com",
      overtimeRate: 1.5,
      ShiftDetails: [
        {
          shiftId: 6,
          date: "2025-09-12T09:33:00Z",
          checkIn: "09:33",
          endShift: "18:00",
          calculatedHours: 8.45,
          adjustedHours: 8,
          dailyWage: 160,
          payData: {
            overtimeHours: 0.45,
            totalPay: 169.2,
          },
        },
        {
          shiftId: 7,
          date: "2025-09-15T09:13:00Z",
          checkIn: "09:13",
          endShift: "15:00",
          calculatedHours: 5.78,
          adjustedHours: 5.78,
          dailyWage: 160,
          payData: {
            overtimeHours: 0,
            totalPay: 115.4,
          },
        },
      ],
      shiftIds: [6, 7],
      Shifts: 2,
      totals: {
        totalShifts: 2,
        totalHours: 14.23,
        totalRegularHours: 13.78,
        totalOvertimeHours: 0.45,
        totalRegularPay: 272,
        totalOvertimePay: 12.6,
        totalPay: 284.6,
      },
      internalNotes: "0.45 overtime hours on 12th Sep approved.",
      payPeriod: "Sep 12-15, 2025",
      Status: "Pending Review",
      projects: "General",
      approval: "Pending",
      payment: "Unpaid",
    },
  ]);

  // Fetch projects on mount
  useEffect(() => {
    console.log("Fetching projects...");
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
  }, [dispatch]);

  // Helper function to format worker display
  const getWorkerDisplay = (invoice) => {
    return `${invoice.workerName} (#${invoice.workerId})`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString || "N/A";
    }
  };

  // Helper function to get worker avatar
  const getWorkerAvatar = (workerName) => {
    if (!workerName) {
      console.warn("Invalid workerName in getWorkerAvatar:", workerName);
      return "N/A";
    }
    return workerName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Delete handler
  const handleDelete = (id, event) => {
    event.stopPropagation();
    console.log("Delete clicked for invoice ID:", id);
    Swal.fire({
      icon: "warning",
      title: "Delete Invoice?",
      text: "This action cannot be undone!",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setInvoices((prev) => {
          const updated = prev.filter((inv) => inv.id !== id);
          console.log("Invoices after deletion:", updated);
          return updated;
        });
        Swal.fire("Deleted!", "Invoice has been deleted.", "success");
      }
    });
  };

  // Save handler for invoice updates
  const handleUpdateInvoice = (updatedInvoice) => {
    console.log("Updating invoice:", updatedInvoice);
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        inv.id === updatedInvoice.id ? updatedInvoice : inv
      );
      console.log("Invoices after update:", updated);
      return updated;
    });
    setShowEditModal(false);
    Swal.fire({
      icon: "success",
      title: "Invoice Updated",
      text: `Invoice #${updatedInvoice.id} updated successfully!`,
      confirmButtonColor: "#2563eb",
    });
  };

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      if (filters.status && invoice.approval !== filters.status) return false;
      if (filters.payment && invoice.payment !== filters.payment) return false;
      if (filters.project && !invoice.projects.includes(filters.project))
        return false;
      if (
        filters.worker &&
        !invoice.workerName.toLowerCase().includes(filters.worker.toLowerCase())
      )
        return false;

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        if (
          !invoice.workerName.toLowerCase().includes(searchTerm) &&
          !invoice.workerId.toString().includes(searchTerm) &&
          !invoice.id.toString().includes(searchTerm) &&
          !invoice.email.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }
      return true;
    });
    console.log("Filtered invoices:", filtered);
    return filtered;
  }, [invoices, filters]);

  const toggleSelect = (id, event) => {
    event.stopPropagation();
    setSelected((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];
      console.log("Selected invoices:", updated);
      return updated;
    });
  };

  const clearSelection = () => {
    console.log("Clearing selection");
    setSelected([]);
    setSelectedProject("");
  };

  const handleBulkApprove = () => {
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Invoices Selected",
        text: "Please select at least one invoice.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        selected.includes(inv.id) ? { ...inv, approval: "Approved" } : inv
      );
      console.log("Invoices after bulk approve:", updated);
      return updated;
    });
    Swal.fire({
      icon: "success",
      title: "Invoices Approved",
      text: `${selected.length} invoice(s) approved successfully!`,
      confirmButtonColor: "#2563eb",
    });
    clearSelection();
  };

  const handleBulkPayment = () => {
    console.log("Bulk payment clicked");
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Invoices Selected",
        text: "Please select at least one invoice.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    const selectedInvoices = invoices.filter((inv) =>
      selected.includes(inv.id)
    );
    const uniqueWorkers = [
      ...new Set(selectedInvoices.map((inv) => inv.workerId)),
    ];
    if (uniqueWorkers.length > 1) {
      Swal.fire({
        icon: "error",
        title: "Multiple Workers Selected",
        text: "Bulk payment can only be processed for one worker.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }
    const invalidInvoices = selectedInvoices.filter(
      (inv) => !inv.totals.totalPay
    );
    if (invalidInvoices.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Invoices",
        text: "Cannot process payment for invoices with no total pay.",
        confirmButtonColor: "#dc2626",
      });
      return;
    }
    console.log("Opening BulkPaymentModal with invoices:", selectedInvoices);
    setShowBulkPaymentModal(true);
  };

  const handleAssignToProject = () => {
    if (!selectedProject) {
      Swal.fire({
        icon: "warning",
        title: "No Project Selected",
        text: "Please select a project.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Invoices Selected",
        text: "Please select at least one invoice.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        selected.includes(inv.id) ? { ...inv, projects: selectedProject } : inv
      );
      console.log("Invoices after project assignment:", updated);
      return updated;
    });
    Swal.fire({
      icon: "success",
      title: "Invoices Assigned",
      text: `${selected.length} invoice(s) assigned to ${selectedProject}!`,
      confirmButtonColor: "#2563eb",
    });
    clearSelection();
  };

  const handleDivideConfirm = (allocations) => {
    console.log("Divide confirm allocations:", allocations);
    setInvoices((prev) => {
      const updated = prev.map((inv) =>
        selected.includes(inv.id)
          ? {
              ...inv,
              projects: allocations
                .map(
                  (alloc) =>
                    projects.find((p) => p.id === alloc.projectId)?.name
                )
                .filter(Boolean)
                .join(", "),
            }
          : inv
      );
      console.log("Invoices after division:", updated);
      return updated;
    });
    Swal.fire({
      icon: "success",
      title: "Invoices Divided",
      text: `${selected.length} invoice(s) allocated to projects!`,
      confirmButtonColor: "#2563eb",
    });
    clearSelection();
  };

  return (
    <div className="w-full mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-blue-50/30 rounded-2xl -z-10"></div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Invoice Records
                </h3>
                <p className="text-gray-600 text-sm">
                  {filteredInvoices.length}{" "}
                  {filteredInvoices.length === 1 ? "invoice" : "invoices"} found
                </p>
              </div>
            </div>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="p-4 flex flex-wrap gap-3 border-b bg-blue-50 items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-medium text-blue-700 whitespace-nowrap">
                {selected.length} invoice{selected.length > 1 ? "s" : ""}{" "}
                selected
              </span>
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2 flex-shrink-0">
              <select
                className="border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-0"
                value={selectedProject}
                onChange={(e) => {
                  console.log("Selected project:", e.target.value);
                  setSelectedProject(e.target.value);
                }}
                disabled={loading}
              >
                <option value="">
                  {loading ? "Loading..." : "Select Project"}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignToProject}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                disabled={loading || error}
              >
                Assign
              </button>
              <button
                onClick={() => {
                  console.log("Divide button clicked");
                  setShowDivideModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                disabled={loading || error}
              >
                Divide
              </button>
              <button
                onClick={handleBulkApprove}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Approve
              </button>
              <button
                onClick={handleBulkPayment}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Pay
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 min-w-[40px]">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === filteredInvoices.length &&
                      filteredInvoices.length > 0
                    }
                    onChange={(event) => {
                      event.stopPropagation();
                      console.log("Select all checkbox toggled");
                      if (selected.length === filteredInvoices.length) {
                        clearSelection();
                      } else {
                        setSelected(filteredInvoices.map((inv) => inv.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider min-w-[200px]">
                  Worker & Details
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider text-center min-w-[120px]">
                  Period & Shifts
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider text-center min-w-[120px]">
                  Hours & Overtime
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider min-w-[100px]">
                  Projects
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider text-center min-w-[120px]">
                  Amount
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider text-center min-w-[80px]">
                  Status
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider text-center min-w-[80px]">
                  Payment
                </th>
                <th className="px-4 py-3 font-bold text-gray-900 text-sm uppercase tracking-wider text-center min-w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((inv, index) => (
                <tr
                  key={inv.id}
                  className={`hover:bg-blue-50/50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                  onClick={() =>
                    console.log("Row clicked for invoice ID:", inv.id)
                  }
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(inv.id)}
                      onChange={(event) => toggleSelect(inv.id, event)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {getWorkerAvatar(inv.workerName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm break-words">
                          {inv.workerName}
                        </div>
                        <div className="text-gray-500 text-xs">
                          ID: #{inv.workerId}
                        </div>
                        <div className="text-blue-600 text-xs break-words">
                          {inv.email}
                        </div>
                        <div className="text-gray-400 text-xs break-words">
                          {inv.internalNotes}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-xs break-words">
                          {inv.payPeriod}
                        </span>
                      </div>
                      <div className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 rounded-lg">
                        <span className="text-blue-800 font-semibold text-xs">
                          {inv.Shifts}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">shifts</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium">
                          {inv.totals.totalHours}h
                        </span>
                      </div>
                      <div className="text-xs text-orange-600">
                        OT: {inv.totals.totalOvertimeHours}h
                      </div>
                      <div className="text-xs text-gray-500">
                        Regular: {inv.totals.totalRegularHours}h
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700 text-sm break-words">
                      {inv.projects}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        Regular: ${inv.totals.totalRegularPay || "N/A"}
                      </div>
                      <div className="text-xs text-orange-600">
                        OT: ${inv.totals.totalOvertimePay || "0"}
                      </div>
                      <div className="font-bold text-green-700 text-sm pt-1 border-t border-gray-200">
                        ${inv.totals.totalPay || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${
                          inv.approval === "Approved"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : inv.approval === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                    >
                      {inv.approval}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                        ${
                          inv.payment === "Paid"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                    >
                      {inv.payment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center flex-wrap">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          console.log(
                            "View button clicked for invoice:",
                            inv.id
                          );
                          setSelectedInvoice(inv);
                          setShowViewModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition-colors border border-blue-200"
                        title="View Invoice"
                      >
                        <Eye className="w-3 h-3 flex-shrink-0" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          console.log(
                            "Edit button clicked for invoice:",
                            inv.id
                          );
                          if (!inv?.id || !inv?.workerName) {
                            Swal.fire({
                              icon: "error",
                              title: "Invalid Invoice",
                              text: "Cannot edit invoice with missing data.",
                              confirmButtonColor: "#dc2626",
                            });
                            return;
                          }
                          setSelectedInvoice(inv);
                          setShowEditModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium transition-colors border border-green-200"
                        title="Edit Invoice"
                      >
                        <Edit className="w-3 h-3 flex-shrink-0" />
                      </button>
                      <button
                        onClick={(event) => handleDelete(inv.id, event)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors border border-red-200"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3 h-3 flex-shrink-0" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          console.log(
                            "Pay button clicked for invoice:",
                            inv.id
                          );
                          if (!inv.totals.totalPay) {
                            Swal.fire({
                              icon: "error",
                              title: "Invalid Invoice",
                              text: "Cannot process payment for invoice with no total pay.",
                              confirmButtonColor: "#dc2626",
                            });
                            return;
                          }
                          setSelectedInvoice(inv);
                          setShowPaymentModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-medium transition-colors border border-amber-200"
                        title="Process Payment"
                      >
                        <DollarSign className="w-3 h-3 flex-shrink-0" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No invoices found
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Try adjusting your filters or create a new invoice
              </p>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            </div>
          )}
        </div>
      </div>

      <DivideAmountModal
        isOpen={showDivideModal}
        onClose={() => {
          console.log("Closing DivideAmountModal");
          setShowDivideModal(false);
        }}
        invoices={invoices.filter((inv) => selected.includes(inv.id))}
        projects={projects} // Pass API-fetched projects
        onConfirm={handleDivideConfirm}
      />
      <ProcessPaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          console.log("Closing ProcessPaymentModal");
          setShowPaymentModal(false);
        }}
        invoice={selectedInvoice}
        worker={{
          name: selectedInvoice?.workerName,
          id: selectedInvoice?.workerId,
        }}
        onConfirm={(paymentData) => {
          console.log("ProcessPaymentModal confirmed:", paymentData);
          setInvoices((prev) => {
            const updated = prev.map((inv) =>
              inv.id === paymentData.invoiceId
                ? { ...inv, payment: "Paid" }
                : inv
            );
            console.log("Invoices after payment:", updated);
            return updated;
          });
          Swal.fire({
            icon: "success",
            title: "Payment Processed",
            text: `Payment for invoice #${paymentData.invoiceId} marked as paid!`,
            confirmButtonColor: "#2563eb",
          });
        }}
      />
      <BulkPaymentModal
        isOpen={showBulkPaymentModal}
        onClose={() => {
          console.log("Closing BulkPaymentModal");
          setShowBulkPaymentModal(false);
        }}
        invoices={invoices.filter((inv) => selected.includes(inv.id))}
        worker={{
          name: invoices.find((inv) => selected.includes(inv.id))?.workerName,
          id: invoices.find((inv) => selected.includes(inv.id))?.workerId,
        }}
        onConfirm={(data) => {
          console.log("BulkPaymentModal confirmed:", data);
          setInvoices((prev) => {
            const updated = prev.map((inv) =>
              selected.includes(inv.id) ? { ...inv, payment: "Paid" } : inv
            );
            console.log("Invoices after bulk payment:", updated);
            return updated;
          });
          clearSelection();
          Swal.fire({
            icon: "success",
            title: "Bulk Payment Done",
            text: `${data.invoices.length} invoices marked as paid for ${data.worker.name}`,
            confirmButtonColor: "#2563eb",
          });
        }}
      />
      <ViewInvoiceModal
        isOpen={showViewModal}
        onClose={() => {
          console.log("Closing ViewInvoiceModal");
          setShowViewModal(false);
        }}
        invoice={selectedInvoice}
        worker={{
          name: selectedInvoice?.workerName,
          id: selectedInvoice?.workerId,
        }}
      />
      <EditInvoiceModal
        isOpen={showEditModal}
        onClose={() => {
          console.log("Closing EditInvoiceModal");
          setShowEditModal(false);
        }}
        invoice={selectedInvoice}
        onSave={handleUpdateInvoice}
      />
    </div>
  );
}
