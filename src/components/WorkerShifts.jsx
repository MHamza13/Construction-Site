"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Ensure this path and function are correct in your project
import { fetchWorkerShifts } from "@/redux/shift/ShiftSlice";
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Loader,
  Search,
  Filter,
  Timer,
  Download, // <-- Yahan 'Download' ko add kar diya gaya hai
} from "lucide-react";

// Helper: Format date string into date and time parts
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  } catch {
    return null;
  }
};

const WorkerShifts = ({ workerId }) => {
  const dispatch = useDispatch();

  // State for Search and Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Select data from the shifts state structure
  const {
    workerShifts: shifts,
    loading,
    error,
  } = useSelector((state) => state.shifts || {});

  // Fetch shifts when the component mounts or workerId changes
  useEffect(() => {
    if (workerId) {
      dispatch(fetchWorkerShifts(workerId));
    }
  }, [dispatch, workerId]);

  // Ensure 'shifts' is always an array for safe operations
  const shiftArray = Array.isArray(shifts) ? shifts : [];

  // Filtered shifts logic using useMemo
  const filteredShifts = useMemo(() => {
    return shiftArray.filter((shift) => {
      // Create a string of key data for search
      const searchData = [
        formatDate(shift.CheckIn)?.date, // Date ko bhi search mein shamil karein
        shift.ShiftStatus,
        shift.CalculatedHours ? String(shift.CalculatedHours) : "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchData.includes(search.toLowerCase());

      // Use ShiftStatus for filtering
      const matchesStatus =
        statusFilter === "All Status" || shift.ShiftStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [shiftArray, search, statusFilter]);

  // Calculate total hours worked (using original API data for summary)
  const totalShiftHours = useMemo(() => {
    return shiftArray
      .reduce((sum, shift) => {
        // Use 'CalculatedHours' property and ensure conversion to number
        const hours = parseFloat(shift?.CalculatedHours) ?? 0;
        return sum + hours;
      }, 0)
      .toFixed(1);
  }, [shiftArray]);

  // Calculate completed and active shifts for summary cards
  const completedShifts = shiftArray.filter(
    (s) => s.ShiftStatus === "Closed"
  ).length;
  const activeShifts = shiftArray.filter(
    (s) => s.ShiftStatus === "Active"
  ).length;

  // --- Loader / Error Handling ---
  if (loading && shiftArray.length === 0) {
    return (
      <div className="p-10 text-center bg-white shadow-lg rounded-lg border border-gray-100">
        <Loader className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
        <p className="text-gray-600">Fetching worker shifts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 text-red-700 border border-red-300 rounded-lg">
        Error loading shifts: {String(error)}
      </div>
    );
  }

  // --- Main Content (Enhanced UI) ---
  return (
    <div className="bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section (from InvoiceHistory component) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Shift History
            </h2>
            <p className="text-slate-300">View and track all recorded shifts</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search shifts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-300 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md pl-10 pr-4 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer"
              >
                <option value="All Status" className="text-gray-900">
                  All Status
                </option>
                {/* Assuming possible statuses are Closed and Active */}
                <option value="Closed" className="text-gray-900">
                  Completed
                </option>
                <option value="Active" className="text-gray-900">
                  Active
                </option>
              </select>
            </div>

            {/* Download/Export Button */}
            <button className="bg-white text-slate-900 px-6 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 transition-all duration-200 flex items-center gap-2 shadow-lg cursor-pointer">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 bg-gray-50 border-b border-gray-100">
        <ShiftStatCard
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          label="Total Shifts"
          value={shiftArray.length}
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <ShiftStatCard
          icon={<Timer className="w-6 h-6 text-indigo-600" />}
          label="Total Hours Tracked"
          // totalShiftHours already calculated correctly
          value={`${totalShiftHours}h`}
          bgColor="bg-indigo-50"
          textColor="text-indigo-700"
        />
        <ShiftStatCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          label="Completed Shifts"
          value={completedShifts}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
      </div>

      {/* Shifts List Table */}
      <div className="p-8">
        {filteredShifts.length > 0 ? (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shift Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-In Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Shift Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShifts.map((shift) => {
                  // Property names are used as per your data sample: CheckIn, EndShift, CalculatedHours, ShiftStatus
                  const checkIn = formatDate(shift.CheckIn);
                  const endShift = formatDate(shift.EndShift);
                  const shiftStatus = shift.ShiftStatus;

                  return (
                    <tr
                      key={shift.Id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Shift Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {checkIn ? checkIn.date : "N/A"}
                      </td>
                      {/* Check-In Time */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {checkIn ? checkIn.time : "N/A"}
                      </td>
                      {/* End Shift Time */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {endShift ? (
                          <span className="font-medium text-gray-900">
                            {endShift.time}
                          </span>
                        ) : (
                          <span className="text-yellow-600 italic font-medium">
                            Ongoing
                          </span>
                        )}
                      </td>
                      {/* Calculated Hours */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`inline-flex items-center justify-center h-6 px-3 rounded-md text-sm font-semibold ${
                            shiftStatus === "Closed"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {(parseFloat(shift.CalculatedHours) ?? 0).toFixed(1)}h
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <ShiftStatusTag status={shiftStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No shifts found
            </h3>
            <p className="text-gray-500 mb-6">
              {search || statusFilter !== "All Status"
                ? "Try adjusting your search or filter criteria."
                : "This worker has no recorded shifts yet."}
            </p>
            {(search || statusFilter !== "All Status") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All Status");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for stat cards
const ShiftStatCard = ({ icon, label, value, bgColor, textColor }) => (
  <div
    className={`p-4 rounded-lg shadow-sm ${bgColor} border border-gray-200 flex items-center space-x-4`}
  >
    <div className={`flex-shrink-0 ${textColor}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

// Helper component for status tags
const ShiftStatusTag = ({ status }) => {
  let classes = "";
  let display = status || "Unknown";

  if (status === "Closed") {
    classes = "bg-green-100 text-green-800";
    display = "Completed";
  } else if (status === "Active") {
    classes = "bg-blue-100 text-blue-800";
    display = "Active";
  } else {
    classes = "bg-yellow-100 text-yellow-800";
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${classes}`}
    >
      {display}
    </span>
  );
};

export default WorkerShifts;
