
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar.js";
import Sidebar from "../../components/Sidebar.js";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    firstYear: 0,
    secondYear: 0,
    thirdYear: 0,
    recentStudents: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.log("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-layout">
          <Sidebar />
          <main className="dashboard-content">
            <p>Loading dashboard...</p>
          </main>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content">
          <div className="dashboard-container">

            <h1>Student Management Dashboard</h1>
            <p className="dashboard-subtitle">
              Overview of student records
            </p>

            <div className="stats-grid">

              <div className="stat-card">
                <h3>Total Students</h3>
                <h2>{stats.total}</h2>
              </div>

              <div className="stat-card">
                <h3>First Year</h3>
                <h2>{stats.firstYear}</h2>
              </div>

              <div className="stat-card">
                <h3>Second Year</h3>
                <h2>{stats.secondYear}</h2>
              </div>

              <div className="stat-card">
                <h3>Third Year</h3>
                <h2>{stats.thirdYear}</h2>
              </div>

            </div>

            <div className="recent-section">

              <div className="recent-header">
                <h2>Recent Students</h2>
                <Link href="/students">
                  View All Students
                </Link>
              </div>

              {stats.recentStudents.length === 0 ? (
                <p>No student records available.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Roll Number</th>
                        <th>Course</th>
                        <th>Year</th>
                      </tr>
                    </thead>

                    <tbody>
                      {stats.recentStudents.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.rollNo}</td>
                          <td>{student.course}</td>
                          <td>{student.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
