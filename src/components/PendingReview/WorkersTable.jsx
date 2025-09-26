import { User, Eye, Play, Check, Clock, Calendar, DollarSign } from "lucide-react";

const WorkersTable = ({
  workers,
  getStatusColor,
  getStatusText,
  viewDetails,
  processInvoice,
}) => {
  // Format data from your JSON structure 
  const formatWorkerData = (worker) => ({
    id: worker.WorkerID,
    name: worker.Worker ? worker.Worker.trim() : 'Unknown', // Handle null/undefined names
    email: worker.Email || 'No email',
    totalHours: worker.TotalHours || 0,
    overtimeHours: worker.Overtime || 0,
    totalPay: worker.TotalPay, // Keep as-is, handle in display
    status: worker.Status ? worker.Status.toLowerCase().replace(' ', '') : 'unknown',
    shifts: worker.Shifts || 0,
    payPeriod: worker.PayPeriod || 'N/A',
    shiftDetails: worker.ShiftDetails || [],
    // Generate avatar from name initials safely
    avatar: worker.Worker 
      ? worker.Worker.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'UN', // Unknown
    hourlyRate: worker.HourlyRate,
    dailyWagesRate: worker.DailyWagesRate,
    actions: worker.Actions || []
  });

  // Helper function to get formatted status
  const getFormattedStatus = (status) => {
    if (status === "pendingreview" || status === "pending review") return "pending";
    return status;
  };

  return (
    <div className="bg-white rounded-xl max-w-full shadow-lg border border-gray-100 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block w-[163vh]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
              <tr>
                <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Worker</span>
                  </div>
                </th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                  Pay Period
                </th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-white">
                  Shifts
                </th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-white">
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Hours</span>
                  </div>
                </th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-white">
                  Overtime
                </th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-white">
                  Total Pay
                </th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-white">
                  Status
                </th>
                <th className="px-6 py-5 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workers.map((workerData, index) => {
                const worker = formatWorkerData(workerData);
                const formattedStatus = getFormattedStatus(worker.status);
                
                return (
                  <tr
                    key={worker.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    } hover:bg-blue-50/50 transition-all duration-200 hover:shadow-sm`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-sm">
                              {worker.avatar}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-base">
                            {worker.name}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            ID: #{worker.id}
                          </div>
                          <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer truncate">
                            {worker.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-gray-900">
                        {worker.payPeriod}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                        <span className="text-blue-800 font-semibold text-sm">
                          {worker.shifts}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="font-semibold text-gray-900">
                        {worker.totalHours}h
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-orange-600 font-semibold">
                          {worker.overtimeHours}h
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-green-700 font-bold text-lg">
                        {worker.totalPay === null || worker.totalPay === undefined ? 'N/A' : `${Number(worker.totalPay).toFixed(2)}`}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`${getStatusColor(
                          formattedStatus
                        )} text-white text-xs px-3 py-2 rounded-full font-medium inline-flex items-center space-x-1 shadow-sm`}
                      >
                        {formattedStatus === "processed" && <Check className="w-3 h-3" />}
                        {formattedStatus === "pending" && <Clock className="w-3 h-3" />}
                        {formattedStatus === "approved" && <Play className="w-3 h-3" />}
                        <span>{getStatusText(formattedStatus)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => viewDetails(worker.id)}
                          className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Details</span>
                        </button>
                        <button
                          onClick={() => processInvoice(worker.id)}
                          className={`inline-flex items-center space-x-1 ${
                            formattedStatus === "processed"
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 hover:shadow-md"
                          } text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm`}
                          disabled={formattedStatus === "processed"}
                        >
                          {formattedStatus === "processed" ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              <span>Process</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="block lg:hidden">
        <div className="space-y-4 p-4">
          {workers.map((workerData, index) => {
            const worker = formatWorkerData(workerData);
            const formattedStatus = getFormattedStatus(worker.status);
            
            return (
              <div
                key={worker.id}
                className="bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Header with worker info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {worker.avatar}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-lg">
                      {worker.name}
                    </div>
                    <div className="text-sm text-gray-500 font-mono">
                      ID: #{worker.id}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span
                      className={`${getStatusColor(
                        formattedStatus
                      )} text-white text-xs px-2 py-1 rounded-full font-medium inline-flex items-center space-x-1 shadow-sm`}
                    >
                      {formattedStatus === "processed" && <Check className="w-3 h-3" />}
                      {formattedStatus === "pending" && <Clock className="w-3 h-3" />}
                      {formattedStatus === "approved" && <Play className="w-3 h-3" />}
                      <span className="hidden sm:inline">{getStatusText(formattedStatus)}</span>
                    </span>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mb-4">
                  <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer truncate">
                    {worker.email}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 mb-1">Period</div>
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {worker.payPeriod}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                      <span className="text-purple-600 font-bold text-sm">
                        {worker.shifts}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Shifts</div>
                    <div className="font-semibold text-sm text-gray-900">
                      Total
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 mb-1">Hours</div>
                    <div className="font-semibold text-sm text-gray-900">
                      {worker.totalHours}h
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-gray-600 mb-1">Overtime</div>
                    <div className="font-semibold text-sm text-orange-600">
                      {worker.overtimeHours}h
                    </div>
                  </div>
                </div>

                {/* Pay and actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div className="text-xl font-bold text-green-700">
                      {worker.totalPay === null || worker.totalPay === undefined ? 'N/A' : `${Number(worker.totalPay).toFixed(2)}`}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewDetails(worker.id)}
                      className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                    <button
                      onClick={() => processInvoice(worker.id)}
                      className={`inline-flex items-center space-x-1 ${
                        formattedStatus === "processed"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 hover:shadow-md"
                      } text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm`}
                      disabled={formattedStatus === "processed"}
                    >
                      {formattedStatus === "processed" ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="hidden sm:inline">Done</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span className="hidden sm:inline">Process</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Shift Details Summary - New Addition */}
                {worker.shiftDetails && worker.shiftDetails.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">Recent Shifts</div>
                    <div className="space-y-1">
                      {worker.shiftDetails.slice(0, 2).map((shift, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 px-2 py-1 rounded">
                          <span>Shift #{shift.ShiftId}</span>
                          <span className="font-mono">{shift.TotalHours}h</span>
                        </div>
                      ))}
                      {worker.shiftDetails.length > 2 && (
                        <div className="text-xs text-center text-gray-500">
                          +{worker.shiftDetails.length - 2} more shifts
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* No Data State */}
      {workers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
          <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default WorkersTable;