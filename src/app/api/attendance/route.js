
import { NextResponse } from "next/server";
import { db } from "../../../lib/db.js";
import { attendance, students } from "../../../lib/schema.js";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySession } from "../../../lib/session.js";

// Check admin authentication
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return false;
  }

  const session = await verifySession(token);

  return Boolean(session?.adminId);
}

// GET: View attendance records
export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const records = await db
      .select({
        id: attendance.id,
        studentId: attendance.studentId,
        studentName: students.name,
        rollNo: students.rollNo,
        date: attendance.date,
        status: attendance.status,
      })
      .from(attendance)
      .leftJoin(students, eq(attendance.studentId, students.id));

    return NextResponse.json(records);

  } catch (error) {
    console.error("ATTENDANCE GET ERROR:", error);

    return NextResponse.json(
      { message: "Unable to fetch attendance" },
      { status: 500 }
    );
  }
}

// POST: Save attendance
export async function POST(request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { studentId, date, status } = body;

    if (!studentId || !date || !status) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(Number(studentId)) || Number(studentId) <= 0) {
      return NextResponse.json(
        { message: "Invalid student ID" },
        { status: 400 }
      );
    }

    if (!["Present", "Absent"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid attendance status" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(attendance)
      .values({
        studentId: Number(studentId),
        date,
        status,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Attendance saved successfully",
        record: result[0],
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("ATTENDANCE POST ERROR:", error);

    return NextResponse.json(
      { message: "Unable to save attendance" },
      { status: 500 }
    );
  }
}
