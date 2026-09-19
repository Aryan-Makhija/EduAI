import { getDb } from "@/lib/config/db"
import { courseTable } from "@/lib/config/schema"
import { currentUser } from "@clerk/nextjs/server"
import { desc, eq, ne, sql } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req) {
    const db = getDb()
    const { searchParams } = new URL(req.url)
    const courseId = searchParams?.get("courseId")

    const user = await currentUser()


    if (courseId == 0) {
        const result = await db.select().from(courseTable).where(sql`${courseTable.courseContent}::jsonb !='{}'::jsonb`)


        return NextResponse.json(result)
    }



    if (courseId) {

        const result = await db.select().from(courseTable).where(eq(courseTable.cid, courseId))

        return NextResponse.json(result[0])

    } else {
        const result = await db.select().from(courseTable).where(eq(courseTable.userEmail, user.primaryEmailAddress?.emailAddress)).orderBy(desc(courseTable.id))


        return NextResponse.json(result)

    }


}