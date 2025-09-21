"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ClipboardList,
  CalendarDays,
  Flag,
  CheckCircle,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import { createSubtask } from "@/redux/subTask/SubTaskSlice";

export default function AddWorkPackagePage({
  onCancel,
  taskId,
  assignedUserIds = [],
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Not Started");
  const [dueDate, setDueDate] = useState("");
  const [workers, setWorkers] = useState([]);

  const dispatch = useDispatch();
  const allWorkers = useSelector((state) => state.workers?.items ?? []);
  const loading = useSelector((state) => state.workers?.loading);
  const error = useSelector((state) => state.workers?.error);

  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const getWorkerId = (w) =>
    w?.id ?? w?.userId ?? w?.user?.id ?? w?.employeeId ?? null;

  const availableWorkers = useMemo(() => {
    const idsSet = new Set((assignedUserIds ?? []).map((id) => String(id)));
    return (allWorkers || []).filter((w) => {
      const wid = getWorkerId(w);
      if (!wid) return false;
      return idsSet.has(String(wid));
    });
  }, [allWorkers, assignedUserIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      parentTaskId: taskId,
      title: name,
      description: desc,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      status,
      workerAssignIds: workers.length > 0 ? [getWorkerId(workers[0])] : [],
    };

    try {
      await dispatch(createSubtask({ taskId, subtaskData: payload })).unwrap();
      setName("");
      setDesc("");
      setPriority("Medium");
      setStatus("Not Started");
      setDueDate("");
      setWorkers([]);
      onCancel && onCancel();
    } catch (err) {
      console.error("Failed to create subtask:", err);
    }
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form Fields */}
          <div className="space-y-6">
            {/* Subtask Information Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Subtask Information</h3>
                  <p className="text-gray-600 text-sm">Enter the essential details for your subtask</p>
                </div>
              </div>
              <div className="space-y-5">
                <InputField
                  id="name"
                  label="Subtask Name *"
                  placeholder="e.g., Foundation Excavation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<ClipboardList />}
                />

                <TextAreaField
                  id="description"
                  label="Description"
                  placeholder="Describe the subtask details..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  icon={<FileText />}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Due Date
                  </label>
                  <div className="relative group">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Subtask Details and Workers Assignment */}
          <div className="space-y-6">
            {/* Subtask Details Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                  <Flag className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Subtask Details</h3>
                  <p className="text-gray-600 text-sm">Set the subtask priority and status</p>
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Priority
                  </label>
                  <div className="relative group">
                    <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <div className="relative group">
                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
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
                  <h3 className="text-lg font-bold text-gray-900">Assign Worker</h3>
                  <p className="text-gray-600 text-sm">Select a worker for this subtask</p>
                </div>
              </div>
              
              {loading && (
                <div className="text-sm text-gray-500 mb-3">Loading workers...</div>
              )}
              {error && (
                <div className="text-sm text-red-500 mb-3">
                  Failed to load workers: {String(error)}
                </div>
              )}

              {availableWorkers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableWorkers.map((w) => {
                    const wid = getWorkerId(w);
                    const workerName =
                      [w?.firstName, w?.lastName].filter(Boolean).join(" ") ||
                      w?.name ||
                      "Unnamed";
                    const role = w?.specializationName || "Worker";
                    const isSelected = workers.some((wk) => getWorkerId(wk) === wid);

                    return (
                      <label
                        key={String(wid)}
                        className={`relative block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="radio"
                          name="worker"
                          checked={isSelected}
                          onChange={() => setWorkers([w])}
                          className="sr-only"
                        />
                        
                        <div className="flex items-start space-x-3">
                          {/* Profile Image */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          {/* Worker Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-medium text-gray-900 truncate text-sm">
                                {workerName}
                              </h4>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {role}
                              </span>
                            </div>
                            
                            <div className="mt-2 flex items-center text-xs text-gray-500">
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                              <span>Available</span>
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-purple-50 rounded-full">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <h4 className="text-gray-700 font-medium mb-1">
                    No workers available
                  </h4>
                  <p className="text-gray-500 text-sm">
                    No workers are assigned to this task
                  </p>
                </div>
              )}

              {workers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected Worker
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {workers.map((worker) => (
                      <span
                        key={String(getWorkerId(worker))}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm"
                      >
                        {worker?.firstName || worker?.name} -{" "}
                        {worker?.specializationName || "Worker"}
                        <button
                          type="button"
                          onClick={() => setWorkers([])}
                          className="ml-1.5 text-blue-600 hover:text-blue-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Create Subtask
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ id, label, placeholder, value, onChange, icon }) {
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
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function TextAreaField({
  id,
  label,
  placeholder,
  value,
  onChange,
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
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 resize-none text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
