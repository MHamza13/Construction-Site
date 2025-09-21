"use client";

export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          {title}
        </h1>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
