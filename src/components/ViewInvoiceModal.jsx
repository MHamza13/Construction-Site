"use client";

import { X, User, Calendar, Clock, Briefcase, DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function ViewInvoiceModal({ isOpen, onClose, invoice, worker }) {
  if (!isOpen || !invoice) return null;

  // Determine status colors
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white shadow-2xl w-full max-w-6xl xl:max-w-7xl max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Invoice Details</h2>
              <p className="text-blue-100 text-sm">Invoice #{invoice.id} - {worker?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
          <div className="w-full mx-auto relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Invoice Information */}
              <div className="space-y-6">
                {/* Worker Information Section */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Worker Information</h3>
                      <p className="text-gray-600 text-sm">Employee details and contact</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {worker?.name?.charAt(0) || 'W'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{worker?.name}</h4>
                        <p className="text-gray-600 text-sm">Employee ID: {worker?.employeeId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Details Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Invoice Details</h3>
                      <p className="text-gray-600 text-sm">Date and status information</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Invoice Date:</span>
                      <span className="font-semibold text-gray-900">{invoice.date}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Invoice ID:</span>
                      <span className="font-semibold text-gray-900">#{invoice.id}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Approval:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            invoice.approval === "Approved"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : invoice.approval === "Pending"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {invoice.approval}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Payment:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            invoice.payment === "Paid"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {invoice.payment}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Details Section */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-purple-100 rounded-lg shadow-sm">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Work Details</h3>
                      <p className="text-gray-600 text-sm">Hours and project information</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Hours Worked:</span>
                      <span className="font-semibold text-gray-900">{invoice.hours}</span>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-500">Projects:</span>
                        <p className="text-gray-900 font-medium text-sm mt-1">{invoice.projects}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Financial Breakdown */}
              <div className="space-y-6">
                {/* Amount Breakdown Section */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-amber-100 rounded-lg shadow-sm">
                      <DollarSign className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Amount Breakdown</h3>
                      <p className="text-gray-600 text-sm">Detailed financial calculation</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Daily Rate:</span>
                      <span className="font-semibold text-gray-900">${invoice.amount.daily}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Extra Hours:</span>
                      <span className="font-semibold text-gray-900">{invoice.amount.extraHours}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Calculated Amount:</span>
                      <span className="font-semibold text-gray-900">${invoice.amount.calculated}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Adjustments:</span>
                      <span className="font-semibold text-gray-900">${invoice.amount.adjust}</span>
                    </div>

                    <div className="flex justify-between items-center py-4 bg-blue-50 rounded-lg px-4">
                      <span className="text-gray-900 font-bold text-lg">Final Amount:</span>
                      <span className="font-bold text-blue-700 text-xl">${invoice.amount.final}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Additional Information</h3>
                      <p className="text-gray-600 text-sm">Notes and remarks</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {invoice.reason && (
                      <div>
                        <span className="text-sm text-gray-500">Reason:</span>
                        <p className="text-gray-900 text-sm mt-1 bg-white p-3 rounded-lg border border-gray-200">
                          {invoice.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
