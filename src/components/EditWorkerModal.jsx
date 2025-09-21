"use client";

import { useState, useEffect } from "react";
import placeholderImg from "@/assets/profilebgRemove.png";
import Swal from "sweetalert2";
import {
  User,
  Phone,
  Mail,
  Award,
  DollarSign,
  CreditCard,
  Briefcase,
  ToggleLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecializations } from "@/redux/specialization/SpecializationSlice";

export default function EditWorkerModal({ isOpen, onClose, worker, onSave }) {
  if (!isOpen || !worker) return null;

  const dispatch = useDispatch();
  const { items: specializations, loading } = useSelector(
    (state) => state.specializations
  );

  const [formData, setFormData] = useState({ ...worker });
  const [preview, setPreview] = useState(worker.profilePictureUrl || null);

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  useEffect(() => {
    if (worker) {
      setFormData({
        ...worker,
        specializationId:
          worker.specialization?.id || worker.specializationId || "",
        isActive: worker.isActive ?? true,
      });
      setPreview(worker.profilePictureUrl || null);
    }
  }, [worker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "isActive" ? value === "true" : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      id: formData.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      specializationId: formData.specializationId || null, // ✅ backend expects ID
      experience: Number(formData.experience),
      dailyWages: Number(formData.dailyWages),
      perHourSalary: Number(formData.perHourSalary),
      profilePictureUrl: preview,
      isActive: formData.isActive,
    };

    try {
      await onSave(updatedData);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Worker updated successfully",
        confirmButtonColor: "#3085d6",
      }).then(() => onClose());
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update worker. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Worker</h2>
        <p className="text-gray-600 mb-6">Update worker information</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center">
              <img
                src={preview || placeholderImg.src}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm mr-4"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block text-sm text-gray-500 
                file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 
                file:text-sm file:font-semibold 
                file:bg-blue-50 file:text-blue-700 
                hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Status (Active/Inactive) */}
          <div className="relative">
            <ToggleLeft className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <select
              name="isActive"
              value={formData.isActive ? "true" : "false"}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Specialization (Dropdown from API) */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <select
              name="specializationId"
              value={formData.specializationId || ""}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
            >
              <option value="">
                {loading ? "Loading..." : "Select Specialization"}
              </option>
              {specializations?.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Experience, Wages, Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <Award className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                name="experience"
                type="number"
                value={formData.experience || ""}
                onChange={handleChange}
                placeholder="Experience (years)"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                name="dailyWages"
                type="number"
                value={formData.dailyWages || ""}
                onChange={handleChange}
                placeholder="Daily Wages"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
            </div>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                name="perHourSalary"
                type="number"
                value={formData.perHourSalary || ""}
                onChange={handleChange}
                placeholder="Per Hour Salary"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
