"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById, updateProject } from "@/redux/projects/ProjectSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import {
  FiFolder,
  FiAlignLeft,
  FiDollarSign,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    currentProject: project,
    loading,
    error,
  } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    name: "",
    status: "Planning",
    description: "",
    budget: "",
    deadline: new Date(),
    client: "",
    location: "",
    startDate: new Date(),
    managerId: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch project by ID
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  // Populate form with project data
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        status: project.status || "Planning",
        description: project.description || "",
        budget: project.budget ? project.budget.toString() : "",
        deadline: project.deadlineDate
          ? new Date(project.deadlineDate)
          : new Date(),
        client: project.clientName || "",
        location: project.location || "",
        startDate: project.startDate ? new Date(project.startDate) : new Date(),
        managerId: project.managerId || null,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.budget.trim()) newErrors.budget = "Budget is required";
    if (!formData.client.trim()) newErrors.client = "Client name is required";
    if (
      formData.budget &&
      !/^\$?[0-9,]+(\.\d{1,2})?[KMB]?$/.test(formData.budget)
    ) {
      newErrors.budget =
        "Please enter a valid budget format (e.g., $1.5M or 1500000)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        budget: parseFloat(formData.budget.replace(/[$,KMB]/g, "")) || 0,
        deadlineDate: formData.deadline.toISOString(),
        clientName: formData.client,
        startDate: formData.startDate.toISOString(),
        status: formData.status,
        managerId: formData.managerId,
        ...(formData.location && { location: formData.location }),
        metadata: JSON.stringify({
          phase: "Initial Planning",
          priority: "High",
          permits_required: ["zoning", "environmental"],
        }),
      };

      await dispatch(updateProject({ id, updatedData: payload })).unwrap();

      toast.success("Project updated successfully!");
      router.push("/projects");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error(error.message || "There was an error updating the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: "Planning", label: "Planning" },
    { value: "Active", label: "Active" },
    { value: "AtRisk", label: "At Risk" },
    { value: "OnHold", label: "On Hold" },
  ];

  // Loader / Error handling
  if (loading) {
    return <div className="p-6 text-center">Loading project...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The project you are looking for does not exist.
          </p>
          <button
            onClick={() => router.push("/projects")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
          >
            Back to Projects
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Projects
              </button>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-800">Edit Project</h1>
              <p className="text-gray-600 text-sm">Update the details for {project.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm overflow-hidden">
          <div className="p-4">
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information Section */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                      <FiFolder className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                      <p className="text-gray-600 text-sm">Enter the essential details for your project</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                          placeholder="Describe the project scope, objectives..."
                          value={formData.description}
                          onChange={handleChange}
                          error={errors.description}
                          icon={<FiAlignLeft />}
                        />
                      </div>

                      <InputField
                        id="budget"
                        label="Budget *"
                        placeholder="2500000"
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
                          icon={<FiMapPin />}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                      <FiTrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Project Details</h3>
                      <p className="text-gray-600 text-sm">Set the project status and timeline</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      </div>

                      <div className="hidden">
                        {/* Start Date hidden but kept for consistency */}
                        <DatePicker
                          selected={formData.startDate}
                          onChange={(date) =>
                            setFormData({ ...formData, startDate: date })
                          }
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push("/projects")}
                    className="px-6 py-2.5 cursor-pointer border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
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
        <span className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">{icon}</span>
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