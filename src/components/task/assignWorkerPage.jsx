"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Search, Users, Clock } from "lucide-react";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import { workerAssignUsersToTask } from "@/redux/task/TaskSlice";
import { toast } from "react-toastify";

export default function AssignWorkerPage({
  assignedUserIds = [],
  onWorkerAssigned,
  onCancel,
}) {
  const [selectedWorkers, setSelectedWorkers] = useState(
    assignedUserIds.map(String) // Pre-select workers from assignedUserIds
  );
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id; // Get taskId from URL
  const dispatch = useDispatch();

  // Get workers from Redux state
  const workers = useSelector((state) => state.workers?.items ?? []);
  const loading = useSelector((state) => state.workers?.loading);
  const error = useSelector((state) => state.workers?.error);

  // Fetch workers on component mount
  useEffect(() => {
    dispatch(fetchWorkers());
  }, [dispatch]);

  const handleCheckboxChange = (id) => {
    setSelectedWorkers((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!taskId) {
      toast.error("No task ID found in route!");
      return;
    }

    try {
      // Dispatch API call to assign workers
      await dispatch(
        workerAssignUsersToTask({
          id: taskId,
          taskId: taskId,
          userIds: selectedWorkers.map((id) => parseInt(id)),
        })
      ).unwrap();

      toast.success("Workers assigned successfully!");
      onWorkerAssigned(selectedWorkers);
      onCancel && onCancel();
    } catch (err) {
      console.error("Failed to assign workers:", err);
      toast.error("Failed to assign workers!");
    }
  };

  // Filter workers based on search query
  const filteredWorkers = workers.filter((worker) =>
    [
      worker.firstName || "",
      worker.lastName || "",
      worker.specializationName || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Search */}
          <div className="space-y-6">
            {/* Search Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Search Workers</h3>
                  <p className="text-gray-600 text-sm">Find and select workers to assign</p>
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Search Workers
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or specialization..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Worker Selection */}
          <div className="space-y-6">
            {/* Worker Selection Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-purple-100 rounded-lg shadow-sm">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Select Workers</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedWorkers.length}{" "}
                    {selectedWorkers.length === 1 ? "worker" : "workers"} selected
                  </p>
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

              {filteredWorkers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredWorkers.map((worker) => {
                    const isSelected = selectedWorkers.includes(worker.id.toString());
                    const workerName = `${worker.firstName || ''} ${worker.lastName || ''}`.trim() || 'Unnamed';
                    const role = worker.specializationName || "Worker";

                    return (
                      <label
                        key={worker.id}
                        className={`relative block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={worker.id}
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(worker.id.toString())}
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
                    No workers found
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {searchQuery ? "Try adjusting your search terms" : "No workers available"}
                  </p>
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
            disabled={selectedWorkers.length === 0}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Assign Workers ({selectedWorkers.length})
          </button>
        </div>
      </form>
    </div>
  );
}
