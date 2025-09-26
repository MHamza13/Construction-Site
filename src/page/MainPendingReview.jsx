"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayroll } from "@/redux/payRole/PayRole";
import Header from "@/components/PendingReview/Header";
import SummaryStats from "@/components/PendingReview/SummaryStats";
import FiltersAndActions from "@/components/PendingReview/FiltersAndActions";
import WorkersTable from "@/components/PendingReview/WorkersTable";
import InvoiceModal from "@/components/PendingReview/InvoiceModal.jsx";
import Banner from "@/components/layout/Banner";

const PendingReview = () => {
  const dispatch = useDispatch();
  const {
    data: apiWorkersData,
    loading,
    error,
  } = useSelector((state) => state.payroll);  

  console.log("API Workers Data:", apiWorkersData);

  // Calculate default date range: current date to 7 days prior
  const today = new Date();
  const past7Days = new Date();
  past7Days.setDate(today.getDate() - 15);

  const formatDate = (date, endOfDay = false) => {
    if (endOfDay) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date.toISOString();
  };

  // State management
  const [workers, setWorkers] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [fromDate, setFromDate] = useState(formatDate(past7Days));
  const [toDate, setToDate] = useState(formatDate(today));
  const [filterStatus, setFilterStatus] = useState("");
  const [modalWorker, setModalWorker] = useState(null);

  // Fetch payroll data from API
  useEffect(() => {
    dispatch(fetchPayroll({ startDate: past7Days, endDate: today }));
  }, [dispatch, fromDate, toDate]);

  // Update workers state when API data changes
  useEffect(() => {
    if (apiWorkersData) {
      setWorkers(apiWorkersData);
      setOriginalData(apiWorkersData);
      updateFilterStatus(apiWorkersData.length);
    }
  }, [apiWorkersData]);

  // Data transformation functions
  const transformWorkerData = (jsonWorker) => ({
    id: jsonWorker.WorkerID.toString(),
    name: jsonWorker.Worker.trim(),
    email: jsonWorker.Email,
    totalHours: jsonWorker.TotalHours,
    overtimeHours: jsonWorker.Overtime,
    totalPay: jsonWorker.TotalPay,
    status: jsonWorker.Status.toLowerCase().replace(/\s+/g, ""),
    shifts: jsonWorker.Shifts,
    avatar: jsonWorker.Worker.trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase(),
    payPeriod: "current-week",
    periodLabel: jsonWorker.PayPeriod,
    hourlyRate: jsonWorker.HourlyRate,
    dailyWagesRate: jsonWorker.DailyWagesRate,
    actions: jsonWorker.Actions,
    shiftDetails: jsonWorker.ShiftDetails || [],
    detailedShifts: jsonWorker.ShiftDetails
      ? jsonWorker.ShiftDetails.map((shift) => ({
          date: new Date(shift.CheckIn).toISOString().split("T")[0],
          shiftId: `SH${String(shift.ShiftId).padStart(3, "0")}`,
          checkIn: new Date(shift.CheckIn).toTimeString().substring(0, 5),
          endShift: new Date(shift.CheckOut).toTimeString().substring(0, 5),
          adjustedHours: shift.TotalHours,
          dailyWage: jsonWorker.DailyWagesRate || 200,
          calculatedHours: shift.TotalHours,
          dailyWagesHours: shift.DailyWagesHours,
          extraHours: shift.ExtraHours,
        }))
      : [],
    overtimeRate: jsonWorker.Overtime,
    internalNotes: "",
    uploadedFiles: [],
  });

  // Status helpers
  const getStatusColor = (status) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "");
    switch (normalizedStatus) {
      case "pendingreview":
      case "pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "approved":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "processed":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getStatusText = (status) => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, "");
    switch (normalizedStatus) {
      case "pendingreview":
      case "pending":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "processed":
        return "Processed";
      default:
        return "Unknown";
    }
  };

  // Date parsing helper (for "Sep 18-18, 2025" format)
  const parsePayPeriod = (payPeriod) => {
    if (!payPeriod) return { start: null, end: null };

    // Example: "Sep 18-18, 2025"
    const [monthDay, year] = payPeriod.split(",");
    const [month, range] = monthDay.trim().split(" ");
    const [startDay, endDay] = range.split("-");

    const startDate = new Date(`${month} ${startDay}, ${year.trim()}`);
    const endDate = new Date(`${month} ${endDay}, ${year.trim()}`);

    return { start: startDate, end: endDate };
  };

  // Filter and search functions
  const applyFilters = () => {
    let filteredWorkers = [...originalData];

    // Status filter
    if (statusFilter !== "all") {
      const filterValue = statusFilter.toLowerCase().replace(/\s+/g, "");
      filteredWorkers = filteredWorkers.filter((worker) => {
        const workerStatus = worker.Status.toLowerCase().replace(/\s+/g, "");
        return (
          workerStatus.includes(filterValue) || workerStatus === filterValue
        );
      });
    }

    // Search filter
    if (searchInput.trim()) {
      const searchTerm = searchInput.toLowerCase().trim();
      filteredWorkers = filteredWorkers.filter(
        (worker) =>
          worker.Worker.toLowerCase().includes(searchTerm) ||
          worker.Email.toLowerCase().includes(searchTerm) ||
          worker.WorkerID.toString().includes(searchTerm)
      );
    }

    // Date range filter (PayPeriod based)
    if (showCustomDateRange && fromDate && toDate) {
      const filterStartDate = new Date(fromDate);
      const filterEndDate = new Date(toDate);

      filteredWorkers = filteredWorkers.filter((worker) => {
        const { start, end } = parsePayPeriod(worker.PayPeriod);

        if (!start || !end) return false;

        return start >= filterStartDate && end <= filterEndDate;
      });
    }

    setWorkers(filteredWorkers);
    updateFilterStatus(filteredWorkers.length);
  };

  const resetFilters = () => {
    setDateFilter("all");
    setStatusFilter("all");
    setSearchInput("");
    setShowCustomDateRange(false);
    setFromDate("2025-09-01");
    setToDate("2025-09-30");
    setWorkers([...originalData]);
    updateFilterStatus(originalData.length);
  };

  const updateFilterStatus = (count) => {
    let statusText = `Showing: ${count} worker${count !== 1 ? "s" : ""}`;

    if (statusFilter !== "all") {
      statusText += ` with status "${statusFilter}"`;
    }

    if (searchInput.trim()) {
      statusText += ` matching "${searchInput}"`;
    }

    setFilterStatus(statusText);
  };

  // Statistics calculation
  const calculateStats = () => {
    const totalEmployees = workers.length;
    const totalPayroll = workers.reduce((sum, worker) => {
      const pay = worker.TotalPay === null ? 0 : worker.TotalPay;
      return sum + pay;
    }, 0);
    const pendingCount = workers.filter((w) =>
      w.Status.toLowerCase().includes("pending")
    ).length;
    const processedCount = workers.filter((w) =>
      w.Status.toLowerCase().includes("processed")
    ).length;

    return {
      totalEmployees,
      totalPayroll,
      pendingCount,
      processedCount,
      trends: {
        employees: 0,
        payroll: 0,
        pending: 0,
        processed: 0,
      },
    };
  };

  // Modal functions
  const viewDetails = (workerId) => {
    const jsonWorker = workers.find(
      (w) => w.WorkerID.toString() === workerId.toString()
    );
    if (!jsonWorker) return;

    const transformedWorker = transformWorkerData(jsonWorker);
    setModalWorker(transformedWorker);
  };

  const closeModal = () => {
    setModalWorker(null);
  };

  // Process functions
  const processInvoice = (workerId) => {
    const worker = workers.find(
      (w) => w.WorkerID.toString() === workerId.toString()
    );
    if (!worker || worker.Status.toLowerCase().includes("processed")) return;

    if (
      window.confirm(
        `Process invoice for ${worker.Worker.trim()}? This action cannot be undone.`
      )
    ) {
      const updatedWorkers = workers.map((w) =>
        w.WorkerID.toString() === workerId.toString()
          ? { ...w, Status: "Processed" }
          : w
      );

      const updatedOriginalData = originalData.map((w) =>
        w.WorkerID.toString() === workerId.toString()
          ? { ...w, Status: "Processed" }
          : w
      );

      setWorkers(updatedWorkers);
      setOriginalData(updatedOriginalData);
      closeModal();
      showNotification(
        `Invoice processed successfully for ${worker.Worker.trim()}`,
        "success"
      );
    }
  };

  const processAllApproved = () => {
    const approvedWorkers = workers.filter((w) =>
      w.Status.toLowerCase().includes("approved")
    );
    if (approvedWorkers.length === 0) {
      showNotification("No approved invoices to process.", "warning");
      return;
    }

    if (
      window.confirm(`Process ${approvedWorkers.length} approved invoices?`)
    ) {
      const updatedWorkers = workers.map((w) =>
        w.Status.toLowerCase().includes("approved")
          ? { ...w, Status: "Processed" }
          : w
      );

      const updatedOriginalData = originalData.map((w) =>
        w.Status.toLowerCase().includes("approved")
          ? { ...w, Status: "Processed" }
          : w
      );

      setWorkers(updatedWorkers);
      setOriginalData(updatedOriginalData);
      showNotification(
        `Successfully processed ${approvedWorkers.length} invoices.`,
        "success"
      );
    }
  };

  const exportPayroll = () => {
    const csvData = workers.map((worker) => ({
      WorkerID: worker.WorkerID,
      Name: worker.Worker.trim(),
      Email: worker.Email,
      PayPeriod: worker.PayPeriod,
      TotalHours: worker.TotalHours,
      OvertimeHours: worker.Overtime,
      TotalPay: worker.TotalPay,
      Status: worker.Status,
      Shifts: worker.Shifts,
    }));

    showNotification(
      "Payroll report exported successfully! Check your downloads.",
      "success"
    );
  };

  // Detailed shift management functions
  const calculateDetailedHours = (checkIn, endShift) => {
    if (!checkIn || !endShift) return 0;
    const [checkInHour, checkInMin] = checkIn.split(":").map(Number);
    const [endHour, endMin] = endShift.split(":").map(Number);
    let checkInMinutes = checkInHour * 60 + checkInMin;
    let endMinutes = endHour * 60 + endMin;
    if (endMinutes < checkInMinutes) {
      endMinutes += 24 * 60;
    }
    return (endMinutes - checkInMinutes) / 60;
  };

  const calculateDetailedPay = (
    totalHours,
    adjustedHours,
    dailyWage,
    overtimeRate
  ) => {
    const effectiveHours = adjustedHours || totalHours;
    const regularHours = Math.min(effectiveHours, 8);
    const overtimeHours = Math.max(effectiveHours - 8, 0);
    const hourlyRate = dailyWage / 8;
    const overtimeHourlyRate = hourlyRate * overtimeRate;



    return {
      regularHours,
      overtimeHours,
      regularPay: regularHours * hourlyRate,
      overtimePay: overtimeHours * overtimeHourlyRate,
      totalPay: regularHours * hourlyRate + overtimeHours * overtimeHourlyRate,
    };
  };

  const populateDetailedShifts = (worker) => {
    if (!worker || !worker.detailedShifts) return [];
    return worker.detailedShifts.map((shift, index) => {
      const calculatedHours = calculateDetailedHours(
        shift.checkIn,
        shift.endShift
      );
      const payData = calculateDetailedPay(
        calculatedHours,
        shift.adjustedHours,
        shift.dailyWage,
        worker.overtimeRate
      );
      return { ...shift, calculatedHours, payData, index };
    });
  };

  const updateDetailedShift = (workerId, shiftIndex, field, value) => {
    if (modalWorker && modalWorker.id === workerId) {
      const updatedShifts = [...modalWorker.detailedShifts];
      if (updatedShifts[shiftIndex]) {
        updatedShifts[shiftIndex][field] = value;
        setModalWorker({ ...modalWorker, detailedShifts: updatedShifts });
      }
    }
  };

  const addDetailedShift = (workerId) => {
    if (modalWorker && modalWorker.id === workerId) {
      const newShift = {
        date: new Date().toISOString().split("T")[0],
        shiftId: `SH${String(modalWorker.detailedShifts.length + 1).padStart(
          3,
          "0"
        )}`,
        checkIn: "09:00",
        endShift: "17:00",
        adjustedHours: null,
        dailyWage: modalWorker.dailyWagesRate || 200,
      };
      setModalWorker({
        ...modalWorker,
        detailedShifts: [...modalWorker.detailedShifts, newShift],
      });
    }
  };

  const removeDetailedShift = (workerId, shiftIndex) => {
    if (
      window.confirm("Remove this shift?") &&
      modalWorker &&
      modalWorker.id === workerId
    ) {
      const updatedShifts = modalWorker.detailedShifts.filter(
        (_, index) => index !== shiftIndex
      );
      setModalWorker({ ...modalWorker, detailedShifts: updatedShifts });
    }
  };

  const updateAllDailyWages = (workerId, newWage) => {
    if (modalWorker && modalWorker.id === workerId) {
      const updatedShifts = modalWorker.detailedShifts.map((shift) => ({
        ...shift,
        dailyWage: newWage,
      }));
      setModalWorker({ ...modalWorker, detailedShifts: updatedShifts });
    }
  };

  const recalculateDetailedTotals = (worker) => {
    if (!worker || !worker.detailedShifts) {
      return {
        totalShifts: 0,
        totalHours: 0,
        totalRegularHours: 0,
        totalOvertimeHours: 0,
        totalRegularPay: 0,
        totalOvertimePay: 0,
        totalPay: 0,
      };
    }

    let totalShifts = worker.detailedShifts.length;
    let totalHours = 0;
    let totalRegularHours = 0;
    let totalOvertimeHours = 0;
    let totalRegularPay = 0;
    let totalOvertimePay = 0;

    worker.detailedShifts.forEach((shift) => {
      const calculatedHours = calculateDetailedHours(
        shift.checkIn,
        shift.endShift
      );
      const payData = calculateDetailedPay(
        calculatedHours,
        shift.adjustedHours,
        shift.dailyWage,
        worker.overtimeRate
      );
      const effectiveHours = shift.adjustedHours || calculatedHours;
      totalHours += effectiveHours;
      totalRegularHours += payData.regularHours;
      totalOvertimeHours += payData.overtimeHours;
      totalRegularPay += payData.regularPay;
      totalOvertimePay += payData.overtimePay;
    });

    return {
      totalShifts,
      totalHours,
      totalRegularHours,
      totalOvertimeHours,
      totalRegularPay,
      totalOvertimePay,
      totalPay: totalRegularPay + totalOvertimePay,
    };
  };

  // File management functions
  const handleFileUpload = (workerId, event) => {
    if (!modalWorker || modalWorker.id !== workerId) return;

    const files = Array.from(event.target.files);
    const fileData = files.map((file) => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: formatFileSize(file.size),
      uploadDate: new Date().toLocaleDateString(),
      type: file.type,
    }));

    setModalWorker({
      ...modalWorker,
      uploadedFiles: [...(modalWorker.uploadedFiles || []), ...fileData],
    });

    event.target.value = "";
    showNotification(
      `${files.length} file(s) uploaded successfully`,
      "success"
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const downloadFile = (workerId, fileId) => {
    showNotification("File download started", "info");
  };

  const removeFile = (workerId, fileId) => {
    if (
      window.confirm("Remove this file?") &&
      modalWorker &&
      modalWorker.id === workerId
    ) {
      const updatedFiles = modalWorker.uploadedFiles.filter(
        (f) => f.id !== fileId
      );
      setModalWorker({ ...modalWorker, uploadedFiles: updatedFiles });
      showNotification("File removed successfully", "success");
    }
  };

  const saveChanges = (workerId) => {
    if (!modalWorker) return;

    const updatedOriginalData = originalData.map((worker) => {
      if (worker.WorkerID.toString() === workerId.toString()) {
        return {
          ...worker,
          internalNotes: modalWorker.internalNotes || "",
        };
      }
      return worker;
    });

    setOriginalData(updatedOriginalData);
    applyFilters();
    closeModal();
    showNotification(`Changes saved for ${modalWorker.name}`, "success");
  };

  const resetToOriginal = (workerId) => {
    if (window.confirm("Reset all changes to original values?")) {
      const originalWorker = originalData.find(
        (w) => w.WorkerID.toString() === workerId.toString()
      );
      if (originalWorker) {
        const resetWorker = transformWorkerData(originalWorker);
        setModalWorker(resetWorker);
        showNotification("Changes reset to original values", "info");
      }
    }
  };

  const generateInvoice = (workerId) => {
    if (!modalWorker) return;

    if (
      window.confirm(
        `Generate invoice for ${modalWorker.name}?\n\nThis will create the final invoice document.`
      )
    ) {
      showNotification(
        `Invoice generated successfully for ${modalWorker.name}`,
        "success"
      );
    }
  };

  const sendInvoiceEmail = (workerId) => {
    if (!modalWorker) return;
    showNotification(`Invoice email sent to ${modalWorker.email}`, "info");
  };

  // Notification system
  const showNotification = (message, type = "info") => {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      info: "bg-blue-500",
      warning: "bg-yellow-500",
    };

    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    if (!loading && apiWorkersData) {
      applyFilters();
    }
  }, [statusFilter, searchInput, dateFilter, fromDate, toDate, apiWorkersData]);

  // Initialize filter status
  useEffect(() => {
    if (apiWorkersData) {
      updateFilterStatus(workers.length);
    }
  }, [workers, statusFilter, searchInput]);

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workers data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <Banner
        title="Pending Reviews"
        breadcrumb={[
          { label: "Home", href: "#" },
          { label: "Pending Reviews" },
        ]}
      />
      <div className="mt-6">
        <SummaryStats stats={stats} />
        <FiltersAndActions
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          showCustomDateRange={showCustomDateRange}
          setShowCustomDateRange={setShowCustomDateRange}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          filterStatus={filterStatus}
          resetFilters={resetFilters}
          processAllApproved={processAllApproved}
          exportPayroll={exportPayroll}
        />
        <div className="w-full">
          <WorkersTable
            workers={workers}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            viewDetails={viewDetails}
            processInvoice={processInvoice}
          />
        </div>
        {modalWorker && (
          <InvoiceModal
            worker={modalWorker}
            closeModal={closeModal}
            populateDetailedShifts={populateDetailedShifts}
            updateDetailedShift={updateDetailedShift}
            addDetailedShift={addDetailedShift}
            removeDetailedShift={removeDetailedShift}
            updateAllDailyWages={updateAllDailyWages}
            recalculateDetailedTotals={recalculateDetailedTotals}
            saveChanges={saveChanges}
            resetToOriginal={resetToOriginal}
            handleFileUpload={handleFileUpload}
            downloadFile={downloadFile}
            removeFile={removeFile}
            sendInvoiceEmail={sendInvoiceEmail}
            generateInvoice={generateInvoice}
            setModalWorker={setModalWorker}
          />
        )}
      </div>
    </div>
  );
};

export default PendingReview;
