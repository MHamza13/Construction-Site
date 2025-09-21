"use client";
import { useState, useEffect, useMemo } from "react";
import Banner from "@/components/layout/Banner";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecializations } from "@/redux/specialization/SpecializationSlice";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import WorkersList from "@/components/WorkersList";
import AddWorkerForm from "@/components/AddWorkerForm";

export default function WorkerManagement() {
  const [filters, setFilters] = useState({
    status: "All Workers",
    search: "",
    specialization: "",
  });
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();

  // Redux states
  const {
    items: specializations,
    loading: specLoading,
    error: specError,
  } = useSelector((state) => state.specializations);

  const {
    items: workers,
    loading: workersLoading,
    error: workersError,
  } = useSelector((state) => state.workers);

  // ✅ fetch specialization & workers from API only if not already loaded
  useEffect(() => {
    if (specializations.length === 0 && !specLoading) {
      dispatch(fetchSpecializations());
    }
    if (workers.length === 0 && !workersLoading) {
      dispatch(fetchWorkers());
    }
  }, [dispatch, specializations.length, specLoading, workers.length, workersLoading]);

  // ✅ Apply Filters
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // 🔍 Search filter (by name, specialization, or email)
      const searchMatch =
        filters.search === "" ||
        worker.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        worker.specialization?.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        worker.specialization
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) || // if it's just a string
        worker.email?.toLowerCase().includes(filters.search.toLowerCase());

      // 🎯 Status filter (using boolean `active`)
      // 🎯 Status filter (using boolean `active`)
      const statusMatch =
        filters.status === "All Workers" ||
        (filters.status === "Active" && worker.isActive === true) ||
        (filters.status === "Inactive" && worker.isActive === false);

      // 🛠 Specialization filter (check both _id and name)
      const specializationMatch =
        filters.specialization === "" ||
        worker.specialization?._id === filters.specialization ||
        worker.specialization?.name === filters.specialization ||
        worker.specialization === filters.specialization;

      return searchMatch && statusMatch && specializationMatch;
    });
  }, [workers, filters]);

  // Show loading state only if no workers are loaded yet
  if (workersLoading && workers.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading workers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Banner
          title="Worker Management"
          subtitle="Manage your workforce efficiently"
          breadcrumb={[{ label: "Home", href: "#" }, { label: "Worker" }]}
        />
      </div>

      <div className="min-h-screen relative">
        {/* Loading overlay for data refresh */}
        {(workersLoading || specLoading) && workers.length > 0 && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">
                {workersLoading ? "Loading workers..." : "Loading specializations..."}
              </span>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
              {/* Search Input */}
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Search Workers
                </label>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                  placeholder="Search by name, specialization, email..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="cursor-pointer focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="All Workers">All Workers</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                </select>
              </div>

              {/* Specialization Filter */}
              <div className="w-full md:w-48">
                <label
                  htmlFor="specialization"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Specialization
                </label>
                <select
                  id="specialization"
                  className="cursor-pointer focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg shadow-sm text-sm"
                  value={filters.specialization}
                  onChange={(e) =>
                    setFilters({ ...filters, specialization: e.target.value })
                  }
                >
                  <option value="">All Specializations</option>
                  {specLoading && <option disabled>Loading...</option>}
                  {specError && <option disabled>Error loading</option>}
                  {specializations.map((spec) => (
                    <option key={spec.id} value={spec.id || spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Worker Button */}
              <div className="w-full md:w-auto flex-shrink-0">
                <button
                  onClick={() => setShowForm(true)}
                  className="cursor-pointer mt-1 md:mt-0 flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
                >
                  + Add Worker
                </button>
              </div>
            </div>
          </div>

          {/* ✅ Workers List with filtered data */}
          <WorkersList
            filters={filters}
            workers={filteredWorkers}
            loading={workersLoading}
            error={workersError}
          />

          {/* Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="relative w-full max-w-lg sm:max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-200 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Add New Worker
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <AddWorkerForm onClose={() => setShowForm(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
