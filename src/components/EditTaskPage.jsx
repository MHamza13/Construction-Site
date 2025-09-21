"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Redux actions
import {
  fetchTaskById,
  updateTask,
  clearCurrentTask,
} from "@/redux/task/TaskSlice";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import { fetchProjects } from "@/redux/projects/ProjectSlice";

// Icons
import {
  ClipboardList,
  FolderKanban,
  Flag,
  CalendarDays,
  FileText,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentTask, loading, error } = useSelector((state) => state.tasks);
  const { items: workers } = useSelector((state) => state.workers);
  const { items: projects } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
    priority: "Low",
    deadline: "",
    estimatedHours: "",
    description: "",
    status: "NotStarted",
  });

  const [assignedWorkers, setAssignedWorkers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Fetch task + workers + projects
  useEffect(() => {
    if (id) dispatch(fetchTaskById(id));
    dispatch(fetchWorkers());
    dispatch(fetchProjects());
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [id, dispatch]);

  // 🔹 Prefill task data
  useEffect(() => {
    if (currentTask) {
      setFormData({
        name: currentTask.name || "",
        projectId: currentTask.projectId?.toString() || "",
        priority: currentTask.priority || "Low",
        deadline: currentTask.deadline
          ? new Date(currentTask.deadline).toISOString().split('T')[0]
          : "",
        estimatedHours: currentTask.estimatedHours?.toString() || "",
        description: currentTask.description || "",
        status: currentTask.status || "NotStarted",
      });
      setAssignedWorkers(currentTask.assignedUserIds || []);
    }
  }, [currentTask]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.name.trim()) newErrors.name = "Task name is required";
    if (!formData.projectId) newErrors.projectId = "Project is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (assignedWorkers.length === 0) newErrors.workers = "At least one worker must be assigned";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleWorkerSelection = (id) => {
    setAssignedWorkers((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedData = {
        id: parseInt(id), // Task ID
        projectId: parseInt(formData.projectId) || 0,
        name: formData.name,
        description: formData.description,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : null,
        priority: formData.priority,
        status: formData.status,
        estimatedHours: parseInt(formData.estimatedHours) || 0,
        actualHours:
          currentTask?.actualHours !== undefined &&
            currentTask?.actualHours !== null
            ? currentTask.actualHours
            : 0,
        metadata:
          currentTask?.metadata ||
          (typeof window !== "undefined" ? window.location.href : ""),
        assignedUserIds: assignedWorkers,
      };

      await dispatch(updateTask({ id, updatedData })).unwrap();

      toast.success("Task updated successfully!");
      router.push("/tasks");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading task...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {typeof error === 'string' ? error : error.message || 'An error occurred'}
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <p className="text-gray-600 text-center">Task not found.</p>
        </div>
      </div>
    );
  }

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const statusOptions = [
    { value: "NotStarted", label: "Not Started" },
    { value: "InProgress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push("/tasks")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Edit Task</h1>
                <p className="text-gray-600 text-sm">Update the details for {formData.name}</p>
              </div>
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 shadow-sm">
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
                            .filter(([field, message]) => message && message.trim() !== '')
                            .map(([field, message]) => {
                              const fieldLabels = {
                                name: "Task Name",
                                projectId: "Project",
                                workers: "Workers",
                                description: "Description",
                                priority: "Priority",
                                deadline: "Deadline",
                                estimatedHours: "Estimated Hours",
                                status: "Status"
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
                {/* Main Content - Side by Side Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Form Fields */}
                  <div className="space-y-6">
                    {/* Task Information Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex items-center space-x-3 mb-5">
                        <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                          <ClipboardList className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Task Information</h3>
                          <p className="text-gray-600 text-sm">Enter the essential details for your task</p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <InputField
                          id="name"
                          label="Task Name *"
                          placeholder="e.g., Design Homepage Layout"
                          value={formData.name}
                          onChange={handleInputChange}
                          error={errors.name}
                          icon={<ClipboardList />}
                        />

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Project *
                          </label>
                          <div className="relative group">
                            <FolderKanban className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                              name="projectId"
                              value={formData.projectId}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm ${errors.projectId
                                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50"
                                : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white"
                                } text-gray-900 focus:outline-none`}
                            >
                              <option value="" disabled>
                                Select a project
                              </option>
                              {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                  {project.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {errors.projectId && (
                            <div className="flex items-center text-red-600 text-sm mt-1">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.projectId}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Priority
                          </label>
                          <div className="relative group">
                            <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                              name="priority"
                              value={formData.priority}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                            >
                              {priorityOptions.map((p) => (
                                <option key={p.value} value={p.value}>
                                  {p.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Deadline
                          </label>
                          <div className="relative group">
                            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                              type="date"
                              name="deadline"
                              value={formData.deadline}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Estimated Hours
                          </label>
                          <div className="relative group">
                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                              type="number"
                              name="estimatedHours"
                              value={formData.estimatedHours}
                              onChange={handleInputChange}
                              min="0"
                              className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                            />
                          </div>
                        </div>

                        <TextAreaField
                          id="description"
                          label="Description"
                          placeholder="Describe the task..."
                          value={formData.description}
                          onChange={handleInputChange}
                          error={errors.description}
                          icon={<FileText />}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Task Details and Workers Assignment */}
                  <div className="space-y-6">
                    {/* Task Details Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex items-center space-x-3 mb-5">
                        <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                          <Flag className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Task Details</h3>
                          <p className="text-gray-600 text-sm">Set the task status</p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Status
                          </label>
                          <div className="relative group">
                            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                            >
                              {statusOptions.map((s) => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Workers Assignment Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
                      <div className="flex items-center space-x-3 mb-5">
                        <div className="p-2 bg-purple-100 rounded-lg shadow-sm">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Assign Workers</h3>
                          <p className="text-gray-600 text-sm">Select workers for this task</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Assign Workers *
                          </label>
                          {errors.workers && (
                            <div className="flex items-center text-red-600 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {errors.workers}
                            </div>
                          )}

                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border border-gray-200 rounded-lg p-3 bg-white">
                            {workers.map((worker) => (
                              <div
                                key={worker.id}
                                onClick={() => toggleWorkerSelection(worker.id)}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${assignedWorkers.includes(worker.id)
                                  ? "bg-blue-50 border border-blue-200"
                                  : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                                  }`}
                              >
                                <div>
                                  <p className="font-medium text-gray-800 text-sm">
                                    {worker.firstName} {worker.lastName}
                                  </p>
                                  {worker.specializationName ? (
                                    <p className="text-xs text-gray-500">
                                      {worker.specializationName}
                                    </p>
                                  ) : null}
                                </div>
                                {assignedWorkers.includes(worker.id) && (
                                  <span className="text-blue-600 font-medium text-sm">✓</span>
                                )}
                              </div>
                            ))}
                          </div>

                          <p className="text-xs text-gray-500">
                            {assignedWorkers.length} worker
                            {assignedWorkers.length !== 1 ? "s" : ""} selected
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push("/tasks")}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? "Updating..." : "Update Task"}
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