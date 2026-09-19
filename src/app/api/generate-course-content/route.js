
// ---------------------------------- New Api ---------------

import { getDb } from "@/lib/config/db"
import { courseTable } from "@/lib/config/schema"
import { GoogleGenAI } from "@google/genai"
import axios from "axios"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
})

const PROMPT = `
You are an expert technical course content generator.

Generate detailed, structured educational content for the provided course chapter and topics.

The course can be about any technical subject, including:

- Programming languages
- Web development
- Frameworks
- Backend development
- Databases
- APIs
- DevOps
- Software engineering
- Computer science concepts

IMPORTANT:

- Do NOT generate HTML.
- Do NOT generate CSS.
- Do NOT generate Markdown.
- Do NOT generate UI components.
- Do NOT use HTML tags.
- Generate ONLY structured JSON.
- The frontend application will handle all UI rendering.
- Each section should focus on one specific concept.
- Keep the content educational, clear, detailed, and technically accurate.
- Output MUST be a valid JSON only

RETURN JSON ONLY USING THIS EXACT SCHEMA:

{
  "chapterNumber": 1,
  "chapterTitle": "string",
  "chapterDescription": "string",
  "sections": [
    {
      "sectionNumber": 1,
      "title": "string",
      "subtitle": "string",
      "theory": "string",
      "codeExample": {
        "language": "string",
        "title": "string",
        "code": "string",
        "explanation": "string"
      }
    }
  ]
}

CODE GENERATION RULE:

The "codeExample" field is optional.

Generate code ONLY when code genuinely helps explain or demonstrate the specific topic.

Do NOT generate code just to fill the field.

If code is not required, return:

"codeExample": null

Examples:

"Encapsulation"
→ Generate a relevant code example.

"Creating a JavaScript Function"
→ Generate a relevant code example.

"Advantages of Object-Oriented Programming"
→ "codeExample": null

"What is JavaScript?"
→ "codeExample": null if code does not significantly improve the explanation.

CODE RULES:

1. When code is not required, ALWAYS use:
   "codeExample": null

2. When code is required, provide:
   - language
   - title
   - code
   - explanation

3. The code must demonstrate ONLY the current topic.

4. Do not create unnecessarily large code examples.

5. Do not introduce unrelated concepts into the code.

6. The language field must contain the appropriate programming language.

7. The code field must contain ONLY source code.

8. Do NOT include Markdown code fences.

9. The explanation should explain the important parts of the code.

10. Use newline characters inside code when necessary.

CONTENT RULES:

1. Create exactly one section object for each provided topic.

2. Each section must focus ONLY on its specific topic.

3. "title" must contain the main topic name.

4. "subtitle" must provide a short description of what the section teaches.

5. "theory" must contain a detailed educational explanation.

6. Use practical examples when they improve understanding.

7. Do not combine unrelated concepts into one section.

8. Avoid unnecessary repetition.

9. Content should be suitable for the specified course level.

10. Use plain text for theory, subtitle, and explanation.

11. When the course is programming-language-specific, the code MUST use {{COURSE_LANGUAGE}}.

12. NEVER use another programming language for a code example simply because it is easier or more commonly used.

13. The "language" field MUST exactly match "{{COURSE_LANGUAGE}}" for course-specific programming examples.

14: If Course language is not specific like for example "React js" than code should be according to the course name for example javascript for "React.js"  

Your responsibility is ONLY to generate the educational course content.




Chapter:
{{CHAPTER_NAME}}

Course Name:
{{COURSE_NAME}}

Course Language:
{{COURSE_LANGUAGE}}
`

export async function POST(req) {
    try {
        const { courseJson, courseTitle, courseId } = await req.json()

        const db = getDb()

        if (!courseId) {
            return NextResponse.json(
                { error: "courseId is required" },
                { status: 400 }
            )
        }

        const chapters = courseJson?.chapters
        const CourseName = courseJson?.name
        const Language = courseJson?.name

        if (!chapters?.length) {
            return NextResponse.json(
                {
                    error:
                        "No chapters found in courseJson. Expected courseJson.chapters array.",
                },
                { status: 400 }
            )
        }

        const promises = chapters.map(async (chapter) => {

            // 1. Gemini call
            const response = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",

                config: {
                    responseMimeType: "application/json",
                },

                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: PROMPT,
                            },
                            {
                                text: JSON.stringify(chapter),
                            }, {
                                text: JSON.stringify(CourseName)
                            }
                            , {
                                text: JSON.stringify(Language)
                            }
                        ],
                    },
                ],
            })

            // 2. Get Gemini response
            const text =
                response.candidates[0].content.parts[0].text

            // 3. Convert JSON string → JavaScript object
            const courseData = JSON.parse(text)

            // 4. Get YouTube videos
            const youtubeVideos = await GetYoutubeVideo(
                chapter?.chapterTitle ||
                chapter?.chapterName
            )

            // 5. Merge both
            return {
                ...courseData,
                youtubeVideos,
            }
        })

        // Wait for all chapters
        const courseContent = await Promise.all(promises)

        // Store in database
        await db
            .update(courseTable)
            .set({
                courseContent,
            })
            .where(eq(courseTable.cid, courseId))

        return NextResponse.json({
            courseName: courseTitle,
            courseContent,
        })

    } catch (error) {
        console.error(
            "generate-course-content error:",
            error
        )

        return NextResponse.json(
            {
                error:
                    error?.message ||
                    "Failed to generate course content",
            },
            { status: 500 }
        )
    }
}

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search'
const GetYoutubeVideo = async (topic) => {
    try {
        const params = {
            part: "snippet",
            q: `${topic} tutorial`,
            maxResults: 4,
            type: "video",
            videoDuration: "long",
            order: "relevance",
            key: process.env.YOUTUBE_API_KEY,
        }

        const resp = await axios.get(
            YOUTUBE_BASE_URL,
            { params }
        )

        const youtubeVideoListResp =
            resp.data?.items ?? []

        return youtubeVideoListResp.map((item) => ({
            videoId: item.id?.videoId,
            title: item.snippet?.title,
            channelTitle: item.snippet?.channelTitle,
            // thumbnail:
            //     item.snippet?.thumbnails?.high?.url,
            // url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
        }))

    } catch (error) {
        console.error(
            "YouTube API error:",
            error?.response?.data || error.message
        )

        return []
    }
}



