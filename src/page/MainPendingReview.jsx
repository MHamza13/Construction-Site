"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/PendingReview/Header";
import SummaryStats from "@/components/PendingReview/SummaryStats";
import FiltersAndActions from "@/components/PendingReview/FiltersAndActions";
import WorkersTable from "@/components/PendingReview/WorkersTable";
import InvoiceModal from "@/components/PendingReview/InvoiceModal.jsx";
import Banner from "@/components/layout/Banner";

//  JSON Data
const jsonWorkersData = [
  {
    Worker: "Shahzaib Mughal  Shahzaib Mughal ",
    WorkerID: 9,
    Email: "fortest372.sms@gmail.com",
    HourlyRate: 0.0,
    DailyWagesRate: 0.0,
    PayPeriod: "Sep 10-11, 2025",
    Shifts: 3,
    TotalHours: 16.25,
    Overtime: 1.0,
    TotalPay: 0.0,
    Status: "Pending Review",
    Actions: ["Details", "Process"],
    ShiftDetails: [
      {
        ShiftId: 1,
        PayPeriod: "2025-09-10 09:00:00",
        CheckIn: "2025-09-10 09:00:00",
        CheckOut: "2025-09-10 18:00:00",
        TotalHours: 9.0,
        DailyWagesHours: 8.0,
        ExtraHours: 1.0,
      },
      {
        ShiftId: 2,
        PayPeriod: "2025-09-11 09:45:00",
        CheckIn: "2025-09-11 09:45:00",
        CheckOut: "2025-09-11 15:00:00",
        TotalHours: 5.25,
        DailyWagesHours: 5.25,
        ExtraHours: 0,
      },
      {
        ShiftId: 3,
        PayPeriod: "2025-09-11 16:00:00",
        CheckIn: "2025-09-11 16:00:00",
        CheckOut: "2025-09-11 18:00:00",
        TotalHours: 2.0,
        DailyWagesHours: 2.0,
        ExtraHours: 0,
      },
    ],
  },
  {
    Worker: "M M",
    WorkerID: 12,
    Email: "iamhamza013@gmail.com",
    HourlyRate: null,
    DailyWagesRate: null,
    PayPeriod: "Sep 10-15, 2025",
    Shifts: 5,
    TotalHours: 23.01,
    Overtime: 1.23,
    TotalPay: null,
    Status: "Pending Review",
    Actions: ["Details", "Process"],
    ShiftDetails: [
      {
        ShiftId: 4,
        PayPeriod: "2025-09-10 09:00:00",
        CheckIn: "2025-09-10 09:00:00",
        CheckOut: "2025-09-10 13:00:00",
        TotalHours: 4.0,
        DailyWagesHours: 4.0,
        ExtraHours: 0,
      },
      {
        ShiftId: 5,
        PayPeriod: "2025-09-10 14:00:00",
        CheckIn: "2025-09-10 14:00:00",
        CheckOut: "2025-09-10 17:00:00",
        TotalHours: 3.0,
        DailyWagesHours: 3.0,
        ExtraHours: 0,
      },
      {
        ShiftId: 8,
        PayPeriod: "2025-09-10 19:13:00",
        CheckIn: "2025-09-10 19:13:00",
        CheckOut: "2025-09-10 21:00:00",
        TotalHours: 1.78,
        DailyWagesHours: 1.0,
        ExtraHours: 0.78,
      },
      {
        ShiftId: 6,
        PayPeriod: "2025-09-12 09:33:00",
        CheckIn: "2025-09-12 09:33:00",
        CheckOut: "2025-09-12 18:00:00",
        TotalHours: 8.45,
        DailyWagesHours: 8.0,
        ExtraHours: 0.45,
      },
      {
        ShiftId: 7,
        PayPeriod: "2025-09-15 09:13:00",
        CheckIn: "2025-09-15 09:13:00",
        CheckOut: "2025-09-15 15:00:00",
        TotalHours: 5.78,
        DailyWagesHours: 5.78,
        ExtraHours: 0,
      },
    ],
  },
];

const PendingReview = () => {
  // State management for your JSON data
  const [workers, setWorkers] = useState([]);
  const [originalJsonData, setOriginalJsonData] = useState(jsonWorkersData);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [fromDate, setFromDate] = useState("2025-09-01");
  const [toDate, setToDate] = useState("2025-09-30");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalWorker, setModalWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from JSON
  useEffect(() => {
    const loadJsonData = () => {
      setIsLoading(true);
      // Simulate API loading delay
      setTimeout(() => {
        setWorkers([...originalJsonData]);
        setIsLoading(false);
      }, 500);
    };

    loadJsonData();
  }, []);

  // Data transformation functions for your JSON structure
  const transformWorkerData = (jsonWorker) => ({
    id: jsonWorker.WorkerID.toString(),
    name: jsonWorker.Worker.trim(),
    email: jsonWorker.Email,
    totalHours: jsonWorker.TotalHours,
    overtimeHours: jsonWorker.Overtime,
    totalPay: jsonWorker.TotalPay,
    status: jsonWorker.Status.toLowerCase().replace(/\s+/g, ""), // "Pending Review" -> "pendingreview"
    shifts: jsonWorker.Shifts,
    avatar: jsonWorker.Worker.trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase(),
    payPeriod: "current-week", // You can map this based on your needs
    periodLabel: jsonWorker.PayPeriod,
    hourlyRate: jsonWorker.HourlyRate,
    dailyWagesRate: jsonWorker.DailyWagesRate,
    actions: jsonWorker.Actions,
    shiftDetails: jsonWorker.ShiftDetails || [],
    // Convert shift details for the modal
    detailedShifts: jsonWorker.ShiftDetails
      ? jsonWorker.ShiftDetails.map((shift, index) => ({
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
    overtimeRate: 1.5,
    internalNotes: "",
    uploadedFiles: [],
  });

  // Status helpers - Updated for your JSON structure
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

  // Filter and search functions

  const applyFilters = () => {
    let filteredWorkers = [...originalJsonData];

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

    // Date range filter (if custom)
    if (showCustomDateRange && fromDate && toDate) {
      filteredWorkers = filteredWorkers.filter((worker) => {
        // You can implement date filtering based on PayPeriod or other date fields
        return true; // Placeholder - implement based on your date logic
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
    setWorkers([...originalJsonData]);
    updateFilterStatus(originalJsonData.length);
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

  // Statistics calculation from your JSON data
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

  // Modal functions for detailed view
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

  // Process functions for your JSON data
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
      // Update the worker status in both arrays
      const updatedWorkers = workers.map((w) =>
        w.WorkerID.toString() === workerId.toString()
          ? { ...w, Status: "Processed" }
          : w
      );

      const updatedOriginalData = originalJsonData.map((w) =>
        w.WorkerID.toString() === workerId.toString()
          ? { ...w, Status: "Processed" }
          : w
      );

      setWorkers(updatedWorkers);
      setOriginalJsonData(updatedOriginalData);
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

      const updatedOriginalData = originalJsonData.map((w) =>
        w.Status.toLowerCase().includes("approved")
          ? { ...w, Status: "Processed" }
          : w
      );

      setWorkers(updatedWorkers);
      setOriginalJsonData(updatedOriginalData);
      showNotification(
        `Successfully processed ${approvedWorkers.length} invoices.`,
        "success"
      );
    }
  };

  const exportPayroll = () => {
    // Create CSV data from your JSON structure
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
    // In real implementation, you would generate and download the CSV file
  };

  // Detailed shift management functions for modal
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

    // Update the original data with changes
    const updatedOriginalData = originalJsonData.map((worker) => {
      if (worker.WorkerID.toString() === workerId.toString()) {
        return {
          ...worker,
          // Update any changed fields here
          internalNotes: modalWorker.internalNotes || "",
        };
      }
      return worker;
    });

    setOriginalJsonData(updatedOriginalData);
    applyFilters(); // Refresh the filtered data
    closeModal();
    showNotification(`Changes saved for ${modalWorker.name}`, "success");
  };

  const resetToOriginal = (workerId) => {
    if (window.confirm("Reset all changes to original values?")) {
      const originalWorker = originalJsonData.find(
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
    if (!isLoading) {
      applyFilters();
    }
  }, [statusFilter, searchInput, dateFilter, fromDate, toDate]);

  // Initialize filter status
  useEffect(() => {
    updateFilterStatus(workers.length);
  }, [workers, statusFilter, searchInput]);

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workers data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      {/* Banner */}
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
