
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Menu</h2>

      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link href="/students">Students</Link>
        </li>

        <li>
          <Link href="/add-student">Add Student</Link>
        </li>

        <li>
          <Link href="/attendance">Attendance</Link>
        </li>
      </ul>
    </aside>
  );
}
