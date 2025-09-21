"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkerById, updateWorker } from "@/redux/worker/WorkerSlice";
import Link from "next/link";
import placeholderImg from "@/assets/profilebgRemove.png";
import EditWorkerModal from "@/components/EditWorkerModal";
import Swal from "sweetalert2";

// Import components
import WorkerDashboard from "@/components/WorkerDashboard";
import RecentPayments from "@/components/RecentPayments";
import PendingInvoices from "@/components/PendingInvoices";
import ProjectAssignments from "@/components/ProjectAssignments";
import WorkerTasks from "@/components/WorkerTasks";
import WorkerInvoices from "@/components/WorkerInvoices";

export default function WorkerDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    current: worker,
    loading,
    error,
  } = useSelector((state) => state.workers);

  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch worker by ID
  useEffect(() => {
    if (id) {
      dispatch(fetchWorkerById(id));
    }
  }, [dispatch, id]);

  // Worker update handler
  const handleSaveWorker = async (updatedWorker) => {
    try {
      await dispatch(updateWorker({ id, data: updatedWorker })).unwrap();
      await dispatch(fetchWorkerById(id));
      setShowEditModal(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Worker updated successfully!",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update worker. Please try again.",
      });
    }
  };

  // Open edit modal
  const handleEditWorker = () => {
    setShowEditModal(true);
  };

  // Loader / Error handling
  if (loading) {
    return <div className="p-6 text-center">Loading worker...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!worker) {
    return (
      <div className="p-6 text-center text-gray-500">
        Worker not found or deleted.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Back Button + Title */}
        <div className="mb-6">
          <Link
            href="/worker-management"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Workers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Worker Details</h1>
        </div>

        {/* Worker Card */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition">
          <div className="p-6 flex flex-col md:flex-row items-start md:items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
              <div className="relative">
                <img
                  src={worker.profilePictureUrl || placeholderImg.src}
                  alt={`${worker.firstName} ${worker.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {worker.firstName} {worker.lastName}
                  </h2>
                  <p className="text-lg text-gray-600">{worker.role}</p>
                </div>
                <span
                  className={`mt-2 md:mt-0 px-3 py-1 text-sm font-medium rounded-md ${
                    worker.isActive === true
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {worker.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Worker Info Grids */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Info */}
                <div className="bg-gray-50/80 rounded-lg p-4 hover:shadow transition">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Employee Information
                  </h3>
                  <dl className="mt-3 space-y-2">
                    <InfoRow label="Employee ID" value={worker.employeeId} />
                    <InfoRow
                      label="Experience"
                      value={`${worker.experience} years`}
                    />
                    <InfoRow
                      label="Daily Wage"
                      value={`$${worker.dailyWages?.toLocaleString()}`}
                    />
                    <InfoRow
                      label="Hourly Rate"
                      value={`$${worker.perHourSalary?.toLocaleString()}`}
                    />
                    <InfoRow
                      label="Specialization"
                      value={worker.specializationName}
                    />
                  </dl>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50/80 rounded-lg p-4 hover:shadow transition">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Contact Information
                  </h3>
                  <dl className="mt-3 space-y-2">
                    <InfoRow label="Email" value={worker.email} />
                    <InfoRow label="Phone" value={worker.phoneNumber} />
                  </dl>
                </div>
              </div>

              {/* Skills */}
              {worker.skills && worker.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Skills & Licenses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(worker.skills) ? (
                      worker.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 cursor-default"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 cursor-default">
                        {worker.skills}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Edit Worker Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleEditWorker} // Changed to handleEditWorker
                  className="inline-flex items-center px-4 py-2 rounded-lg shadow-sm text-sm font-medium 
                      text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 
                      focus:ring-blue-500 transition cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Worker
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Performance Section with Tabs */}
        <div className="mt-10">
          <WorkerDashboard stats={worker.stats || []} />

          {/* Tabs */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="flex space-x-6">
              {["overview", "projects", "tasks", "invoices"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-2 text-sm font-medium ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Content based on tab */}
          <div className="mt-6 space-y-6">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentPayments payments={worker.payments || []} />
                <PendingInvoices invoices={worker.pendingInvoices || []} />
              </div>
            )}
            {activeTab === "projects" && (
              <ProjectAssignments projects={worker.projects || []} />
            )}
            {activeTab === "tasks" && (
              <WorkerTasks tasks={worker.tasks || []} />
            )}
            {activeTab === "invoices" && (
              <WorkerInvoices invoices={worker.invoices || []} />
            )}
          </div>
        </div>

        {/* Edit Modal */}
        <EditWorkerModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          worker={worker}
          onSave={handleSaveWorker}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}
