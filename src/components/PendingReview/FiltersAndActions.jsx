import { Calendar, Search, RotateCcw, Play, Download } from "lucide-react";

const FiltersAndActions = ({
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  searchInput,
  setSearchInput,
  showCustomDateRange,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  filterStatus,
  resetFilters,
  processAllApproved,
  exportPayroll,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="space-y-6">
        {/* Pay Period Filter Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-blue-900">
              Pay Period Filter
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Quick Select
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm transition-all duration-200"
              >
                <option value="all">All Periods</option>
                <option value="current-week">This Week (Sept 1-7, 2025)</option>
                <option value="last-week">Last Week (Aug 25-31, 2025)</option>
                <option value="current-month">This Month (September 2025)</option>
                <option value="last-month">Last Month (August 2025)</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
            
            <div
              className={`transition-all duration-300 ${
                showCustomDateRange ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <label className="block text-xs font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm transition-all duration-200"
              />
            </div>
            
            <div
              className={`transition-all duration-300 ${
                showCustomDateRange ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <label className="block text-xs font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white shadow-sm transition-all duration-200"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-100">
            <span className="text-xs text-blue-700 font-medium bg-blue-100 px-2 py-1 rounded-full">
              {filterStatus}
            </span>
          </div>
        </div>

        {/* Filters and Actions Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 gap-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="processed">Processed</option>
            </select>
            
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search worker..."
                className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={processAllApproved}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Process All Approved
            </button>
            <button
              onClick={exportPayroll}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersAndActions;