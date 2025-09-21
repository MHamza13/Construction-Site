"use client";
import { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineUpload,
  AiOutlineCheck,
} from "react-icons/ai";
import { FaMoneyCheckAlt, FaWallet, FaUniversity } from "react-icons/fa";

export default function BulkPaymentModal({
  isOpen,
  onClose,
  invoices = [],
  worker,
  onConfirm,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [receipt, setReceipt] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || invoices.length === 0) return null;

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount.final, 0);

  const handleFileChange = (e) => setReceipt(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm({
        worker,
        invoices,
        totalAmount,
        paymentMethod,
        receipt,
        notes,
        paymentDate: new Date().toLocaleDateString(),
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const paymentMethods = [
    {
      id: "bank",
      label: "Bank Transfer",
      icon: <FaUniversity className="w-6 h-6 mx-auto" />,
    },
    {
      id: "check",
      label: "Check",
      icon: <FaMoneyCheckAlt className="w-6 h-6 mx-auto" />,
    },
    {
      id: "cash",
      label: "Cash",
      icon: <FaWallet className="w-6 h-6 mx-auto" />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 cursor-pointer right-4 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition"
        >
          <AiOutlineClose className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Bulk Payment Processing
          </h2>
          <p className="text-blue-600 font-medium">
            Process multiple invoices at once
          </p>
        </div>

        <form className="px-8 py-6 space-y-6">
          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-md p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <AiOutlineCheck className="w-5 h-5 text-emerald-600" />
              Payment Summary
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Worker:</span>
                  <span className="font-semibold text-gray-900">
                    {worker?.name}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Employee ID:</span>
                  <span className="font-semibold text-gray-900">
                    {worker?.employeeId}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Invoices:</span>
                  <span className="font-semibold text-gray-900">
                    {invoices.length}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Payment Date:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-200 flex justify-between items-center">
              <span className="text-lg font-semibold text-emerald-800">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-emerald-700">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-gray-50 rounded-md p-6 shadow-sm max-h-48 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaMoneyCheckAlt className="w-5 h-5 text-gray-600" /> Invoice
              Details
            </h3>
            <div className="space-y-3">
              {invoices.map((inv, index) => (
                <div
                  key={inv.id}
                  className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200 hover:border-blue-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Invoice #{inv.id}
                      </div>
                      <div className="text-sm text-gray-500">{inv.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-700">
                      ${inv.amount.final.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">{inv.hours}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`cursor-pointer p-4 rounded-md border-2 flex flex-col items-center transition-all duration-200 ${
                    paymentMethod === method.label
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={method.label}
                    checked={paymentMethod === method.label}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-2xl mb-2">{method.icon}</div>
                  <div
                    className={`font-medium ${
                      paymentMethod === method.label
                        ? "text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    {method.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Payment Receipt
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/png, image/jpeg, application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition">
                <AiOutlineUpload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-600 font-medium">
                  {receipt ? receipt.name : "Click to upload receipt"}
                </span>
                <span className="text-sm text-gray-400 mt-1">
                  PNG, JPG or PDF (Max 10MB)
                </span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Payment Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              rows="4"
              placeholder="Add any notes about this bulk payment..."
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-md cursor-pointer bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-md cursor-pointer bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:from-emerald-700 hover:to-green-700 transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Processing..." : "Process Bulk Payment"}
              {isSubmitting ? (
                <AiOutlineCheck className="animate-spin w-5 h-5" />
              ) : (
                <AiOutlineCheck className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
