"use client";

export default function PhaseList({ subtasks }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Phases</h2>

      {subtasks.length === 0 ? (
        <p className="text-gray-500">No phases added yet.</p>
      ) : (
        <ul className="space-y-2">
          {subtasks.map((phase, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <span>{phase.name}</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  phase.done
                    ? "bg-green-100 text-green-700"
                    : phase.inProgress
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {phase.done
                  ? "Completed"
                  : phase.inProgress
                  ? "In Progress"
                  : "Not Started"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
