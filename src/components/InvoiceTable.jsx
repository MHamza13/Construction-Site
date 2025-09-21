"use client";
import { useState, useMemo } from "react";
import { projects } from "@/data/projects";
import workers from "@/data/workers.json";
import DivideAmountModal from "@/components/DivideAmountModal";
import ProcessPaymentModal from "@/components/ProcessPaymentModal";
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
} from "lucide-react";

export default function InvoiceTable({ filters = {} }) {
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
      date: "Mar 17, 2024",
      hours: "8h + 2h OT",
      projects: "Downtown Office Complex, Residential Tower A",
      amount: {
        daily: 120,
        extraHours: "2 × $22.50 = $45",
        calculated: 165,
        adjust: 165,
        final: 165,
      },
      approval: "Approved",
      payment: "Unpaid",
      reason: "Standard work hours plus overtime for urgent task completion",
    },
    {
      id: 2,
      workerId: 1,
      date: "Mar 16, 2024",
      hours: "8h + 3h OT",
      projects: "Downtown Office Complex",
      amount: {
        daily: 120,
        extraHours: "3 × $18.33 = $55",
        calculated: 175,
        adjust: 175,
        final: 175,
      },
      approval: "Pending",
      payment: "Unpaid",
      reason: "Extended overtime for critical project milestone",
    },
    {
      id: 3,
      workerId: 2,
      date: "Mar 15, 2024",
      hours: "8h + 1h OT",
      projects: "Residential Tower A",
      amount: {
        daily: 120,
        extraHours: "1 × $30.00 = $30",
        calculated: 150,
        adjust: 150,
        final: 150,
      },
      approval: "Not Approved",
      payment: "Paid",
      reason: "Initial site preparation work",
    },
  ]);

  // Delete handler
  const handleDelete = (id) => {
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
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        Swal.fire("Deleted!", "Invoice has been deleted.", "success");
      }
    });
  };

  // Save handler
  const handleUpdateInvoice = (updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
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
    return invoices.filter((invoice) => {
      if (filters.status && invoice.approval !== filters.status) return false;
      if (filters.payment && invoice.payment !== filters.payment) return false;
      if (filters.project && !invoice.projects.includes(filters.project))
        return false;
      if (filters.worker) {
        const worker = workers.find((w) => w.id === invoice.workerId);
        if (!worker || worker.name !== filters.worker) return false;
      }
      if (filters.from || filters.to) {
        const invoiceDate = new Date(invoice.date);
        const fromDate = filters.from ? new Date(filters.from) : null;
        const toDate = filters.to ? new Date(filters.to) : null;
        if (fromDate && invoiceDate < fromDate) return false;
        if (toDate && invoiceDate > toDate) return false;
      }
      if (filters.search) {
        const worker = workers.find((w) => w.id === invoice.workerId);
        const workerName = worker ? worker.name : "";
        const workerId = worker ? worker.employeeId : "";
        if (
          !workerName.toLowerCase().includes(filters.search.toLowerCase()) &&
          !workerId.toLowerCase().includes(filters.search.toLowerCase()) &&
          !invoice.id.toString().includes(filters.search)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [invoices, filters, workers]);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const clearSelection = () => {
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
    setInvoices((prev) =>
      prev.map((inv) =>
        selected.includes(inv.id) ? { ...inv, approval: "Approved" } : inv
      )
    );
    Swal.fire({
      icon: "success",
      title: "Invoices Approved",
      text: `${selected.length} invoice(s) approved successfully!`,
      confirmButtonColor: "#2563eb",
    });
    clearSelection();
  };

  const handleBulkPayment = () => {
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
    setInvoices((prev) =>
      prev.map((inv) =>
        selected.includes(inv.id) ? { ...inv, projects: selectedProject } : inv
      )
    );
    Swal.fire({
      icon: "success",
      title: "Invoices Assigned",
      text: `${selected.length} invoice(s) assigned to ${selectedProject}!`,
      confirmButtonColor: "#2563eb",
    });
    clearSelection();
  };

  const getWorkerDisplay = (workerId) => {
    const worker = workers.find((w) => w.id === workerId);
    return worker ? `${worker.name} (${worker.employeeId})` : "Unknown Worker";
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-blue-50/30 rounded-2xl -z-10"></div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Invoice Records</h3>
                <p className="text-gray-600 text-sm">
                  {filteredInvoices.length} {filteredInvoices.length === 1 ? "invoice" : "invoices"} found
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="p-4 flex flex-wrap gap-3 border-b bg-blue-50 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-blue-700">
                {selected.length} invoice{selected.length > 1 ? "s" : ""} selected
              </span>
              <button
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAssignToProject}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Assign
              </button>
              <button
                onClick={() => setShowDivideModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Divide
              </button>
              <button
                onClick={handleBulkApprove}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Approve
              </button>
              <button
                onClick={handleBulkPayment}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Pay
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === filteredInvoices.length &&
                      filteredInvoices.length > 0
                    }
                    onChange={() => {
                      if (selected.length === filteredInvoices.length) {
                        clearSelection();
                      } else {
                        setSelected(filteredInvoices.map((inv) => inv.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Worker & Date
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Approval
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((inv, index) => (
                <tr key={inv.id} className={`hover:bg-blue-50/50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(inv.id)}
                      onChange={() => toggleSelect(inv.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getWorkerDisplay(inv.workerId).charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {getWorkerDisplay(inv.workerId)}
                        </div>
                        <div className="text-gray-500 text-xs">{inv.date}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 text-sm font-medium">{inv.hours}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <span className="text-gray-700 text-sm">{inv.projects}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        Daily: ${inv.amount.daily}
                      </div>
                      <div className="text-xs text-gray-500">
                        Extra: {inv.amount.extraHours}
                      </div>
                      <div className="text-xs text-gray-500">
                        Calc: ${inv.amount.calculated}
                      </div>
                      <div className="text-xs text-gray-500">
                        Adjust: ${inv.amount.adjust}
                      </div>
                      <div className="font-bold text-blue-700 text-sm pt-1">
                        Final: ${inv.amount.final}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
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
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          inv.payment === "Paid"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                    >
                      {inv.payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowViewModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition-colors border border-blue-200"
                        title="View Invoice"
                      >
                        <Eye className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowEditModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium transition-colors border border-green-200"
                        title="Edit Invoice"
                      >
                        <Edit className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition-colors border border-red-200"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowPaymentModal(true);
                        }}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-medium transition-colors border border-amber-200"
                        title="Process Payment"
                      >
                        <DollarSign className="w-3 h-3" />
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

        {/* Modals */}
        <DivideAmountModal
          isOpen={showDivideModal}
          onClose={() => setShowDivideModal(false)}
          invoices={invoices.filter((inv) => selected.includes(inv.id))}
        />
        <ProcessPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          invoice={selectedInvoice}
          worker={workers.find((w) => w.id === selectedInvoice?.workerId)}
        />
        <BulkPaymentModal
          isOpen={showBulkPaymentModal}
          onClose={() => setShowBulkPaymentModal(false)}
          invoices={invoices.filter((inv) => selected.includes(inv.id))}
          worker={workers.find(
            (w) =>
              w.id === invoices.find((inv) => selected.includes(inv.id))?.workerId
          )}
          onConfirm={(data) => {
            setInvoices((prev) =>
              prev.map((inv) =>
                selected.includes(inv.id) ? { ...inv, payment: "Paid" } : inv
              )
            );
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
          onClose={() => setShowViewModal(false)}
          invoice={selectedInvoice}
          worker={workers.find((w) => w.id === selectedInvoice?.workerId)}
        />
        <EditInvoiceModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          invoice={selectedInvoice}
          onSave={handleUpdateInvoice}
        />
      </div>
  );
}
