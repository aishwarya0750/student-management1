
import { NextResponse } from "next/server";
import { db } from "../../../../lib/db.js";
import { admins } from "../../../../lib/schema.js";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { message: "Email and password of at least 8 characters are required" },
        { status: 400 }
      );
    }

    const existingAdmin = await db
      .select()
      .from(admins)
      .where((await import("drizzle-orm")).eq(admins.email, email));

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { message: "Admin email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(admins).values({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Admin registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN REGISTER ERROR:", error);

    return NextResponse.json(
      { message: "Unable to register admin" },
      { status: 500 }
    );
  }
}
