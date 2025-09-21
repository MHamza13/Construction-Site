"use client";

import {
  CheckCircle2,
  Calendar,
  Timer,
  DollarSign,
  Banknote,
  Download,
  ChevronRight,
} from "lucide-react";

export default function RecentPayments() {
  const payments = [
    {
      id: "PAY-001",
      date: "March 15, 2024",
      hours: "8h regular + 2h overtime",
      regularHours: 8,
      overtimeHours: 2,
      amount: "$165.00",
      status: "Paid",
      project: "Project Alpha",
      paymentMethod: "Direct Deposit",
    },
    {
      id: "PAY-002",
      date: "March 14, 2024",
      hours: "8h regular + 1h overtime",
      regularHours: 8,
      overtimeHours: 1,
      amount: "$142.50",
      status: "Paid",
      project: "Project Beta",
      paymentMethod: "Direct Deposit",
    },
    {
      id: "PAY-003",
      date: "March 13, 2024",
      hours: "7h regular",
      regularHours: 7,
      overtimeHours: 0,
      amount: "$120.00",
      status: "Paid",
      project: "Project Gamma",
      paymentMethod: "Check",
    },
  ];

  const totalAmount = payments.reduce(
    (sum, p) => sum + parseFloat(p.amount.replace("$", "")),
    0
  );

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Payments
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              All payments up to date
            </p>
          </div>
          <div className="bg-white p-2 rounded-md shadow-sm">
            <Banknote className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 py-4 bg-white border-b">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-600">
              Total This Period
            </p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-600">Payments</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {payments.length}
            </p>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="p-5">
        <div className="space-y-4">
          {payments.map((p, i) => (
            <div
              key={i}
              className="group bg-white rounded-md shadow-sm p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-md text-green-600 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.id}</h3>
                    <p className="text-sm text-gray-600">{p.project}</p>
                  </div>
                </div>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{p.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{p.hours}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {p.amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {p.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">Processed: {p.date}</div>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-xs font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                  <Download className="w-3 h-3" />
                  Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t bg-gray-50">
        <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800 font-medium py-2 rounded-md hover:bg-gray-100 transition-colors">
          View payment history
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
