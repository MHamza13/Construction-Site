"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "@/redux/projects/ProjectSlice";
import { parseValidationErrors, getErrorMessage, isValidationError } from "@/utils/errorHandler";
import {
  FiFolder,
  FiAlignLeft,
  FiDollarSign,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

export default function AddProjectPage({ onCancel, onProjectAdd }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    name: "",
    status: "Planning", // default status
    description: "",
    budget: "",
    deadline: new Date(),
    client: "",
    location: "",
    startDate: new Date(), // default to current date
    managerId: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.budget.trim()) newErrors.budget = "Budget is required";
    if (!formData.client.trim()) newErrors.client = "Client name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name || "",
        description: formData.description || "",
        budget: parseFloat(formData.budget) || 0,
        deadlineDate:
          formData.deadline?.toISOString() || new Date().toISOString(),
        clientName: formData.client || "",
        startDate:
          formData.startDate?.toISOString() || new Date().toISOString(),
        status: formData.status || "Planning",
        managerId: null,
        ...(formData.location && { location: formData.location }),
        metadata: JSON.stringify({
          phase: "Initial Planning",
          priority: "High",
          permits_required: ["zoning", "environmental"],
        }),
      };

      const result = await dispatch(createProject(payload)).unwrap();

      toast.success("🎉 Project Created! Your project has been successfully added.");

      if (onProjectAdd) onProjectAdd(result); // Notify parent of success
    } catch (err) {
      console.error("Project creation error:", err);

      // Handle API validation errors
      if (isValidationError(err)) {
        const apiErrors = parseValidationErrors(err);
        setErrors(apiErrors);
        toast.error("Please fix the validation errors below and try again.");
      } else {
        // Handle other types of errors
        toast.error(getErrorMessage(err));
      }
    }
  };

  const handleCancel = () => {
    // Clear all errors when canceling
    setErrors({});
    if (onCancel) onCancel();
    else router.push("/projects");
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800 mb-2">
                Please fix the following errors:
              </h3>
              <div className="text-sm text-red-700">
                <ul className="space-y-2">
                  {Object.entries(errors)
                    .filter(([field, message]) => message && message.trim() !== '') // Filter out empty messages
                    .map(([field, message]) => {
                      // Map field names to user-friendly labels
                      const fieldLabels = {
                        name: "Project Name",
                        description: "Description",
                        budget: "Budget",
                        client: "Client Name",
                        location: "Location",
                        status: "Status",
                        deadline: "Deadline"
                      };

                      const fieldLabel = fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').trim();

                      return (
                        <li key={field} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span className="font-medium">{fieldLabel}:</span>
                          <span className="ml-1">{message}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Information Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
              <FiFolder className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
              <p className="text-gray-600 text-sm">Enter the essential details for your project</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <InputField
                  id="name"
                  label="Project Name *"
                  placeholder="e.g., Downtown Office Complex"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<FiFolder />}
                />
              </div>

              <div className="lg:col-span-2">
                <TextAreaField
                  id="description"
                  label="Description *"
                  placeholder="Describe the project scope, objectives, and key deliverables..."
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  icon={<FiAlignLeft />}
                />
              </div>

              <InputField
                id="budget"
                label="Budget *"
                placeholder="e.g., 2,500,000"
                value={formData.budget}
                onChange={handleChange}
                error={errors.budget}
                icon={<FiDollarSign />}
              />
              <InputField
                id="client"
                label="Client Name *"
                placeholder="e.g., ABC Corporation"
                value={formData.client}
                onChange={handleChange}
                error={errors.client}
                icon={<FiUser />}
              />

              <div className="lg:col-span-2">
                <InputField
                  id="location"
                  label="Location"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                  error={errors.location}
                  icon={<FiMapPin />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-2 bg-green-100 rounded-lg shadow-sm">
              <FiTrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Project Details</h3>
              <p className="text-gray-600 text-sm">Set the project status and timeline</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Status *
                </label>
                <div className="relative group">
                  <FiTrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm ${errors.status
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white"
                      } text-gray-900 focus:outline-none`}
                  >
                    <option value="Planning">📋 Planning</option>
                    <option value="Active">🚀 Active</option>
                    <option value="AtRisk">⚠️ At Risk</option>
                    <option value="OnHold">⏸️ On Hold</option>
                  </select>
                </div>
                {errors.status && (
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.status}
                  </div>
                )}
              </div>

              <div className="hidden">
                {/* Start Date hidden but set to current date */}
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => setFormData({ ...formData, startDate: date })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Deadline *
                </label>
                <div className="relative group">
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <DatePicker
                    selected={formData.deadline}
                    onChange={(date) => {
                      setFormData({ ...formData, deadline: date });
                      if (errors.deadline) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.deadline;
                          return newErrors;
                        });
                      }
                    }}
                    minDate={formData.startDate || new Date()}
                    dateFormat="MMMM d, yyyy"
                    className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm ${errors.deadline
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white"
                      } text-gray-900 focus:outline-none`}
                  />
                </div>
                {errors.deadline && (
                  <div className="flex items-center text-red-600 text-sm mt-1">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.deadline}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 cursor-pointer border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ id, label, placeholder, value, onChange, error, icon }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <div className="relative group">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm ${error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white"
            } text-gray-900 placeholder-gray-500 focus:outline-none`}
        />
      </div>
      {error && (
        <div className="flex items-center text-red-600 text-sm mt-1">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <div className="relative group">
        <span className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">{icon}</span>
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={3}
          className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 resize-none text-sm ${error
            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white"
            } text-gray-900 placeholder-gray-500 focus:outline-none`}
        />
      </div>
      {error && (
        <div className="flex items-center text-red-600 text-sm mt-1">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}