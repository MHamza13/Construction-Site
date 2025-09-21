import { useState } from "react";
import {
  ClipboardList,
  FolderKanban,
  Flag,
  CalendarDays,
  FileText,
  CheckCircle,
  Clock,
  Edit3,
  Save,
  X,
} from "lucide-react";

export default function TaskInformation({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Updated Task:", editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  // Format deadline to show month and day (e.g., "September 30, 2025")
  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.error("Invalid date format:", err);
      return "Invalid date";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Not Started":
        return "bg-gray-100 text-gray-700 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm relative">
      {/* Action Buttons */}
      <div className="absolute top-5 right-5 flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition"
              title="Save Changes"
            >
              <Save size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
              title="Cancel Editing"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            title="Edit Task"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>

      {/* Section Header */}
      <div className="flex items-center space-x-3 mb-5">
        <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
          <ClipboardList className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Task Information</h3>
          <p className="text-gray-600 text-sm">View and edit task details</p>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-5">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Task Name
            </label>
            <div className="relative group">
              <ClipboardList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                name="name"
                value={editedTask.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                placeholder="Enter task name"
              />
            </div>
          </div>

          {/* Project */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Project
            </label>
            <div className="relative group">
              <FolderKanban className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                name="project"
                value={editedTask.project}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                placeholder="Enter project name"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <div className="relative group">
              <FileText className="absolute top-3 left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 resize-none text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                placeholder="Enter task description"
              />
            </div>
          </div>

          {/* Date + Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Deadline
              </label>
              <div className="relative group">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="date"
                  name="deadline"
                  value={editedTask.deadline}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Priority
              </label>
              <div className="relative group">
                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <select
                  name="priority"
                  value={editedTask.priority}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Status
            </label>
            <div className="relative group">
              <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                name="status"
                value={editedTask.status}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 focus:outline-none"
              >
                <option value="NotStarted">Not Started</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        // -------- View Mode --------
        <div className="space-y-5">
          {/* Title + Project */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editedTask.name}
            </h2>
            <p className="text-gray-500 mt-1">{editedTask.project}</p>
          </div>

          {/* Description */}
          {editedTask.description && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {editedTask.description}
              </p>
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-sm transition">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <CalendarDays className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="text-gray-900 font-medium">
                  {formatDeadline(editedTask.deadline)}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-sm transition">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Flag className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    editedTask.priority
                  )}`}
                >
                  {editedTask.priority}
                </span>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-white border border-gray-200 hover:shadow-sm transition">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    editedTask.status
                  )}`}
                >
                  {editedTask.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}