import "./globals.css";

export const metadata = {
  title: "Student Management System",
  description: "Student Management System using Next.js and PostgreSQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}