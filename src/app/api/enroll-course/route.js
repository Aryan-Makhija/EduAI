import { getDb } from "@/lib/config/db";
import usersTable, { courseTable, enrollCourseTable } from "@/lib/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";




export async function POST(req) {

    const db = getDb()
    const { courseId } = await req.json();
    const user = await currentUser()


    const enrollCourses = await db.select().from(enrollCourseTable).where(and(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress), eq(enrollCourseTable?.cid, courseId)))

    const course = await db.select().from(courseTable).where(eq(courseTable?.cid, courseId));

    if (enrollCourses?.length == 0) {
        const result = await db.insert(enrollCourseTable).values({
            cid: courseId,
            userEmail: user.primaryEmailAddress?.emailAddress

        }).returning(enrollCourseTable)

        const courseLength = course[0].courseContent?.length
        return NextResponse.json({
            result,
            courseLength
        })
    }

    return NextResponse.json({ 'resp': 'Already Enrolled' })
}

export async function GET(req) {
    const db = getDb()
    const user = await currentUser()

    const { searchParams } = new URL(req.url)
    const courseId = searchParams?.get('courseId')

    if (courseId) {
        const result = await db.select().from(courseTable).innerJoin(enrollCourseTable, eq(courseTable.cid, enrollCourseTable.cid)).where(and(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress), eq(enrollCourseTable.cid, courseId)))


        return NextResponse.json(result[0])
    }




    const result = await db.select().from(courseTable).innerJoin(enrollCourseTable, eq(courseTable.cid, enrollCourseTable.cid)).where(eq(enrollCourseTable.userEmail, user?.primaryEmailAddress.emailAddress)).orderBy(desc(enrollCourseTable.id))


    return NextResponse.json(result)

}

// export async function PUT(req) {
//     const { completedchapters, courseId } = await req.json()

//     const user = await currentUser()

//     const result = await db.update(enrollCourseTable).set({
//         completedChapters: completedchapters
//     }).where(and(eq(enrollCourseTable.cid, courseId), eq(enrollCourseTable.userEmail, user?.primaryEmailAddress?.emailAddress))).returning(enrollCourseTable)


//     return NextResponse.json(result)
// }





export async function PUT(req) {
    try {
        const { completedchapters, courseId } = await req.json();

        // -----------------------------------------
        // 1. Get current user
        // -----------------------------------------

        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized user",
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

        // -----------------------------------------
        // 2. Get current course
        // -----------------------------------------

        const courseResult = await db
            .select()
            .from(courseTable)
            .where(eq(courseTable.cid, courseId));

        if (courseResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Course not found",
                },
                { status: 404 }
            );
        }

        const course = courseResult[0];

        // -----------------------------------------
        // 3. Get chapters
        // -----------------------------------------

        const chapters = course.courseJson?.course?.chapters || [];

        // completedChapters uses ZERO-based indexes
        const completed = Array.isArray(completedchapters)
            ? [...new Set(completedchapters.map(Number))]
            : [];

        // -----------------------------------------
        // 4. Check if all chapters are completed
        // -----------------------------------------

        const allChaptersCompleted =
            chapters.length > 0 &&
            chapters.every((_, index) =>
                completed.includes(index)
            );

        const courseStatus = allChaptersCompleted
            ? "Mastered"
            : "In Progress";

        // -----------------------------------------
        // 5. Update enrollment
        // -----------------------------------------

        const updatedEnrollment = await db
            .update(enrollCourseTable)
            .set({
                completedChapters: completed,
                CourseStatus: courseStatus,
            })
            .where(
                and(
                    eq(enrollCourseTable.cid, courseId),
                    eq(enrollCourseTable.userEmail, email)
                )
            )
            .returning();

        // -----------------------------------------
        // 6. Get all user's enrollments
        // -----------------------------------------

        const enrollments = await db
            .select({
                cid: enrollCourseTable.cid,
                completedChapters: enrollCourseTable.completedChapters,
            })
            .from(enrollCourseTable)
            .where(eq(enrollCourseTable.userEmail, email));

        // -----------------------------------------
        // 7. Get all courses
        // -----------------------------------------

        const courses = await db
            .select({
                cid: courseTable.cid,
                courseJson: courseTable.courseJson,
            })
            .from(courseTable);

        // -----------------------------------------
        // 8. Calculate total study time
        // -----------------------------------------

        let totalStudyTime = 0;

        for (const enrollment of enrollments) {
            const enrolledCourse = courses.find(
                (course) => course.cid === enrollment.cid
            );

            if (!enrolledCourse) continue;

            const courseChapters =
                enrolledCourse.courseJson?.course?.chapters || [];

            const completedChapterIndexes = Array.isArray(
                enrollment.completedChapters
            )
                ? enrollment.completedChapters.map(Number)
                : [];

            // Because completedChapters is ZERO-based,
            // directly use the value as the array index.
            for (const chapterIndex of completedChapterIndexes) {
                const chapter = courseChapters[chapterIndex];

                if (!chapter) continue;

                totalStudyTime += parseDuration(chapter.duration);
            }
        }

        // -----------------------------------------
        // 9. Update user's total study time
        // -----------------------------------------

        await db
            .update(usersTable)
            .set({
                TotalStudyTime: totalStudyTime,
            })
            .where(eq(usersTable.email, email));

        // -----------------------------------------
        // 10. Return response
        // -----------------------------------------

        return NextResponse.json({
            success: true,
            message: "Chapter progress updated successfully",
            courseStatus,
            totalStudyTime,
            enrollment: updatedEnrollment[0],
        });
    } catch (error) {
        console.error("Chapter progress error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update chapter progress",
            },
            { status: 500 }
        );
    }
}


// -----------------------------------------
// Convert "1h 30m" → seconds
// -----------------------------------------

function parseDuration(duration) {
    if (!duration) return 0;

    const hourMatch = duration.match(/(\d+)\s*h/i);
    const minuteMatch = duration.match(/(\d+)\s*m/i);

    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;

    return hours * 60 * 60 + minutes * 60;
}