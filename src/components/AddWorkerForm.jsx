"use client";

import { useState, useEffect } from "react";
import { User, Phone, Mail, Shield, Image as ImageIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpecializations } from "@/redux/specialization/SpecializationSlice";
import { createWorker } from "@/redux/worker/WorkerSlice";
import Swal from "sweetalert2";

export default function AddWorkerForm({ onClose }) {
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [experience, setExperience] = useState(0);
  const [dailyWages, setDailyWages] = useState(0);
  const [perHourSalary, setPerHourSalary] = useState(0);

  const dispatch = useDispatch();
  const { items: specializations, loading } = useSelector(
    (state) => state.specializations
  );
  const { loading: loadingWorker } = useSelector((state) => state.workers);

  useEffect(() => {
    dispatch(fetchSpecializations());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const newErrors = {};
    if (!data.firstName) newErrors.firstName = "First name is required";
    if (!data.lastName) newErrors.lastName = "Last name is required";
    if (!data.email) newErrors.email = "Email is required";
    if (!data.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!data.specializationId)
      newErrors.specializationId = "Specialization is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      isActive: true, // Always true for new workers
      profilePictureUrl: preview || "",
      experience: Number(experience),
      dailyWages: Number(dailyWages),
      perHourSalary: Number(perHourSalary),
      specializationId: data.specializationId || null, // Send ID, not name
    };

    try {
      const resultAction = await dispatch(createWorker(payload));

      if (createWorker.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: "success",
          title: "Worker Created!",
          text: "Worker registered successfully!",
          confirmButtonColor: "#3085d6",
        }).then(() => onClose());
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resultAction.payload?.message || "Worker registration failed!",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearError = (field) => setErrors({ ...errors, [field]: "" });

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full border-2 border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full border-2 border-gray-200 shadow-sm">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Upload profile picture"
            />
          </div>
        </div>
        {errors.image && (
          <p className="text-sm text-red-600 mt-1 text-center">
            {errors.image}
          </p>
        )}

        {/* First + Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              name="firstName"
              placeholder="First Name"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.firstName ? "border-red-300" : "border-gray-300"
              } rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150`}
              onChange={() => clearError("firstName")}
              required
              aria-label="First name"
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              name="lastName"
              placeholder="Last Name"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.lastName ? "border-red-300" : "border-gray-300"
              } rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150`}
              onChange={() => clearError("lastName")}
              required
              aria-label="Last name"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.email ? "border-red-300" : "border-gray-300"
              } rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150`}
              onChange={() => clearError("email")}
              required
              aria-label="Email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Phone className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input
              name="phoneNumber"
              type="tel"
              placeholder="Phone"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.phoneNumber ? "border-red-300" : "border-gray-300"
              } rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150`}
              onChange={() => clearError("phoneNumber")}
              required
              aria-label="Phone number"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Specialization + Experience + Daily Wages + Hourly Salary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <Shield className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <select
              name="specializationId"
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.specializationId ? "border-red-300" : "border-gray-300"
              } rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150`}
              onChange={() => clearError("specializationId")}
              required
              aria-label="Select specialization"
            >
              <option value="">
                {loading ? "Loading..." : "Select Specialization"}
              </option>
              {specializations.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
            {errors.specializationId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.specializationId}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              placeholder="Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150"
              aria-label="Experience in years"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Wages
            </label>
            <input
              type="number"
              placeholder="Daily Wages"
              value={dailyWages}
              onChange={(e) => setDailyWages(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150"
              aria-label="Daily wages"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Per Hour Salary
            </label>
            <input
              type="number"
              placeholder="Per Hour Salary"
              value={perHourSalary}
              onChange={(e) => setPerHourSalary(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors duration-150"
              aria-label="Per hour salary"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 hover:shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Cancel adding worker"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loadingWorker}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:bg-gray-400 disabled:shadow-none disabled:scale-100"
            aria-label="Add worker"
          >
            {loadingWorker ? "Registering..." : "Add Worker"}
          </button>
        </div>
      </form>
    </div>
  );
}
