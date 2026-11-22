
"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.js";
import Sidebar from "../../components/Sidebar.js";

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const studentResponse = await fetch("/api/students");
      const studentData = await studentResponse.json();

      if (studentResponse.ok) {
        setStudents(studentData);
      }

      const attendanceResponse = await fetch("/api/attendance");
      const attendanceData = await attendanceResponse.json();

      if (attendanceResponse.ok) {
        setRecords(attendanceData);
      }
    } catch (error) {
      console.log("Error loading attendance:", error);
      setMessage("Unable to load attendance data.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, date, status }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Attendance saved successfully!");
        setStudentId("");
        await loadData();
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    }
  }

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div className="attendance-container">

            <h1>Attendance Management</h1>
            <p>Mark and manage student attendance</p>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit} className="attendance-form">
              <label>Select Student</label>

              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              >
                <option value="">Choose Student</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.rollNo}
                  </option>
                ))}
              </select>

              <label>Attendance Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <label>Attendance Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>

              <button type="submit">Save Attendance</button>
            </form>

            <h2>Attendance Records</h2>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.studentName}</td>
                      <td>{record.rollNo}</td>
                      <td>{record.date}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}

                  {records.length === 0 && (
                    <tr>
                      <td colSpan="4">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
