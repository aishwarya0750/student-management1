
import { NextResponse } from "next/server";
import { db } from "../../../lib/db.js";
import { students } from "../../../lib/schema.js";
import { count, eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySession } from "../../../lib/session.js";

export async function GET() {
  try {
    // Check admin session
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const session = await verifySession(token);

    if (!session?.adminId) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Total students
    const totalResult = await db
      .select({ total: count() })
      .from(students);

    // First year students
    const firstYear = await db
      .select({ total: count() })
      .from(students)
      .where(eq(students.year, 1));

    // Second year students
    const secondYear = await db
      .select({ total: count() })
      .from(students)
      .where(eq(students.year, 2));

    // Third year students
    const thirdYear = await db
      .select({ total: count() })
      .from(students)
      .where(eq(students.year, 3));

    // Latest 5 students
    const recentStudents = await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt))
      .limit(5);

    return NextResponse.json({
      total: totalResult[0].total,
      firstYear: firstYear[0].total,
      secondYear: secondYear[0].total,
      thirdYear: thirdYear[0].total,
      recentStudents,
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return NextResponse.json(
      { message: "Unable to load dashboard" },
      { status: 500 }
    );
  }
}
