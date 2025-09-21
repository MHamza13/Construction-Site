"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSpecializations,
  addSpecialization,
  deleteSpecialization,
} from "@/redux/specialization/SpecializationSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Plus, Trash2, Settings, Users } from "lucide-react";

const Specialization = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state) => state.specializations
  );

  const [newSpec, setNewSpec] = useState("");

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  useEffect(() => {
    console.log("Specializations items:", items); // Log the items state
  }, [items]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newSpec.trim()) return;
    dispatch(addSpecialization({ name: newSpec }))
      .unwrap()
      .then(() => {
        setNewSpec("");
        toast.success("Specialization added successfully!");
      })
      .catch((err) => {
        toast.error(err || "Failed to add specialization.");
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSpecialization(id))
          .unwrap()
          .then(() => {
            toast.success("Specialization deleted successfully!");
          })
          .catch((err) => {
            toast.error(err || "Failed to delete specialization.");
          });
      }
    });
  };

  return (
    <div className="w-full mx-auto relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-2xl -z-10"></div>

      <div className="p-6">
        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Add Specialization Form */}
          <div className="space-y-6">
            {/* Add Specialization Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-100 rounded-lg shadow-sm">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Add Specialization</h3>
                  <p className="text-gray-600 text-sm">Create a new worker specialization</p>
                </div>
              </div>
              <form onSubmit={handleAdd} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Specialization Name *
                  </label>
                  <div className="relative group">
                    <Settings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={newSpec}
                      onChange={(e) => setNewSpec(e.target.value)}
                      placeholder="Enter specialization name"
                      className="w-full pl-10 pr-3 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !newSpec.trim()}
                  className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Specialization
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Specializations List */}
          <div className="space-y-6">
            {/* Specializations List Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-green-100 rounded-lg shadow-sm">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Available Specializations</h3>
                  <p className="text-gray-600 text-sm">
                    {Array.isArray(items) ? items.length : 0} specializations configured
                  </p>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading specializations...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="p-3 bg-red-50 rounded-lg mb-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              ) : !Array.isArray(items) || items.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-green-50 rounded-full">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <h4 className="text-gray-700 font-medium mb-1">
                    No specializations yet
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Add your first specialization to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((spec, idx) => (
                    <div
                      key={spec.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {spec.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Worker specialization
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(spec.id)}
                        disabled={loading}
                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete specialization"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialization;
