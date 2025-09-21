"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import placeholderImg from "@/assets/profilebgRemove.png";
import EditWorkerModal from "@/components/EditWorkerModal";
import { updateWorker } from "@/redux/worker/WorkerSlice";
import { useDispatch } from "react-redux";

// Lucide Icons
import { Phone, Mail, Clock, DollarSign, Timer } from "lucide-react";

export default function WorkersList({ workers = [] }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setShowEditModal(true);
  };

  const handleSaveWorker = async (updatedWorker) => {
    if (!selectedWorker?.id) return;

    try {
      await dispatch(
        updateWorker({ id: selectedWorker.id, data: updatedWorker })
      ).unwrap();

      setShowEditModal(false);
      setSelectedWorker(null);
    } catch (error) {
      console.error("Failed to update worker:", error);
    }
  };

  if (!workers || workers.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-md p-8 text-center border border-gray-200">
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No workers found
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workers.map((worker) => (
        <div
          key={worker.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            {/* Profile Image */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <img
                  src={worker.profilePictureUrl || placeholderImg.src}
                  alt={`${worker.firstName} ${worker.lastName}`}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
                />
                <span
                  className={`absolute bottom-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white ${
                    worker.isActive === true ? "bg-green-400" : "bg-red-400"
                  }`}
                />
              </div>
            </div>

            {/* Name + Role */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {worker.firstName} {worker.lastName}
              </h2>
              <p className="text-gray-500">{worker.role}</p>
            </div>

            {/* Status + ID */}
            <div className="flex justify-between items-center mb-4">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  worker.isActive === true
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {worker.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-sm text-gray-500">ID: {worker.id}</span>
            </div>

            {/* Worker Info */}
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              {/* Phone */}
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="ml-2">{worker.phoneNumber}</span>
              </div>
              {/* Email */}
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="ml-2 truncate">{worker.email}</span>
              </div>
              {/* Experience */}
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="ml-2">{worker.experience} years</span>
              </div>
              {/* Daily Wage */}
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="ml-2">Daily Wage: {worker.dailyWages}</span>
              </div>
              {/* Per Hour Salary */}
              <div className="flex items-center">
                <Timer className="w-4 h-4 text-gray-500" />
                <span className="ml-2">Per Hour: {worker.perHourSalary}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleEditWorker(worker)}
                className="flex-1 px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Edit
              </button>
              <button
                onClick={() => router.push(`/worker-management/${worker.id}`)}
                className="flex-1 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}

      <EditWorkerModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedWorker(null);
        }}
        worker={selectedWorker}
        onSave={handleSaveWorker}
      />
    </div>
  );
}
