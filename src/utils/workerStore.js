import workersData from "@/data/workers.json";

let workers = [...workersData];

export function getWorkers() {
  return workers;
}

export async function updateWorker(updatedWorker) {
  workers = workers.map((w) =>
    w.id === updatedWorker.id ? { ...w, ...updatedWorker } : w
  );
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return updatedWorker;
}