import {
  X,
  User,
  Mail,
  DollarSign,
  Clock,
  Trash2,
  Receipt,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const InvoiceModal = ({
  worker,
  closeModal,
  populateDetailedShifts,
  updateDetailedShift,
  removeDetailedShift,
  updateAllDailyWages,
  recalculateDetailedTotals,
  generateInvoice,
  setModalWorker,
}) => {
  console.log("Rendering InvoiceModal for worker:", worker);
  const [expandedDates, setExpandedDates] = useState([]);

  const toggleDate = (date) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const detailedShifts = populateDetailedShifts(worker);

  const groupedShifts = detailedShifts.reduce((acc, shift) => {
    const date = shift.date.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(shift);
    return acc;
  }, {});

  const dates = Object.keys(groupedShifts).sort();

  const calculateDailyTotals = (shifts) => {
    let totalHours = 0;
    let totalOTHours = 0;
    let totalPay = 0;

    shifts.forEach((shift) => {
      const hours = shift.adjustedHours || shift.calculatedHours || 0;
      totalHours += hours;
      totalOTHours += shift.payData?.overtimeHours || 0;
      totalPay += shift.payData?.totalPay || 0;
    });

    return {
      totalHours: Number(totalHours.toFixed(2)),
      totalOTHours: Number(totalOTHours.toFixed(2)),
      totalPay: Number(totalPay.toFixed(2)),
    };
  };

  const handleUpdateShift = (workerId, shiftIndex, field, value) => {
    const parsedValue = parseFloat(value) || 0;
    updateDetailedShift(workerId, shiftIndex, field, parsedValue);
    setModalWorker({
      ...worker,
      detailedShifts: populateDetailedShifts(worker),
    });
    recalculateDetailedTotals(worker);
  };

  const updateDailyWagesForDate = (workerId, date, newDailyWage) => {
    const shiftsToUpdate = detailedShifts.filter(
      (shift) => shift.date.split("T")[0] === date
    );
    shiftsToUpdate.forEach((shift) => {
      updateDetailedShift(workerId, shift.index, "dailyWage", newDailyWage);
      updateDetailedShift(
        workerId,
        shift.index,
        "hourlyRate",
        newDailyWage / 8
      );
    });
    setModalWorker({
      ...worker,
      detailedShifts: populateDetailedShifts(worker),
    });
    recalculateDetailedTotals(worker);
  };

  const updateHourlyRateForDate = (workerId, date, newHourlyRate) => {
    const shiftsToUpdate = detailedShifts.filter(
      (shift) => shift.date.split("T")[0] === date
    );
    shiftsToUpdate.forEach((shift) => {
      updateDetailedShift(workerId, shift.index, "hourlyRate", newHourlyRate);
    });
    setModalWorker({
      ...worker,
      detailedShifts: populateDetailedShifts(worker),
    });
    recalculateDetailedTotals(worker);
  };

  const handleUpdateAllDailyWages = (workerId, newDailyWage) => {
    const newHourlyRate = newDailyWage / 8;
    updateAllDailyWages(workerId, newDailyWage);
    detailedShifts.forEach((shift) => {
      updateDetailedShift(workerId, shift.index, "dailyWage", newDailyWage);
      updateDetailedShift(workerId, shift.index, "hourlyRate", newHourlyRate);
    });
    setModalWorker({
      ...worker,
      dailyWagesRate: Number(newDailyWage) || 200,
      hourlyRate: Number(newHourlyRate) || 25,
      detailedShifts: populateDetailedShifts({
        ...worker,
        dailyWagesRate: Number(newDailyWage) || 200,
        hourlyRate: Number(newHourlyRate) || 25,
      }),
    });
    recalculateDetailedTotals(worker);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={closeModal}
    >
      <div
        className="flex items-center justify-center min-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[540px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Invoice Details</h3>
                  <p className="text-slate-700 text-sm">
                    Worker: {worker.name}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="hover:bg-white/10 cursor-pointer p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Worker Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-blue-900">
                    Worker Information
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Name</span>
                    </div>
                    <p className="font-medium text-gray-900">{worker.name}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Worker ID</span>
                    </div>
                    <p className="font-medium font-mono text-gray-900">
                      {worker.id}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Email</span>
                    </div>
                    <p className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {worker.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay Rate Settings */}
              <div className=" bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-amber-900">
                    Pay Rate Settings
                  </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Daily Wage (All Shifts)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        step="0.01"
                        value={worker.dailyWagesRate || 200}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onChange={(e) => {
                          const newDailyWage =
                            parseFloat(e.target.value) || 200;
                          handleUpdateAllDailyWages(worker.id, newDailyWage);
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>Sets daily wage for all shifts of the worker</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Overtime Rate Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={worker.overtimeRate}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={(e) => {
                        const newOvertimeRate = parseFloat(e.target.value);
                        setModalWorker({
                          ...worker,
                          overtimeRate: newOvertimeRate,
                          detailedShifts: populateDetailedShifts({
                            ...worker,
                            overtimeRate: newOvertimeRate,
                          }),
                        });
                        recalculateDetailedTotals(worker);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Standard rate × multiplier</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Shifts Accordions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-200 space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Shift Details
                    </h4>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {dates.map((date) => {
                    const dailyShifts = groupedShifts[date];
                    const dailyTotals = calculateDailyTotals(dailyShifts);
                    const isExpanded = expandedDates.includes(date);
                    const firstShift = dailyShifts[0] || {};
                    const dailyWage =
                      firstShift.dailyWage || worker.dailyWagesRate || 200;
                    const hourlyRate =
                      firstShift.hourlyRate ||
                      worker.hourlyRate ||
                      dailyWage / 8;

                    return (
                      <div key={date}>
                        <div
                          className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-gray-50 transition-colors"
                          onClick={() => toggleDate(date)}
                        >
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-900">
                              {new Date(date).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-600">
                              {dailyShifts.length} shifts
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              <label className="text-xs text-gray-600">
                                Daily Wage
                              </label>
                              <div className="relative">
                                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={dailyWage}
                                  className="w-full sm:w-24 pl-8 pr-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const newDailyWage =
                                      parseFloat(e.target.value) || 200;
                                    updateDailyWagesForDate(
                                      worker.id,
                                      date,
                                      newDailyWage
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              <label className="text-xs text-gray-600">
                                Hourly Rate
                              </label>
                              <div className="relative">
                                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                  type="number"
                                  step="0.01"
                                  value={hourlyRate}
                                  className="w-full sm:w-24 pl-8 pr-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const newHourlyRate =
                                      parseFloat(e.target.value) || 25;
                                    updateHourlyRateForDate(
                                      worker.id,
                                      date,
                                      newHourlyRate
                                    );
                                  }}
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                Total Hours
                              </p>
                              <p className="font-medium">
                                {dailyTotals.totalHours.toFixed(1)}h
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600">OT Hours</p>
                              <p className="font-medium">
                                {dailyTotals.totalOTHours.toFixed(1)}h
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">Total Pay</p>
                              <p className="font-medium text-green-600">
                                ${dailyTotals.totalPay.toFixed(2)}
                              </p>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="p-4 bg-gray-50">
                            {/* Desktop Table */}
                            <div className="hidden xl:block overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50 border-b border-gray-200">
                                  <tr className="text-sm">
                                    <th className="p-4 text-left font-medium text-gray-700">
                                      Shift ID
                                    </th>
                                    <th className="p-4 text-left font-medium text-gray-700">
                                      Check-In
                                    </th>
                                    <th className="p-4 text-left font-medium text-gray-700">
                                      End-Shift
                                    </th>
                                    <th className="p-4 text-center font-medium text-gray-700">
                                      Total Hours
                                    </th>
                                    <th className="p-4 text-center font-medium text-gray-700">
                                      Adjust Hours
                                    </th>
                                    <th className="p-4 text-center font-medium text-gray-700">
                                      Daily Hours
                                    </th>
                                    <th className="p-4 text-center font-medium text-gray-700">
                                      Regular Pay
                                    </th>
                                    <th className="p-4 text-center font-medium text-gray-700">
                                      Overtime Pay
                                    </th>
                                    <th className="p-4 text-center font-medium text-gray-700">
                                      Total Pay
                                    </th>
                                    <th className="p-4 text-center font-medium text-gray-700">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {dailyShifts.map((shift) => (
                                    <tr
                                      key={shift.index}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <td className="p-3">
                                        <input
                                          type="text"
                                          value={shift.shiftId}
                                          disabled
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="time"
                                          value={shift.checkIn}
                                          disabled
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                        />
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="time"
                                          value={shift.endShift}
                                          disabled
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                        />
                                      </td>
                                      <td className="p-3 text-center">
                                        <div className="inline-flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-">
                                          <span className="font-medium text-blue-700 text-sm">
                                            <div className="space-y-1">
                                              <div className="flex items-center justify-center space-x-1">
                                                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-700 text-sm font-medium">
                                                  {dailyTotals.totalHours.toFixed(
                                                    1
                                                  )}
                                                  h
                                                </span>
                                              </div>
                                              <div className="text-xs text-orange-600">
                                                OT:{" "}
                                                {shift.payData.overtimeHours.toFixed(
                                                  1
                                                )}
                                                h
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                Regular:{" "}
                                                {shift.payData.regularHours.toFixed(
                                                  1
                                                )}
                                                h
                                              </div>
                                            </div>
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <input
                                          type="number"
                                          step="0.1"
                                          value={
                                            shift.adjustedHours ||
                                            shift.calculatedHours.toFixed(1)
                                          }
                                          onChange={(e) =>
                                            handleUpdateShift(
                                              worker.id,
                                              shift.index,
                                              "adjustedHours",
                                              e.target.value
                                            )
                                          }
                                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                      </td>
                                      <td className="p-3 text-center">
                                        <div className="inline-flex items-center space-x-1 bg-indigo-50 px-3 py-1 rounded-lg">
                                          <Clock className="w-3 h-3 text-indigo-600" />
                                          <span className="font-medium text-indigo-700 text-sm">
                                            {shift.payData?.regularHours.toFixed(
                                              1
                                            )}
                                            h
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-3 text-center">
                                        <div className="font-medium text-indigo-600">
                                          $
                                          {shift.payData?.regularPay.toFixed(
                                            2
                                          ) || 0}
                                        </div>
                                      </td>
                                      <td className="p-3 text-center">
                                        <div className="font-medium text-orange-600">
                                          $
                                          {shift.payData?.overtimePay.toFixed(
                                            2
                                          )}
                                        </div>
                                      </td>
                                      <td className="p-3 text-center">
                                        <div className="font-bold text-green-600 text-lg">
                                          ${shift.payData?.totalPay.toFixed(2)}
                                        </div>
                                      </td>
                                      <td className="p-3 text-center">
                                        <button
                                          onClick={() =>
                                            removeDetailedShift(
                                              worker.id,
                                              shift.index
                                            )
                                          }
                                          className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-lg text-sm font-medium transition-all"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          <span>Delete</span>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="xl:hidden space-y-4">
                              {dailyShifts.map((shift) => (
                                <div
                                  key={shift.index}
                                  className="bg-white rounded-lg p-4 space-y-4"
                                >
                                  <div className="flex justify-between items-center">
                                    <h5 className="font-semibold text-gray-900">
                                      Shift {shift.shiftId}
                                    </h5>
                                    <button
                                      onClick={() =>
                                        removeDetailedShift(
                                          worker.id,
                                          shift.index
                                        )
                                      }
                                      className="text-red-600 hover:text-red-800 p-1"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Shift ID
                                      </label>
                                      <input
                                        type="text"
                                        value={shift.shiftId}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Check-In
                                      </label>
                                      <input
                                        type="time"
                                        value={shift.checkIn}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        End Shift
                                      </label>
                                      <input
                                        type="time"
                                        value={shift.endShift}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Total Hours
                                      </label>
                                      <input
                                        type="text"
                                        value={(
                                          shift.adjustedHours ||
                                          shift.calculatedHours
                                        ).toFixed(1)}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Adjusted Hours
                                      </label>
                                      <input
                                        type="number"
                                        step="0.1"
                                        value={
                                          shift.adjustedHours ||
                                          shift.calculatedHours.toFixed(1)
                                        }
                                        onChange={(e) =>
                                          handleUpdateShift(
                                            worker.id,
                                            shift.index,
                                            "adjustedHours",
                                            e.target.value
                                          )
                                        }
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Daily Hours
                                      </label>
                                      <input
                                        type="text"
                                        value={shift.payData?.regularHours.toFixed(
                                          1
                                        )}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Regular Pay
                                      </label>
                                      <input
                                        type="text"
                                        value={shift.payData?.regularPay.toFixed(
                                          2
                                        )}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">
                                        Overtime Pay
                                      </label>
                                      <input
                                        type="text"
                                        value={shift.payData?.overtimePay.toFixed(
                                          2
                                        )}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="bg-white rounded-lg p-3 text-center">
                                      <div className="text-xs text-gray-600 mb-1">
                                        Total Pay
                                      </div>
                                      <div className="font-bold text-green-600 text-lg">
                                        ${shift.payData?.totalPay.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-green-900">
                    Summary
                  </h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-sm text-gray-600">Total Shifts</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {recalculateDetailedTotals(worker).totalShifts}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {recalculateDetailedTotals(worker).totalHours.toFixed(1)}h
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Regular Hours</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {recalculateDetailedTotals(
                        worker
                      ).totalRegularHours.toFixed(1)}
                      h
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overtime Hours</p>
                    <p className="text-lg font-semibold text-orange-600">
                      {recalculateDetailedTotals(
                        worker
                      ).totalOvertimeHours.toFixed(1)}
                      h
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Regular Pay</p>
                    <p className="text-lg font-semibold text-indigo-700">
                      $
                      {recalculateDetailedTotals(
                        worker
                      ).totalRegularPay.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Overtime Pay</p>
                    <p className="text-lg font-semibold text-orange-700">
                      $
                      {recalculateDetailedTotals(
                        worker
                      ).totalOvertimePay.toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2 md:col-span-3 pt-2 border-t border-green-200">
                    <p className="text-sm text-gray-600">Total Pay</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${recalculateDetailedTotals(worker).totalPay.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row justify-end items-center space-y-4 lg:space-y-0">
              <button
                onClick={() => generateInvoice(worker.id)}
                className="inline-flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Receipt className="w-5 h-5" />
                <span>Generate Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
