
import { NextResponse } from "next/server";
import { db } from "../../../lib/db.js";
import { students } from "../../../lib/schema.js";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifySession } from "../../../lib/session.js";

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return false;

  const session = await verifySession(token);
  return Boolean(session?.adminId);
}

// GET students
export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const data = await db.select().from(students);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to fetch students" },
      { status: 500 }
    );
  }
}

// POST student
export async function POST(request) {
  if (!(await checkAdmin())) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, phone, rollNo, course, year } = body;

    if (!name || !email || !rollNo || !course || !year) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const result = await db.insert(students).values({
      name,
      email,
      phone,
      rollNo,
      course,
      year: Number(year),
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to add student" },
      { status: 500 }
    );
  }
}

// PATCH student
export async function PATCH(request) {
  if (!(await checkAdmin())) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, name, email, phone, rollNo, course, year } = body;

    if (!id || !name || !email || !rollNo || !course || !year) {
      return NextResponse.json(
        { message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const result = await db.update(students).set({
      name,
      email,
      phone,
      rollNo,
      course,
      year: Number(year),
    }).where(eq(students.id, Number(id))).returning();

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to update student" },
      { status: 500 }
    );
  }
}

// DELETE student
export async function DELETE(request) {
  if (!(await checkAdmin())) {
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "Invalid student ID" },
        { status: 400 }
      );
    }

    const result = await db.delete(students)
      .where(eq(students.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to delete student" },
      { status: 500 }
    );
  }
}
