"use client";
// pages/attendance.js
import { useState, useEffect } from "react";
import Head from "next/head";

import EmployeeCards from "@/components/attendance/EmployeeCards";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceStats from "@/components/attendance/AttendanceStats";
import DateSelector from "@/components/attendance/DateSelector";
import Banner from "@/components/layout/Banner";

// This would typically come from your API or database
const initialWorkers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Site Supervisor",
    status: "Active",
    employeeId: "#EMP001",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@company.com",
    experience: "8 years",
    projects: "3 active",
    attendance: [
      {
        date: "2023-06-01",
        status: "present",
        checkIn: "07:58",
        checkOut: "16:05",
      },
      {
        date: "2023-06-02",
        status: "present",
        checkIn: "08:01",
        checkOut: "16:10",
      },
      { date: "2023-06-05", status: "absent", checkIn: null, checkOut: null },
      {
        date: "2023-06-06",
        status: "present",
        checkIn: "07:45",
        checkOut: "15:55",
      },
    ],
  },
  {
    id: 2,
    name: "John Doe",
    role: "Foundation Specialist",
    status: "Active",
    employeeId: "#EMP002",
    phone: "+1 (555) 234-5678",
    email: "john.doe@company.com",
    experience: "5 years",
    tasks: "2 active",
    attendance: [
      {
        date: "2023-06-01",
        status: "present",
        checkIn: "07:45",
        checkOut: "16:15",
      },
      {
        date: "2023-06-02",
        status: "present",
        checkIn: "08:05",
        checkOut: "16:20",
      },
      {
        date: "2023-06-05",
        status: "present",
        checkIn: "07:50",
        checkOut: "16:00",
      },
      {
        date: "2023-06-06",
        status: "late",
        checkIn: "08:35",
        checkOut: "16:10",
      },
    ],
  },
  {
    id: 3,
    name: "Mike Smith",
    role: "Equipment Operator",
    status: "Inactive",
    employeeId: "#EMP003",
    phone: "+1 (555) 345-6789",
    email: "mike.smith@company.com",
    experience: "12 years",
    equipment: "Excavator #3",
    attendance: [
      {
        date: "2023-06-01",
        status: "present",
        checkIn: "08:00",
        checkOut: "16:30",
      },
      { date: "2023-06-02", status: "absent", checkIn: null, checkOut: null },
      {
        date: "2023-06-05",
        status: "present",
        checkIn: "07:55",
        checkOut: "16:25",
      },
      {
        date: "2023-06-06",
        status: "present",
        checkIn: "08:02",
        checkOut: "16:40",
      },
    ],
  },
];

export default function AttendancePage() {
  const [workers, setWorkers] = useState(initialWorkers);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [view, setView] = useState("daily"); // 'daily' or 'weekly'

  // Calculate attendance stats
  const stats = {
    totalEmployees: workers.length,
    presentToday: workers.filter((worker) =>
      worker.attendance.some(
        (a) => a.date === selectedDate && a.status !== "absent"
      )
    ).length,
    activeEmployees: workers.filter((worker) => worker.status === "Active")
      .length,
    attendanceRate: Math.round(
      (workers.filter((worker) =>
        worker.attendance.some(
          (a) => a.date === selectedDate && a.status !== "absent"
        )
      ).length /
        workers.filter((worker) => worker.status === "Active").length) *
        100
    ),
  };

  return (
    <div className="min-h-scree">
      <main className="mx-auto">
        <div className="mb-6">
          <Banner
            title="Attendance Tracking"
            subtitle="Monitor and manage your team's attendance records"
            breadcrumb={[{ label: "Home", href: "#" }, { label: "Attendance" }]}
          />
        </div>

        <DateSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          view={view}
          setView={setView}
        />

        <AttendanceStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <AttendanceTable workers={workers} selectedDate={selectedDate} />
          </div>

          <div className="lg:col-span-2">
            <EmployeeCards workers={workers} selectedDate={selectedDate} />
          </div>
        </div>
      </main>
    </div>
  );
}
