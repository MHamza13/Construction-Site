import WorkerChat from "@/components/chat/WorkerChat";
import React from "react";

const page = () => {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Team Chat</h1>
              <p className="text-gray-600 text-sm">Communicate with your team members</p>
            </div>
          </div>
        </div>

        {/* Chat Component */}
        <div className="bg-white shadow-sm overflow-hidden">
          <WorkerChat />
        </div>
      </div>
    </main>
  );
};

export default page;
