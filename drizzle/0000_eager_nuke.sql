CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone" varchar(15),
	"roll_no" varchar(30) NOT NULL,
	"course" varchar(100) NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "students_email_unique" UNIQUE("email"),
	CONSTRAINT "students_roll_no_unique" UNIQUE("roll_no")
);
