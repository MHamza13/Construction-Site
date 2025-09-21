"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createInvoice } from "@/redux/invoice/InvoiceSlice";
import { fetchProjects } from "@/redux/projects/ProjectSlice";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import {
  User,
  Calendar,
  Clock,
  Briefcase,
  DollarSign,
  FileText,
  Settings,
  Plus,
} from "lucide-react";

export default function CreateInvoiceForm({ onSuccess }) {
  const dispatch = useDispatch();

  // Redux states
  const { items: workers, loading: workersLoading } = useSelector(
    (state) => state.workers
  );
  const { items: projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  );
  const { loading } = useSelector((state) => state.invoices);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchWorkers());
    dispatch(fetchProjects());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    worker: "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    overtime: "",
    project: "",
    dailyWage: "",
    extraHours: "",
    clientAdjust: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.worker) newErrors.worker = "Worker is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.hours || formData.hours <= 0)
      newErrors.hours = "Enter valid hours";
    if (!formData.project) newErrors.project = "Project is required";
    if (!formData.dailyWage || formData.dailyWage <= 0)
      newErrors.dailyWage = "Enter valid daily wage";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Find selected worker to get details
      const selectedWorker = workers.find(
        (worker) => worker.id === parseInt(formData.worker)
      );

      // Map formData to API format
      const payload = {
        firstName: selectedWorker ? selectedWorker.firstName : "",
        lastName: selectedWorker ? selectedWorker.lastName : "",
        email: selectedWorker ? selectedWorker.email || "" : "",
        phoneNumber: selectedWorker ? selectedWorker.phoneNumber || "" : "",
        isActive: true,
        profilePictureUrl: selectedWorker
          ? selectedWorker.profilePictureUrl || ""
          : "",
        experience: selectedWorker ? selectedWorker.experience || 0 : 0,
        dailyWages: parseFloat(formData.dailyWage) || 0,
        perHourSalary: 0, // Default, as not in formData
        specializationId: selectedWorker
          ? selectedWorker.specializationId || 0
          : 0,
        // Include other form fields
        date: formData.date,
        hours: parseFloat(formData.hours) || 0,
        overtime: parseFloat(formData.overtime) || 0,
        projectId: parseInt(formData.project) || 0,
        extraHours: parseFloat(formData.extraHours) || 0,
        clientAdjust: parseFloat(formData.clientAdjust) || 0,
        reason: formData.reason || "",
      };

      const resultAction = await dispatch(createInvoice(payload));
      if (createInvoice.fulfilled.match(resultAction)) {
        setFormData({
          worker: "",
          date: new Date().toISOString().split("T")[0],
          hours: "",
          overtime: "",
          project: "",
          dailyWage: "",
          extraHours: "",
          clientAdjust: "",
          reason: "",
        });
        if (onSuccess) onSuccess();
      } else {
        console.error("Failed to create invoice:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6"
      >
        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Basic Information */}
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                  <p className="text-gray-600 text-sm">Worker and project details</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Workers Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Worker *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="worker"
                      value={formData.worker}
                      onChange={handleChange}
                      disabled={workersLoading}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                        errors.worker ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">
                        {workersLoading ? "Loading workers..." : "Select Worker"}
                      </option>
                      {workers?.map((worker) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.firstName} {worker.lastName} —{" "}
                          {worker.specializationName}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.worker && (
                    <div className="flex items-center text-red-600 text-sm mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.worker}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.date}
                    </div>
                  )}
                </div>

                {/* Working Hours */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Working Hours *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="hours"
                      placeholder="Enter hours"
                      value={formData.hours}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                        errors.hours ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.hours && (
                    <div className="flex items-center text-red-600 text-sm mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.hours}
                    </div>
                  )}
                </div>

                {/* Overtime Hours */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Overtime Hours
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="overtime"
                      placeholder="Enter overtime hours"
                      value={formData.overtime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Projects Dropdown */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Project *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      disabled={projectsLoading}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none ${
                        errors.project ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">
                        {projectsLoading ? "Loading projects..." : "Select Project"}
                      </option>
                      {projects?.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name} — {project.status}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.project && (
                    <div className="flex items-center text-red-600 text-sm mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.project}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Financial Details */}
          <div className="space-y-6">
            {/* Financial Details Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Financial Details</h3>
                  <p className="text-gray-600 text-sm">Wages and adjustments</p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Daily Wage */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Daily Wage ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="dailyWage"
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
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.dailyWage}
                    </div>
                  )}
                </div>

                {/* Extra Hours Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Extra Hours Amount ($)
                  </label>
                  <div className="relative">
                    <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="extraHours"
                      placeholder="Enter extra hours amount"
                      value={formData.extraHours}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Client Adjustment */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Client Adjustment ($)
                  </label>
                  <div className="relative">
                    <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="clientAdjust"
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
                  <p className="text-gray-600 text-sm">Reason and notes</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Reason */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Reason
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      name="reason"
                      placeholder="Enter reason for invoice"
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none resize-y"
                      rows="3"
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
            onClick={() => window.history.back()}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
