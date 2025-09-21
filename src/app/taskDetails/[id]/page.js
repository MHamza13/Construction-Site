"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import TaskInformation from "@/components/task/TaskInformation";
import ProgressOverview from "@/components/task/ProgressOverview";
import AssignedWorkers from "@/components/task/AssignedWorkers";
import PhasesSection from "@/components/PhasesSection";
import Link from "next/link";
import { fetchTaskById, clearCurrentTask } from "@/redux/task/TaskSlice";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    currentTask: task,
    loading,
    error,
    status, // Added to listen for assignment updates
  } = useSelector((state) => state.tasks);

  const taskId = id ? parseInt(id, 10) : -1;

  // Fetch task whenever taskId changes (re-fetches on every page visit)
  useEffect(() => {
    if (taskId !== -1) {
      dispatch(fetchTaskById(taskId));
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [dispatch, taskId]); // Dependencies ensure re-fetch on revisit

  // Re-fetch task after successful worker assignment
  useEffect(() => {
    if (status === "succeeded" && taskId !== -1) {
      dispatch(fetchTaskById(taskId)); // Re-fetch to update assignedUserIds
    }
  }, [status, taskId, dispatch]);

  // Auto reload page on error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000); // 2 second delay then reload
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto re-fetch on task not found (with delay to avoid loop)
  useEffect(() => {
    if (!task && !error && taskId !== -1 && !loading) {
      const timer = setTimeout(() => {
        dispatch(fetchTaskById(taskId));
      }, 2000); // 2s delay for retry
      return () => clearTimeout(timer);
    }
  }, [task, error, taskId, dispatch, loading]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mt-2 text-gray-600">Loading task...</span>
        </div>
      </div>
    );
  }

  // Task not found state
  if (!task) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mt-2 text-gray-600">Loading task...</span>
        </div>
      </div>
    );
  }

  // Metadata safe parse
  let parsedMetadata = {};
  try {
    parsedMetadata =
      typeof task.metadata === "string"
        ? JSON.parse(task.metadata)
        : task.metadata || {};
  } catch (err) {
    parsedMetadata = {};
  }

  const rawTask = {
    ...task,
    metadata: parsedMetadata,
  };

  // Safe deadline check
  const isOverdue = task.deadline && new Date(task.deadline) < new Date();

  const phases = [
    {
      id: 1,
      name: parsedMetadata.phase || "Task Phase",
      workers: rawTask.workers || [],
      workPackages: (rawTask.subtasks || []).map((sub, index) => ({
        name: sub.name || `Subtask ${index + 1}`,
        description: sub.description || "No description provided",
        status: sub.done
          ? "Completed"
          : sub.inProgress
          ? "In Progress"
          : "Not Started",
        priority: rawTask.priority || "Medium",
        dueDate: rawTask.deadline || "2025-09-30T00:00:00",
        workers: rawTask.workers?.slice(0, 1) || [],
      })),
    },
  ];

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link
                href="/tasks"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Task Details</h1>
                <p className="text-gray-600 text-sm">View and manage task information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="w-full mx-auto relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

              <div className="space-y-6">
                <TaskInformation task={rawTask} isOverdue={isOverdue} />

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="space-y-6 lg:col-span-3">
                    <AssignedWorkers
                      task={rawTask}
                      assignedUserIds={rawTask.assignedUserIds || []}
                    />
                  </div>
                  <div className="space-y-6 lg:col-span-3">
                    <ProgressOverview
                      taskId={taskId}
                    />
                  </div>
                  <div className="col-span-3">
                    <PhasesSection
                      assignedUserIds={rawTask.assignedUserIds || []}
                      initialPhases={phases}
                      taskId={taskId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
