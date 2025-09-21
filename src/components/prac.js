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
      projects: "Unassigned",
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
      projects: "Unassigned",
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
      projects: "Unassigned",
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

  // Save handler for edit modal
  const handleUpdateInvoice = (updatedInvoice) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
    setShowEditModal(false);
    Swal.fire({
      icon: "success",
      title: "Invoice Updated",
      text: `Invoice #${updatedInvoice.id} has been updated successfully!`,
      confirmButtonColor: "#2563eb",
    });
  };

  // Filter invoices based on the filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      if (filters.status && invoice.approval !== filters.status) {
        return false;
      }
      if (filters.payment && invoice.payment !== filters.payment) {
        return false;
      }
      if (filters.project && !invoice.projects.includes(filters.project)) {
        return false;
      }
      if (filters.worker) {
        const worker = workers.find((w) => w.id === invoice.workerId);
        if (!worker || worker.name !== filters.worker) {
          return false;
        }
      }
      if (filters.from || filters.to) {
        const invoiceDate = new Date(invoice.date);
        const fromDate = filters.from ? new Date(filters.from) : null;
        const toDate = filters.to ? new Date(filters.to) : null;
        if (fromDate && invoiceDate < fromDate) {
          return false;
        }
        if (toDate && invoiceDate > toDate) {
          return false;
        }
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

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelected([]);
    setSelectedProject("");
  };

  const handleBulkApprove = () => {
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Invoices Selected",
        text: "Please select at least one invoice to approve.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        selected.includes(invoice.id)
          ? { ...invoice, approval: "Approved" }
          : invoice
      )
    );

    Swal.fire({
      icon: "success",
      title: "Invoices Approved",
      text: `${selected.length} invoice${selected.length > 1 ? "s" : ""} successfully approved!`,
      confirmButtonColor: "#2563eb",
    });

    clearSelection();
  };

  const handleBulkPayment = () => {
    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Invoices Selected",
        text: "Please select at least one invoice to mark as paid.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const selectedInvoices = invoices.filter((inv) => selected.includes(inv.id));
    const uniqueWorkers = [...new Set(selectedInvoices.map((inv) => inv.workerId))];

    if (uniqueWorkers.length > 1) {
      Swal.fire({
        icon: "error",
        title: "Multiple Workers Selected",
        text: "Bulk payment can only be processed for invoices of the same worker.",
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
        text: "Please select a project before assigning.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Invoices Selected",
        text: "Please select at least one invoice to assign.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) => {
        if (selected.includes(invoice.id)) {
          return { ...invoice, projects: selectedProject };
        }
        return invoice;
      })
    );

    Swal.fire({
      icon: "success",
      title: "Invoices Assigned",
      text: `${selected.length} invoice${selected.length > 1 ? "s" : ""} successfully assigned to ${selectedProject}!`,
      confirmButtonColor: "#2563eb",
    });

    clearSelection();
  };

  const handleDivideAmount = () => {
    if (!selectedProject) {
      Swal.fire({
        icon: "warning",
        title: "No Project Selected",
        text: "Please select a project before dividing amount.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    if (selected.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Invoices Selected",
        text: "Please select at least one invoice to divide amount.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    // First assign the project to selected invoices
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) => {
        if (selected.includes(invoice.id)) {
          return { ...invoice, projects: selectedProject };
        }
        return invoice;
      })
    );

    // Then open the divide amount modal
    setShowDivideModal(true);
  };

  const getWorkerDisplay = (workerId) => {
    const worker = workers.find((w) => w.id === workerId);
    return worker ? `${worker.name} (${worker.employeeId})` : "Unknown Worker";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {selected.length > 0 && (
        <div className="p-4 flex flex-wrap gap-3 border-b bg-blue-50 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium text-blue-700">
              {selected.length} invoice{selected.length > 1 ? "s" : ""} selected
            </span>
            <button
              onClick={clearSelection}
              className="text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md border border-blue-200 bg-white text-sm font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              className="border rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Assign to Project
            </button>
            <button
              onClick={handleDivideAmount}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Divide Amount
            </button>
            <button
              onClick={handleBulkApprove}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Bulk Approve
            </button>
            <button
              onClick={handleBulkPayment}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Bulk Payment
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 w-12">
                <input
                  type="checkbox"
                  checked={selected.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onChange={() => {
                    if (selected.length === filteredInvoices.length) {
                      clearSelection();
                    } else {
                      setSelected(filteredInvoices.map((inv) => inv.id));
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">Worker & Date</th>
              <th className="p-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">Hours</th>
              <th className="p-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">Projects</th>
              <th className="p-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">Amount</th>
              <th className="p-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">Approval</th>
              <th className="p-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">Payment</th>
              <th className="p-3 font-semibold text-gray-700 text-sm uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 group transition-colors">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(inv.id)}
                    onChange={() => toggleSelect(inv.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-3">
                  <div className="font-medium text-gray-900">
                    {getWorkerDisplay(inv.workerId)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{inv.date}</div>
                </td>
                <td className="p-3 text-gray-600 text-sm">{inv.hours}</td>
                <td className="p-3 text-gray-600 text-sm max-w-xs">
                  <span className={inv.projects === "Unassigned" ? "text-gray-400 italic" : "text-gray-600"}>
                    {inv.projects}
                  </span>
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Daily: ${inv.amount.daily}</div>
                    <div className="text-xs text-gray-500">
                      Extra: {inv.amount.extraHours}
                    </div>
                    <div className="text-xs text-gray-500">
                      Calculated: ${inv.amount.calculated}
                    </div>
                    <div className="text-xs text-gray-500">
                      Adjust: ${inv.amount.adjust}
                    </div>
                    <div className="font-semibold text-blue-700 pt-1 text-sm">
                      Final: ${inv.amount.final}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${
                      inv.approval === "Approved"
                        ? "bg-green-100 text-green-800"
                        : inv.approval === "Pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {inv.approval}
                  </div>
                </td>
                <td className="p-3">
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${
                      inv.payment === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {inv.payment}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setShowViewModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setShowEditModal(true);
                      }}
                      className="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 rounded-md bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setShowPaymentModal(true);
                      }}
                      className="text-amber-600 hover:text-amber-800 text-xs font-medium px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                      Pay
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-sm">No invoices found matching your filters.</p>
          </div>
        )}
      </div>
      
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
        worker={workers.find((w) => w.id === invoices.find((inv) => selected.includes(inv.id))?.workerId)}
        onConfirm={(data) => {
          setInvoices((prev) =>
            prev.map((inv) =>
              selected.includes(inv.id) ? { ...inv, payment: "Paid" } : inv
            )
          );
          clearSelection();
          Swal.fire({
            icon: "success",
            title: "Bulk Payment Processed",
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