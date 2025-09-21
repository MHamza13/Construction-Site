"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, ClipboardList } from "lucide-react";
import FiltersBar from "@/components/FiltersBar";
import TaskList from "@/components/TaskList";
import AddTask from "@/components/AddTaskPage";
import Banner from "@/components/layout/Banner";
import { fetchTasks, createTask } from "@/redux/task/TaskSlice";

export default function TasksPage() {
  const [filters, setFilters] = useState({
    status: "All Tasks",
    search: "",
    project: "",
    priority: "",
    // role removed as per FiltersBar update
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const dispatch = useDispatch();
  const {
    items: taskList,
    loading,
    error,
  } = useSelector((state) => state.tasks);

  // Fetch tasks on mount only if not already loaded
  useEffect(() => {
    if (taskList.length === 0 && !loading) {
      dispatch(fetchTasks());
    }
  }, [dispatch, taskList.length, loading]);

  const filteredTasks = useMemo(() => {
    // Early return if no tasks
    if (!taskList || taskList.length === 0) return [];

    // Clean invalid tasks upfront to avoid crashes
    const validTasks = taskList.filter(
      (task) => task && typeof task === "object"
    );

    // Early return if no valid tasks
    if (validTasks.length === 0) return [];

    return validTasks.filter((task) => {
      // Early return for invalid tasks (extra safety)
      if (!task) return false;

      // Status filter
      if (filters.status !== "All Tasks") {
        if (filters.status === "Overdue") {
          if (!task.deadline) return false;
          const today = new Date();
          const due = new Date(task.deadline);
          if (due >= today) return false;
        } else if (task.status !== filters.status) {
          return false;
        }
      }

      // Search filter - only process if search term exists
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          (task.name || "").toLowerCase().includes(searchTerm) ||
          (task.description || "").toLowerCase().includes(searchTerm) ||
          (task.projectId
            ? task.projectId.toString().toLowerCase().includes(searchTerm)
            : false) ||
          (task.subtasks || []).some(
            (sub) => sub && (sub.name || "").toLowerCase().includes(searchTerm)
          ) ||
          (task.workers || []).some(
            (worker) =>
              worker && (worker.name || "").toLowerCase().includes(searchTerm)
          );

        if (!matchesSearch) return false;
      }

      // Project filter (using projectId as string)
      if (filters.project && task.projectId?.toString() !== filters.project) {
        return false;
      }

      // Priority filter
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Role filter (kept for backward compat, but can be removed if not used)
      if (
        filters.role &&
        !(task.workers || []).some((worker) => worker?.role === filters.role)
      ) {
        return false;
      }

      return true;
    });
  }, [filters, taskList]);

  const toggleAddTaskPopup = () => {
    setIsAddTaskOpen(!isAddTaskOpen);
  };

  const handleAddTask = async (newTask) => {
    // Map AddTask form data to createTask payload
    const taskData = {
      projectId: newTask.projectId || 0,
      name: newTask.name || "", // Use 'name' instead of 'title'
      description: newTask.description || "",
      deadline: newTask.deadline
        ? new Date(newTask.deadline).toISOString()
        : new Date().toISOString(),
      priority: newTask.priority || "Low",
      status: newTask.status || "NotStarted",
      estimatedHours: newTask.estimatedHours || 0,
      metadata: newTask.metadata || "",
      assignedUserIds: newTask.assignedUserIds || [],
    };

    try {
      await dispatch(createTask(taskData));
      // Optionally refetch tasks if not auto-added in reducer
      dispatch(fetchTasks());
      setIsAddTaskOpen(false);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  // Show loading state only if no tasks are loaded yet
  if (loading && taskList.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Global Error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mx-auto max-w-md mt-8">
        <AlertTriangle className="h-5 w-5 text-red-400 mr-2 inline" />
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={() => dispatch(fetchTasks())}
          className="ml-2 text-blue-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Banner */}
      <div className="mb-4">
        <Banner
          title="Task Management"
          subtitle="Overview & insights of your projects"
          breadcrumb={[{ label: "Home", href: "#" }, { label: "Task" }]}
        />
      </div>
      <main className="min-h-screen relative">
        {/* Loading overlay for data refresh */}
        {loading && taskList.length > 0 && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Refreshing tasks...</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <FiltersBar
            filters={filters}
            setFilters={setFilters}
            toggleAddTaskPopup={toggleAddTaskPopup}
          />

          {/* Results Count */}
          <div className="text-sm text-gray-600 px-2">
            Showing {filteredTasks.length} of {taskList.length} tasks
          </div>

          {/* Task List */}
          {filteredTasks.length > 0 ? (
            <TaskList tasks={filteredTasks} />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or create a new task.
              </p>
              <button
                onClick={toggleAddTaskPopup}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create New Task
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Task Popup */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-6xl xl:max-w-7xl max-h-[95vh] bg-white shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm">
                    <ClipboardList className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Task</h2>
                    <p className="text-blue-100 text-sm">Add a new task to your project</p>
                  </div>
                </div>
                <button
                  onClick={toggleAddTaskPopup}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 max-h-[calc(95vh-100px)] overflow-y-auto custom-scrollbar">
              <AddTask onTaskAdd={handleAddTask} onCancel={toggleAddTaskPopup} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}