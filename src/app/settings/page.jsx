import Specialization from "@/components/Specialization";
import React from "react";

const SettingPage = () => {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm border-b border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600 text-sm">Manage your application settings and configurations</p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white shadow-sm overflow-hidden">
          <Specialization />
        </div>
      </div>
    </main>
  );
};

export default SettingPage;
