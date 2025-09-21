"use client";
import { useState } from "react";
import { projects } from "@/data/projects";
import { AiOutlineClose } from "react-icons/ai";

export default function DivideAmountModal({ isOpen, onClose, invoices }) {
  const [allocations, setAllocations] = useState([
    { projectId: "", amount: "", percentage: "" },
  ]);

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount.final, 0);
  const allocatedAmount = allocations.reduce(
    (sum, a) => sum + (parseFloat(a.amount) || 0),
    0
  );
  const remaining = totalAmount - allocatedAmount;

  const updateAllocation = (index, field, value) => {
    const updated = [...allocations];
    updated[index][field] = value;

    if (field === "percentage") {
      const percent = parseFloat(value) || 0;
      updated[index].amount = ((totalAmount * percent) / 100).toFixed(2);
    }

    if (field === "amount") {
      const amt = parseFloat(value) || 0;
      updated[index].percentage = ((amt / totalAmount) * 100).toFixed(2);
    }

    setAllocations(updated);
  };

  const addProject = () => {
    setAllocations([
      ...allocations,
      { projectId: "", amount: "", percentage: "" },
    ]);
  };

  const removeProject = (index) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    if (remaining !== 0) {
      alert("⚠️ Please allocate the full amount before applying.");
      return;
    }
    console.log("✅ Final Allocation:", allocations);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4  cursor-pointer text-gray-500 hover:text-gray-700"
        >
          <AiOutlineClose className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Divide Invoice Amount Across Projects
        </h2>

        {/* Selected Invoices */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-40 overflow-y-auto  custom-scrollbar mb-4">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex justify-between py-1">
              <span className="text-gray-700">
                {inv.worker} - {inv.date}
              </span>
              <span className="font-medium text-gray-900">
                ${inv.amount.final}
              </span>
            </div>
          ))}
          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Total Amount:</span>
            <span className="text-purple-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Divide Across Projects */}
        <div className="space-y-3 mb-4">
          {allocations.map((alloc, index) => (
            <div key={index} className="flex items-center gap-3">
              <select
                className="border rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                value={alloc.projectId}
                onChange={(e) =>
                  updateAllocation(index, "projectId", e.target.value)
                }
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="$"
                className="border rounded-md px-3 py-2 w-28 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                value={alloc.amount}
                onChange={(e) =>
                  updateAllocation(index, "amount", e.target.value)
                }
              />

              <input
                type="number"
                placeholder="%"
                className="border rounded-md px-3 py-2 w-20 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                value={alloc.percentage}
                onChange={(e) =>
                  updateAllocation(index, "percentage", e.target.value)
                }
              />

              {allocations.length > 1 && (
                <button
                  className="text-red-500 hover:text-red-700 flex items-center justify-center"
                  onClick={() => removeProject(index)}
                >
                  <AiOutlineClose className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
            onClick={addProject}
          >
            + Add Another Project
          </button>
        </div>

        <div className="text-right text-gray-600 mb-4">
          Remaining:{" "}
          <span className="font-semibold">${remaining.toFixed(2)}</span>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md  cursor-pointer border bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-md cursor-pointer bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Apply Division
          </button>
        </div>
      </div>
    </div>
  );
}
