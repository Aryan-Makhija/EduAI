import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";



import { getDb } from "@/lib/config/db";
import usersTable, { courseTable, enrollCourseTable } from "@/lib/config/schema";


export async function GET() {
  try {
    const user = await currentUser();
     const db = getDb()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "User email not found",
        },
        { status: 400 }
      );
    }

    // Get user
    const userResult = await db
      .select({
        totalStudyTime: usersTable.TotalStudyTime,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // Get enrolled courses
    const courses = await db
      .select()
      .from(courseTable)
      .innerJoin(
        enrollCourseTable,
        eq(courseTable.cid, enrollCourseTable.cid)
      )
      .where(eq(enrollCourseTable.userEmail, email))
      .orderBy(desc(enrollCourseTable.id));

    const enrolledCourses = courses.map((item) => ({
      ...item.courses,
      enrollment: item.enrollCourse,
    }));

    // Calculate statistics
    const masteredCourses = enrolledCourses.filter(
      (course) => course.enrollment.CourseStatus === "Mastered"
    );

    const inProgressCourses = enrolledCourses.filter(
      (course) => course.enrollment.CourseStatus !== "Mastered"
    );

    return NextResponse.json({
      success: true,

      stats: {
        totalStudyTime:
          userResult[0]?.totalStudyTime || 0,

        totalCourses: enrolledCourses.length,

        masteredCourses: masteredCourses.length,

        inProgressCourses: inProgressCourses.length,
      },

      courses: enrolledCourses,
    });
  } catch (error) {
    console.error("Workspace API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load workspace",
      },
      { status: 500 }
    );
  }
}