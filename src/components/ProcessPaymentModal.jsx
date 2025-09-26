"use client";
import { useState } from "react";
import {
  X,
  CreditCard,
  Upload,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function ProcessPaymentModal({
  isOpen,
  onClose,
  invoice,
  worker,
  onConfirm,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [receipt, setReceipt] = useState(null);
  const [notes, setNotes] = useState("");

  if (!isOpen || !invoice) return null;

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invoice.totals.totalPay) {
      alert("⚠️ Cannot process payment for invoice with no total pay.");
      return;
    }
    const paymentData = {
      invoiceId: invoice.id,
      worker,
      paymentMethod,
      receipt: receipt ? receipt.name : null,
      notes,
    };
    onConfirm(paymentData);
    onClose();
  };

  // Derive display date from payPeriod or first shift date
  const displayDate =
    invoice.payPeriod ||
    (invoice.ShiftDetails?.[0]?.date
      ? new Date(invoice.ShiftDetails[0].date).toLocaleDateString()
      : "N/A");

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
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Process Payment</h2>
              <p className="text-blue-100 text-sm">
                Complete payment for invoice #{invoice.id}
              </p>
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/30 rounded-2xl -z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Invoice Information */}
              <div className="space-y-6">
                {/* Invoice Summary Section */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Invoice Summary
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Payment details and worker information
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {worker?.name?.charAt(0) || "W"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {worker?.name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Worker ID: #{worker?.id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-500">
                            Pay Period:
                          </span>
                          <p className="font-semibold text-gray-900 text-sm">
                            {displayDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <span className="text-sm text-gray-500">
                            Invoice ID:
                          </span>
                          <p className="font-semibold text-gray-900 text-sm">
                            #{invoice.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-500">
                            Amount Due:
                          </span>
                        </div>
                        <span className="text-2xl font-bold text-green-700">
                          $
                          {invoice.totals.totalPay
                            ? invoice.totals.totalPay.toFixed(2)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Requirements Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Payment Requirements
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Steps to complete payment processing
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">
                          1
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Upload a payment receipt or proof of payment
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">
                          2
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Select the payment method used
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">
                          3
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Add notes if needed for record keeping
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Payment Form */}
              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-2 bg-purple-100 rounded-lg shadow-sm">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Payment Method
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Select how the payment was made
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {["Bank Transfer", "Check", "Cash"].map((method) => (
                        <label
                          key={method}
                          className={`relative block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            paymentMethod === method
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-medium ${
                                paymentMethod === method
                                  ? "text-green-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {method}
                            </span>
                            {paymentMethod === method && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Receipt Upload Section */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-2 bg-amber-100 rounded-lg shadow-sm">
                        <Upload className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Payment Receipt
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Upload proof of payment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center w-full">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 ${
                          receipt
                            ? "border-green-500 bg-green-50"
                            : "border-gray-300"
                        } border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors`}
                      >
                        <div className="flex flex-col items-center justify-center pt-6 pb-6">
                          <Upload className="w-10 h-10 mb-4 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            {receipt ? (
                              <span className="font-medium text-green-600">
                                {receipt.name}
                              </span>
                            ) : (
                              <>
                                <span className="font-medium">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Payment Notes
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Additional information (optional)
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                      rows="4"
                      placeholder="Add any notes about this payment..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={!receipt || !invoice.totals.totalPay}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Process Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
