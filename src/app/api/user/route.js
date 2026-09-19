
import { eq } from "drizzle-orm";
import { getDb } from "../../../lib/config/db";
import usersTable from "../../../lib/config/schema";
import { NextResponse } from "next/server";

export async function POST(request) {

    try {

        const { email, name } = await request.json()
 const db = getDb()
        //if user already exist
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email))

        //if not then insert new  user
        if (user?.length === 0) {
            const result = await db.insert(usersTable).values({
                name: name,
                email: email
            }).returning(usersTable)

            return NextResponse.json(result)
        }

        return NextResponse.json(user[0])
    } catch (err) {
        console.log(err.message)
        return NextResponse.json({ message: err.message }, { status: 402 })
    }
}