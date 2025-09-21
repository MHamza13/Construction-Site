import {
  X,
  User,
  Mail,
  DollarSign,
  Clock,
  Plus,
  Trash2,
  Download,
  Upload,
  FileText,
  Save,
  RotateCcw,
  Send,
  Receipt,
  Folder,
  StickyNote,
  Calendar,
  Hash,
} from "lucide-react";

const InvoiceModal = ({
  worker,
  closeModal,
  populateDetailedShifts,
  updateDetailedShift,
  addDetailedShift,
  removeDetailedShift,
  updateAllDailyWages,
  recalculateDetailedTotals,
  saveChanges,
  resetToOriginal,
  handleFileUpload,
  downloadFile,
  removeFile,
  sendInvoiceEmail,
  generateInvoice,
  setModalWorker,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4"
      onClick={closeModal}
    >
      <div
        className="flex items-center justify-center min-h-screen"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full  max-h-[540px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center">
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
                      <Hash className="w-4 h-4 text-gray-500" />
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
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-amber-900">
                    Pay Rate Settings
                  </h4>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Default Daily Wage (8 hours)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        step="0.01"
                        defaultValue="200.00"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onChange={(e) =>
                          updateAllDailyWages(
                            worker.id,
                            parseFloat(e.target.value) || 200
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Overtime Rate Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      defaultValue={worker.overtimeRate}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onChange={(e) => {
                        setModalWorker({
                          ...worker,
                          overtimeRate: parseFloat(e.target.value) || 1.5,
                        });
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        Standard rate × multiplier (e.g., 1.5 = time and a half)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Editable Shifts Table */}
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
                  <button
                    onClick={() => addDetailedShift(worker.id)}
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Shift</span>
                  </button>
                </div>

                {/* Desktop Table */}
                <div className="hidden xl:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-gray-200">
                      <tr className="text-sm">
                        <th className="p-4 text-left font-medium text-gray-700">
                          Date
                        </th>
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
                          Calc. Hours
                        </th>
                        <th className="p-4 text-left font-medium text-gray-700">
                          Adj. Hours
                        </th>
                        <th className="p-4 text-left font-medium text-gray-700">
                          Daily Wage
                        </th>
                        <th className="p-4 text-center font-medium text-gray-700">
                          OT Hours
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
                      {populateDetailedShifts(worker).map((shift) => (
                        <tr
                          key={shift.index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3">
                            <input
                              type="date"
                              value={shift.date}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onChange={(e) =>
                                updateDetailedShift(
                                  worker.id,
                                  shift.index,
                                  "date",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={shift.shiftId}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onChange={(e) =>
                                updateDetailedShift(
                                  worker.id,
                                  shift.index,
                                  "shiftId",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="time"
                              value={shift.checkIn}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onChange={(e) =>
                                updateDetailedShift(
                                  worker.id,
                                  shift.index,
                                  "checkIn",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="time"
                              value={shift.endShift}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onChange={(e) =>
                                updateDetailedShift(
                                  worker.id,
                                  shift.index,
                                  "endShift",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                              <Clock className="w-3 h-3 text-blue-600" />
                              <span className="font-medium text-blue-700 text-sm">
                                {shift.calculatedHours.toFixed(1)}h
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              step="0.1"
                              value={shift.adjustedHours || ""}
                              placeholder={shift.calculatedHours.toFixed(1)}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              onChange={(e) =>
                                updateDetailedShift(
                                  worker.id,
                                  shift.index,
                                  "adjustedHours",
                                  parseFloat(e.target.value) || null
                                )
                              }
                            />
                          </td>
                          <td className="p-3">
                            <div className="relative">
                              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                type="number"
                                step="0.01"
                                value={shift.dailyWage}
                                className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                onChange={(e) =>
                                  updateDetailedShift(
                                    worker.id,
                                    shift.index,
                                    "dailyWage",
                                    parseFloat(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-full">
                              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                              <span className="font-medium text-orange-600 text-sm">
                                {shift.payData.overtimeHours.toFixed(1)}h
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="font-bold text-green-600 text-lg">
                              ${shift.payData.totalPay.toFixed(2)}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() =>
                                removeDetailedShift(worker.id, shift.index)
                              }
                              className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-lg text-sm font-medium transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="xl:hidden p-4 space-y-4">
                  {populateDetailedShifts(worker).map((shift) => (
                    <div
                      key={shift.index}
                      className="bg-gray-50 rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-semibold text-gray-900">
                          Shift {shift.shiftId}
                        </h5>
                        <button
                          onClick={() =>
                            removeDetailedShift(worker.id, shift.index)
                          }
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={shift.date}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              updateDetailedShift(
                                worker.id,
                                shift.index,
                                "date",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Shift ID
                          </label>
                          <input
                            type="text"
                            value={shift.shiftId}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              updateDetailedShift(
                                worker.id,
                                shift.index,
                                "shiftId",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Check-In
                          </label>
                          <input
                            type="time"
                            value={shift.checkIn}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              updateDetailedShift(
                                worker.id,
                                shift.index,
                                "checkIn",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            End Shift
                          </label>
                          <input
                            type="time"
                            value={shift.endShift}
                            className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              updateDetailedShift(
                                worker.id,
                                shift.index,
                                "endShift",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">
                            Calculated Hours
                          </div>
                          <div className="font-medium text-blue-600">
                            {shift.calculatedHours.toFixed(1)}h
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">
                            Total Pay
                          </div>
                          <div className="font-bold text-green-600">
                            ${shift.payData.totalPay.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">
                      Total Shifts
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {recalculateDetailedTotals(worker).totalShifts}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">
                      Total Hours
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {recalculateDetailedTotals(worker).totalHours.toFixed(1)}h
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-sm text-gray-600 mb-1">
                      Overtime Hours
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {recalculateDetailedTotals(
                        worker
                      ).totalOvertimeHours.toFixed(1)}
                      h
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200">
                    <div className="text-sm text-gray-600 mb-1">Total Pay</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${recalculateDetailedTotals(worker).totalPay.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

             

              {/* Notes Section */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <StickyNote className="w-4 h-4 text-gray-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Internal Notes
                  </h4>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notes
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    placeholder="Add internal notes about this invoice..."
                    value={worker.internalNotes || ""}
                    onChange={(e) =>
                      setModalWorker({
                        ...worker,
                        internalNotes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => saveChanges(worker.id)}
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => resetToOriginal(worker.id)}
                  className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => sendInvoiceEmail(worker.id)}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
              </div>
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
