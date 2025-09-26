"use client";
import { useState } from "react";
import InvoiceDashboard from "@/components/InvoiceDashboard";
import InvoiceFilters from "@/components/InvoiceFilters";
import InvoiceTable from "@/components/InvoiceTable";
import CreateInvoiceForm from "@/components/CreateInvoiceForm";
import { FileText, Plus } from "lucide-react";

export default function InvoicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    payment: "",
    project: "",
    worker: "",
    from: "",
    to: "",
    search: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Invoice Management</h1>
              <p className="text-gray-600 text-sm">Manage worker invoices and payments</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Content */}
        <div className="bg-white shadow-sm overflow-hidden">
          <div className="p-6">
            {/* Top Action Bar */}
            <div className="flex justify-between items-center mb-8">
              <div></div>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            </div>

            {/* Dashboard Section */}
            <div className="mb-8">
              <InvoiceDashboard />
            </div>

            {/* Filters Section */}
            <div className="mb-8">
              <InvoiceFilters onFilterChange={handleFilterChange} />
            </div>

            {/* Invoice Table */}
            <div>
              <InvoiceTable filters={filters} />
            </div>
          </div>
        </div>

        {/* Modal Popup */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-4xl xl:max-w-6xl max-h-[95vh] bg-white shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Invoice</h2>
                    <p className="text-blue-100 text-sm">Add a new invoice for worker payment</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
                <CreateInvoiceForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
