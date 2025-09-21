"use client";
import { useState, useEffect } from "react";
import { projects } from "@/data/projects";
import workers from "@/data/workers.json";
import { X, User, Calendar, Clock, Briefcase, DollarSign, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function EditInvoiceModal({ isOpen, onClose, invoice, onSave }) {
  const [formData, setFormData] = useState({
    id: "",
    workerId: "",
    date: "",
    regularHours: "",
    overtimeHours: "",
    project: "",
    dailyWage: "",
    extraHoursAmount: "",
    clientAdjust: "",
    reason: "",
    approval: "",
    payment: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (invoice) {
      const [regular, overtime] = invoice.hours.split(" + ");
      const regularHours = regular ? parseFloat(regular.replace("h", "")) : "";
      const overtimeHours = overtime
        ? parseFloat(overtime.replace("h OT", ""))
        : "";

      setFormData({
        id: invoice.id || "",
        workerId: invoice.workerId || "",
        date: invoice.date
          ? new Date(invoice.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        regularHours,
        overtimeHours,
        project: invoice.projects ? invoice.projects.split(", ")[0] : "",
        dailyWage: invoice.amount?.daily || "",
        extraHoursAmount: invoice.amount?.extraHours
          ? parseFloat(
              invoice.amount.extraHours.split(" = ")[1].replace("$", "")
            )
          : "",
        clientAdjust: invoice.amount?.adjust || "",
        reason: invoice.reason || "",
        approval: invoice.approval || "Pending",
        payment: invoice.payment || "Unpaid",
      });
      setTouched({});
      setErrors({});
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.workerId) newErrors.workerId = "Worker is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.regularHours || formData.regularHours <= 0)
      newErrors.regularHours = "Enter valid regular hours";
    if (!formData.project) newErrors.project = "Project is required";
    if (!formData.dailyWage || formData.dailyWage <= 0)
      newErrors.dailyWage = "Enter valid daily wage";
    if (formData.overtimeHours && formData.overtimeHours < 0)
      newErrors.overtimeHours = "Overtime hours cannot be negative";
    if (formData.extraHoursAmount && formData.extraHoursAmount < 0)
      newErrors.extraHoursAmount = "Extra hours amount cannot be negative";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedInvoice = {
      id: formData.id,
      workerId: formData.workerId,
      date: formData.date,
      hours: formData.overtimeHours
        ? `${formData.regularHours}h + ${formData.overtimeHours}h OT`
        : `${formData.regularHours}h`,
      projects: formData.project,
      amount: {
        daily: parseFloat(formData.dailyWage),
        extraHours: formData.extraHoursAmount
          ? `${formData.overtimeHours} × $${(
              formData.extraHoursAmount / (formData.overtimeHours || 1)
            ).toFixed(2)} = $${formData.extraHoursAmount}`
          : "",
        calculated:
          parseFloat(formData.dailyWage) +
          (parseFloat(formData.extraHoursAmount) || 0),
        adjust:
          parseFloat(formData.clientAdjust) ||
          parseFloat(formData.dailyWage) +
            (parseFloat(formData.extraHoursAmount) || 0),
        final:
          parseFloat(formData.clientAdjust) ||
          parseFloat(formData.dailyWage) +
            (parseFloat(formData.extraHoursAmount) || 0),
      },
      approval: formData.approval,
      payment: formData.payment,
      reason: formData.reason,
    };

    onSave(updatedInvoice);
  };

  const IconInput = ({ icon, children }) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      {children}
    </div>
  );

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
              <h2 className="text-xl font-bold text-white">Edit Invoice</h2>
              <p className="text-blue-100 text-sm">Update invoice details - ID: {invoice.id}</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Basic Information */}
                <div className="space-y-6">
                  {/* Worker & Date Section */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                        <p className="text-gray-600 text-sm">Worker and date details</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Worker */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Worker <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <select
                            name="workerId"
                            value={formData.workerId}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                              errors.workerId ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Select Worker</option>
                            {workers.map((worker) => (
                              <option key={worker.id} value={worker.id}>
                                {worker.name} — {worker.role}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.workerId && (
                          <div className="flex items-center text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.workerId}
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                              errors.date ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.date && (
                          <div className="flex items-center text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.date}
                          </div>
                        )}
                      </div>

                      {/* Project */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Project <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <select
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                              errors.project ? "border-red-500" : ""
                            }`}
                          >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                              <option key={project.id} value={project.name}>
                                {project.name} — {project.status}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.project && (
                          <div className="flex items-center text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.project}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hours Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Working Hours</h3>
                        <p className="text-gray-600 text-sm">Regular and overtime hours</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Regular Hours */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Regular Hours <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            name="regularHours"
                            min="0"
                            step="0.5"
                            placeholder="Enter regular hours"
                            value={formData.regularHours}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                              errors.regularHours ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.regularHours && (
                          <div className="flex items-center text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.regularHours}
                          </div>
                        )}
                      </div>

                      {/* Overtime Hours */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Overtime Hours
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            name="overtimeHours"
                            min="0"
                            step="0.5"
                            placeholder="Enter overtime hours"
                            value={formData.overtimeHours}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Financial Details */}
                <div className="space-y-6">
                  {/* Financial Details Section */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-2 bg-amber-100 rounded-lg shadow-sm">
                        <DollarSign className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Financial Details</h3>
                        <p className="text-gray-600 text-sm">Wages and adjustments</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Daily Wage */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Daily Wage ($) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            name="dailyWage"
                            min="0"
                            step="0.01"
                            placeholder="Enter daily wage"
                            value={formData.dailyWage}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                              errors.dailyWage ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {errors.dailyWage && (
                          <div className="flex items-center text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.dailyWage}
                          </div>
                        )}
                      </div>

                      {/* Extra Hours Amount */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Extra Hours Amount ($)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            name="extraHoursAmount"
                            min="0"
                            step="0.01"
                            placeholder="Enter extra hours amount"
                            value={formData.extraHoursAmount}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Client Adjustment */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Client Adjustment ($)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            name="clientAdjust"
                            step="0.01"
                            placeholder="Enter client adjustment"
                            value={formData.clientAdjust}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="p-2 bg-purple-100 rounded-lg shadow-sm">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Additional Information</h3>
                        <p className="text-gray-600 text-sm">Notes and remarks</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Reason */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Reason
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                          <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Enter reason or notes..."
                            className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={
                    !formData.workerId ||
                    !formData.date ||
                    !formData.regularHours ||
                    !formData.project ||
                    !formData.dailyWage
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
