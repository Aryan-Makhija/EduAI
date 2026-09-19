import { getDb } from "@/lib/config/db"
import { courseTable } from "@/lib/config/schema"
import { currentUser } from "@clerk/nextjs/server"

import { GoogleGenAI } from "@google/genai"
import { and, eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"


export async function POST(req) {

    const { courseId, ...formdata } = await req.json()
    const user = await currentUser()
    const db = getDb()


    if (!user) {
        return NextResponse.json({ message: "Unauhtorized user" }, { status: 401 })
    }
    // --------------------------------------------------
    // 1. CHECK IF COURSE ALREADY EXISTS
    // --------------------------------------------------

    const existingCourse = await db
        .select()
        .from(courseTable)
        .where(
            and(
                sql`LOWER(TRIM(${courseTable.name})) = LOWER(TRIM(${formdata.name}))`,
                sql`LOWER(TRIM(${courseTable.level})) = LOWER(TRIM(${formdata.level}))`
            )
        )
        .limit(1)

    if (existingCourse.length > 0) {

        return NextResponse.json(
            {
                success: false,
                message: "Course already exists",
                course: existingCourse[0]
            },
            {
                status: 400
            }
        )
    }


    const PROMPT = `Generate a Learning Course based on the following details. 
Make sure to include:
- Course Name  
- Description  
- Course Category  
- Course Level  
- Include Video (boolean)  
- Number of Chapters  
- Banner Image Prompt  
- Chapters with: Chapter Name, Duration, and Topics  

### Course Banner Image Prompt Guidelines:
Create a modern, flat-style 2D digital illustration representing scenes, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to the user's course, such as sticky notes, design components, and visual aids.  
Use a vibrant color palette (blues, purples, oranges) with a clean, professional look.  
The illustration should feel creative, tech-savvy, and educational—ideal for visualizing concepts in the user’s course.  
Return the banner image prompt in a **3D format description**.

### Output Format:
Respond **only in JSON** using the following schema:

{
  "course": {
    "name": "string",
    "description": "string",
    "category": "string",
    "level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": ["string"]
      }
    ]
  }
}

User Input:${formdata} `;


    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })

    const config = {
        responseMimeType: `text/plain`
    }


    const model = "gemini-3.5-flash"
    const contents = [
        {
            role: "user",
            parts: [
                { text: PROMPT },
                { text: JSON.stringify(formdata) }
            ]
        }
    ];

    const response = await ai.models.generateContent({
        model,
        config,
        contents
    })

    // const text =
    //     response?.candidates?.[0]?.content?.parts?.[0]?.text;

    const RawResponse = response?.candidates[0]?.content?.parts[0]?.text
    const RawJson = RawResponse.replace('```json', '').replace('```', '').trim()
    const JSONResp = JSON.parse(RawJson)






    //Save to database
    const result = await db.insert(courseTable).values({
        ...formdata,
        courseJson: JSONResp,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        cid: courseId
    })



    return NextResponse.json({ courseId: courseId })
}