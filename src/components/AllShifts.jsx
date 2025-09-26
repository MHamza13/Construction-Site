"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllShifts,
  fetchWorkerShiftsByDate,
} from "@/redux/shift/ShiftSlice";
import { fetchWorkers } from "@/redux/worker/WorkerSlice";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Search,
  X,
  ListOrdered,
  User,
  Filter,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Helper function to safely format dates
const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch {
    return null;
  }
};

// --- WorkerShiftTable Component with SMART PAGINATION ---
const WorkerShiftTable = ({ shifts }) => {
  const columns = useMemo(
    () => [
      {
        header: "Shift ID",
        accessorKey: "id",
        cell: ({ getValue }) => (
          <span className="inline-flex items-center justify-center h-7 px-3 rounded-md bg-gray-100 text-xs font-medium text-gray-800 border border-gray-300">
            #{getValue() || "N/A"}
          </span>
        ),
      },
      {
        header: "Check-In",
        accessorKey: "checkIn",
        cell: ({ getValue }) => {
          const checkIn = getValue();
          return (
            <div>
              <div className="font-medium text-gray-900">
                {formatDate(checkIn, { timeStyle: "short" }) || "—"}
              </div>
              <div className="text-gray-500 text-sm">
                {formatDate(checkIn, { dateStyle: "medium" })}
              </div>
            </div>
          );
        },
      },
      {
        header: "End Shift",
        accessorKey: "endShift",
        cell: ({ getValue }) => {
          const endShift = getValue();
          if (!endShift) {
            return (
              <span className="text-yellow-600 italic font-medium">
                Ongoing
              </span>
            );
          }
          return (
            <div>
              <div className="font-medium text-gray-900">
                {formatDate(endShift, { timeStyle: "short" })}
              </div>
              <div className="text-gray-500 text-sm">
                {formatDate(endShift, { dateStyle: "medium" })}
              </div>
            </div>
          );
        },
      },
      {
        header: "Hours",
        accessorKey: "calculatedHours",
        cell: ({ getValue }) => {
          const hours = parseFloat(getValue()) || 0;
          return (
            <span className="inline-flex items-center justify-center h-7 px-3 rounded-md bg-indigo-100 text-sm font-semibold text-indigo-700">
              {hours > 0 ? `${hours.toFixed(1)}h` : "—"}
            </span>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "shiftStatus",
        cell: ({ getValue }) => {
          const status = getValue() || "Unknown";
          const isClosed = status === "Closed";
          return (
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                isClosed
                  ? "bg-green-50 text-green-700 border-green-200"
                  : status === "Active"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              <span
                className={`${
                  isClosed
                    ? "bg-green-500"
                    : status === "Active"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                } inline-block h-1.5 w-1.5 rounded-full`}
              />
              {status}
            </span>
          );
        },
      },
      {
        header: "Invoiced",
        accessorKey: "isInvoiced",
        cell: ({ getValue }) => {
          const isInvoiced = getValue() === true;
          return (
            <span
              className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isInvoiced
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              <span
                className={`${
                  isInvoiced ? "bg-emerald-500" : "bg-rose-500"
                } inline-block h-1.5 w-1.5 rounded-full`}
              />
              {isInvoiced ? "Invoiced" : "Pending"}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: shifts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
      sorting: [{ id: "checkIn", desc: true }],
    },
  });

  // --- NEW: Logic to generate pagination range with ellipsis ---
  const getPaginationRange = () => {
    const currentPage = table.getState().pagination.pageIndex + 1; // 1-indexed
    const totalPages = table.getPageCount();

    // Case 1: Agar 5 ya usse kam pages hain, to sabhi numbers dikhayein
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Case 2: Agar current page shuruat ke paas hai (e.g., page 1, 2, 3)
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    // Case 3: Agar current page aakhir ke paas hai (e.g., last 3 pages)
    if (currentPage > totalPages - 3) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // Case 4: Agar current page beech mein hai
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="bg-gray-50 p-4 border-t border-gray-200">
      <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/75">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 text-sm whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- UPDATED: Dynamic Pagination Controls --- */}
      <div className="pt-3 flex justify-between items-center text-xs text-gray-600">
        <div>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          <strong>{table.getPageCount()}</strong>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {getPaginationRange().map((pageNumber, index) =>
            typeof pageNumber === "number" ? (
              <button
                key={pageNumber}
                onClick={() => table.setPageIndex(pageNumber - 1)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  table.getState().pagination.pageIndex + 1 === pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-200 text-gray-700 border border-gray-200"
                }`}
              >
                {pageNumber}
              </button>
            ) : (
              <span key={`dots-${index}`} className="px-1.5 py-1">
                ...
              </span>
            )
          )}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AllShifts = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const {
    shifts = [],
    loading: shiftsLoading,
    error: shiftsError,
  } = useSelector((state) => state.shifts || {});

  const {
    items: workers = [],
    loading: workersLoading,
    error: workersError,
  } = useSelector((state) => state.workers || {});

  // State for filters and search
  const [search, setSearch] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invoiceFilter, setInvoiceFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isSpecificQuery, setIsSpecificQuery] = useState(false);

  // State to manage which accordion is open
  const [expandedWorkerId, setExpandedWorkerId] = useState(null);

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchAllShifts());
    dispatch(fetchWorkers());
  }, [dispatch]);

  // Effect to handle specific queries
  useEffect(() => {
    const isReadyForSpecificQuery = selectedWorkerId && selectedDate;
    if (isReadyForSpecificQuery) {
      setIsSpecificQuery(true);
      dispatch(
        fetchWorkerShiftsByDate({
          workerId: selectedWorkerId,
          shiftDate: selectedDate,
        })
      );
    } else {
      setIsSpecificQuery(false);
      if (!selectedWorkerId && !selectedDate && shifts.length < 1) {
        dispatch(fetchAllShifts());
      }
    }
  }, [dispatch, selectedWorkerId, selectedDate, shifts.length]);

  const workerIdToInfo = useMemo(() => {
    const map = {};
    if (!Array.isArray(workers)) return map;
    workers.forEach((w) => {
      if (!w) return;
      const primaryId = w?.id ?? w?.workerId ?? w?._id;
      if (primaryId == null) return;
      const fullName =
        [w?.firstName, w?.lastName].filter(Boolean).join(" ") ||
        w?.fullName ||
        w?.name ||
        `Worker #${primaryId}`;
      const info = {
        name: fullName,
        profilePictureUrl: w?.profilePictureUrl,
        worker: w,
      };
      [w?.id, w?.workerId, w?._id]
        .filter((id) => id != null)
        .forEach((id) => {
          map[String(id)] = info;
        });
    });
    return map;
  }, [workers]);

  const filteredShifts = useMemo(() => {
    let list = Array.isArray(shifts) ? [...shifts] : [];
    const normalize = (v) =>
      String(v || "")
        .toLowerCase()
        .trim();

    if (!isSpecificQuery) {
      if (selectedWorkerId) {
        list = list.filter(
          (s) => s && String(s.workerId) === String(selectedWorkerId)
        );
      }
      if (selectedDate) {
        const selectedDateStr = new Date(selectedDate)
          .toISOString()
          .split("T")[0];
        list = list.filter((s) => {
          if (!s?.checkIn) return false;
          return (
            new Date(s.checkIn).toISOString().split("T")[0] === selectedDateStr
          );
        });
      }
    }

    if (statusFilter) {
      list = list.filter(
        (s) => s && normalize(s.shiftStatus) === normalize(statusFilter)
      );
    }
    if (invoiceFilter) {
      const isInvoiced = invoiceFilter === "invoiced";
      list = list.filter((s) => s && s.isInvoiced === isInvoiced);
    }
    if (search.trim()) {
      const q = normalize(search);
      list = list.filter((s) => {
        if (!s) return false;
        const workerInfo = workerIdToInfo[String(s.workerId)];
        return (
          normalize(s.id).includes(q) ||
          normalize(workerInfo?.name).includes(q) ||
          normalize(s.shiftStatus).includes(q)
        );
      });
    }

    return list.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
  }, [
    shifts,
    selectedWorkerId,
    statusFilter,
    invoiceFilter,
    selectedDate,
    search,
    workerIdToInfo,
    isSpecificQuery,
  ]);

  // Group shifts by worker for the accordion view
  const shiftsGroupedByWorker = useMemo(() => {
    return filteredShifts.reduce((acc, shift) => {
      const workerId = shift.workerId;
      if (!acc[workerId]) {
        acc[workerId] = [];
      }
      acc[workerId].push(shift);
      return acc;
    }, {});
  }, [filteredShifts]);

  // Reusable function to calculate stats for any list of shifts
  const getShiftStats = (shiftsList) => {
    const total = shiftsList.length;
    const closed = shiftsList.filter((s) => s?.shiftStatus === "Closed").length;
    const invoiced = shiftsList.filter((s) => s?.isInvoiced).length;
    const totalHours = shiftsList.reduce(
      (sum, s) => sum + (parseFloat(s?.calculatedHours) || 0),
      0
    );
    return {
      total,
      closed,
      open: total - closed,
      invoiced,
      totalHours: totalHours.toFixed(1),
    };
  };

  // Overall stats for the header
  const getOverallStats = useMemo(() => {
    return getShiftStats(filteredShifts);
  }, [filteredShifts]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedWorkerId("");
    setStatusFilter("");
    setInvoiceFilter("");
    setSelectedDate("");
    setExpandedWorkerId(null);
    if (isSpecificQuery || filteredShifts.length === 0) {
      dispatch(fetchAllShifts());
    }
  };

  const loading = shiftsLoading || workersLoading;
  const error = shiftsError || workersError;

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-7xl">
        {/* Header and Stats */}
        <div className="bg-white rounded-md border mb-6 border-gray-200 shadow-md p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                All Shifts
              </h1>
              <p className="mt-1 text-gray-600">
                Monitor and manage all shifts across your organization
              </p>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-4">
              <div className="rounded-md bg-blue-50 p-4 border border-blue-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-xl font-bold text-blue-700">
                  {getOverallStats.total}
                </div>
                <div className="text-xs text-gray-600">Total Shifts</div>
              </div>
              <div className="rounded-md bg-green-50 p-4 border border-green-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-xl font-bold text-green-700">
                  {getOverallStats.closed}
                </div>
                <div className="text-xs text-gray-600">Shift End</div>
              </div>
              <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-xl font-bold text-yellow-700">
                  {getOverallStats.open}
                </div>
                <div className="text-xs text-gray-600">Shift Open</div>
              </div>
              <div className="rounded-md bg-purple-50 p-4 border border-purple-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-xl font-bold text-purple-700">
                  {getOverallStats.invoiced}
                </div>
                <div className="text-xs text-gray-600">Invoiced</div>
              </div>
              <div className="rounded-md bg-indigo-50 p-4 border border-indigo-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="text-xl font-bold text-indigo-700">
                  {getOverallStats.totalHours}h
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md overflow-hidden shadow-md">
          {/* Advanced Filters */}
          <div className="bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Filter Shifts
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search shifts, workers..."
                  className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Worker Filter */}
              <div className="relative">
                <select
                  value={selectedWorkerId}
                  onChange={(e) => setSelectedWorkerId(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Workers</option>
                  {Array.isArray(workers) &&
                    workers.map((w) => {
                      if (!w) return null;
                      const value = w?.id ?? w?.workerId ?? w?._id;
                      const label =
                        workerIdToInfo[String(value)]?.name ||
                        `Worker #${value}`;
                      return (
                        <option key={String(value)} value={String(value)}>
                          {label}
                        </option>
                      );
                    })}
                </select>
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Closed">Closed</option>
                  <option value="Open">Open</option>
                  <option value="Active">Active</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {/* Invoice Filter */}
              <div className="relative">
                <select
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-300 pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Invoice Status</option>
                  <option value="invoiced">Invoiced</option>
                  <option value="not-invoiced">Not Invoiced</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {(selectedWorkerId ||
              search ||
              statusFilter ||
              invoiceFilter ||
              selectedDate) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 border border-red-300 hover:bg-red-100 transition-colors shadow-sm"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 p-12">
              <div className="h-12 w-12 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
              <p className="text-lg font-medium text-blue-600">
                Loading shifts...
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 border border-red-300 p-6 flex items-center space-x-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Error Loading Data
                </h3>
                <p className="text-red-600">{String(error)}</p>
              </div>
            </div>
          )}

          {/* Accordion View */}
          {!loading && !error && filteredShifts.length > 0 && (
            <div>
              {Object.entries(shiftsGroupedByWorker).map(
                ([workerId, workerShifts]) => {
                  const workerInfo = workerIdToInfo[workerId];
                  if (!workerInfo) return null;

                  const isExpanded = expandedWorkerId === workerId;
                  const workerStats = getShiftStats(workerShifts);

                  const initials =
                    workerInfo.name
                      ?.split(" ")
                      .map((p) => p?.[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "??";

                  return (
                    <div
                      key={workerId}
                      className="bg-white border-b border-gray-200 shadow-sm overflow-hidden"
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() =>
                          setExpandedWorkerId(isExpanded ? null : workerId)
                        }
                        className="w-full flex flex-col lg:flex-row lg:items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0 lg:w-1/3">
                          {workerInfo.profilePictureUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={workerInfo.profilePictureUrl}
                              alt={`${workerInfo.name}'s profile`}
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-md font-semibold text-blue-700">
                              {initials}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-lg text-gray-900">
                              {workerInfo.name}
                            </p>
                          </div>
                        </div>

                        {/* Worker-Specific Stats */}
                        <div className="grid grid-cols-2 gap-4 flex-grow lg:grid-cols-5 lg:gap-4 lg:w-2/3">
                          <div className="p-2 border border-blue-200 rounded-md bg-gray-50 text-center">
                            <div className="text-sm font-bold text-blue-700">
                              {workerStats.total}
                            </div>
                            <div className="text-xs text-gray-600">Shifts</div>
                          </div>
                          <div className="p-2 border border-green-200 rounded-md bg-green-50 text-center">
                            <div className="text-sm font-bold text-green-700">
                              {workerStats.closed}
                            </div>
                            <div className="text-xs text-gray-600">
                              Shift End
                            </div>
                          </div>
                          <div className="p-2 bg-yellow-50 border border-yellow-200 text-center">
                            <div className="text-sm font-bold text-yellow-700">
                              {workerStats.open}
                            </div>
                            <div className="text-xs text-gray-600">
                              Shift Open
                            </div>
                          </div>
                          <div className="p-2 border border-indigo-200 rounded-md bg-indigo-50 text-center">
                            <div className="text-sm font-bold text-indigo-700">
                              {workerStats.totalHours}h
                            </div>
                            <div className="text-xs text-gray-600">Hours</div>
                          </div>
                          <div className="p-2 border border-purple-200 rounded-md bg-purple-50 text-center">
                            <div className="text-sm font-bold text-purple-700">
                              {workerStats.invoiced}
                            </div>
                            <div className="text-xs text-gray-600">
                              Invoiced
                            </div>
                          </div>
                        </div>

                        <ChevronDown
                          className={`h-6 w-6 text-gray-500 transition-transform mt-4 lg:mt-0 lg:ml-4 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Accordion Panel with Data Table */}
                      {isExpanded && <WorkerShiftTable shifts={workerShifts} />}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {!loading && !error && filteredShifts.length === 0 && (
          <div className="bg-white rounded-md border border-gray-200 shadow-lg p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300">
                <ListOrdered className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                No Shifts Found
              </h3>
              <p className="text-gray-600">
                {selectedWorkerId ||
                search ||
                statusFilter ||
                invoiceFilter ||
                selectedDate
                  ? "No shifts match your current filters. Try adjusting your search criteria."
                  : "No shifts have been recorded yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShifts;
