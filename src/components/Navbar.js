
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/dashboard">Student Management</Link>
      </div>

      <div className="navbar-right">
        <span>Admin</span>
        <LogoutButton />
      </div>
    </nav>
  );
}
