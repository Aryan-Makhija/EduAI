EduAI – AI-Powered Online Learning Platform
🚀 EduAI
Instant, AI-Driven Personalized Course Generation
EduAI is an intelligent learning platform designed to generate fully structured, personalized educational courses on demand. By providing a topic, desired chapter depth, and video preferences, EduAI generates complete chapter breakdowns, rich text content, and curated YouTube video resources within minutes.

💡 Overview
Learning new subjects often requires aggregating information across disparate sources. EduAI simplifies this process by orchestrating AI content generation and real-time video aggregation into a single, interactive learning portal.

Instant Course Generation: Generates custom curricula tailored to user inputs.

Smart Media Integration: Connects chapter concepts directly with relevant video tutorials.

Interactive Learning Workflows: Allows users to read material, consume media, mark chapters complete, and track progress visually.

✨ Features
🎓 AI-Generated Curricula
Generates structured, multi-chapter content via Google Gemini.

Tailors course depth based on chosen chapter count.

Automatically synthesizes lesson summaries and key learning points.

🎥 Automated Video Curation
Leverages the YouTube Data API to source relevant, high-quality video content for each chapter.

Embeds contextual video support directly into the lesson viewer.

📈 Progress Tracking & Dashboard
Real-time progress visualizer tracking completed chapters.

Persistent user state across sessions.

Interactive lesson completion toggles.

🔐 Secure Authentication & User Management
User authentication powered by Clerk (Email/Password & OAuth).

Protected routes, server-side authorization checks, and session management.

User profile customization and saved course history.

🛠️ Tech Stack
Category	Technology
Framework	Next.js 16 (App Router, Server Actions, Server Components)
Language	TypeScript
Styling	Tailwind CSS, Shadcn UI
Authentication	Clerk Auth
Database	Neon PostgreSQL
ORM	Drizzle ORM
AI Models	Google Gemini API (gemini-2.5-flash / Gemini API)
External APIs	YouTube Data API v3
Deployment	Vercel
📂 Architecture & Directory Structure
Plaintext
eduai/
├── app/
│   ├── (auth)/             # Authentication routes (Clerk)
│   ├── dashboard/          # User dashboard and course overview
│   ├── create-course/      # Course generation flow and forms
│   ├── course/[courseId]/  # Course details and chapter viewer
│   └── api/                # Internal API route handlers
├── components/             # Reusable UI & Shadcn components
├── db/                     # Drizzle ORM schema & connection setup
│   ├── schema.ts           # PostgreSQL tables & relationships
│   └── index.ts            # Neon database client configuration
├── lib/                    # Shared utilities, Gemini & YouTube API helpers
├── public/                 # Static assets and icons
├── drizzle.config.ts       # Drizzle migrations configuration
└── package.json
⚙️ Getting Started
Follow these instructions to set up and run EduAI locally.

Prerequisites
Ensure you have the following installed on your machine:

Node.js: v18.x or later

npm, pnpm, or yarn

A Neon PostgreSQL database instance

Accounts/API keys for Clerk, Google Gemini AI, and Google Cloud (YouTube Data API)

Installation
Clone the Repository

Bash
git clone https://github.com/your-username/eduai.git
cd eduai
Install Dependencies

Bash
npm install
Configure Environment Variables
Create a .env.local file in the root directory and add the following keys:

Code snippet
# Next.js Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Neon Postgres)
DATABASE_URL=postgresql://user:password@ep-example-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# AI & External APIs
GEMINI_API_KEY=your_google_gemini_api_key
YOUTUBE_API_KEY=your_youtube_data_api_key
Run Database Migrations
Push your Drizzle schema to your Neon Database:

Bash
npx drizzle-kit push
Start the Development Server

Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.

📌 How It Works
Code snippet
sequenceDiagram
    autonumber
    actor User
    participant NextJS as Next.js App Router
    participant Gemini as Google Gemini AI
    participant YT as YouTube API
    participant DB as Neon Database (Drizzle)

    User->>NextJS: Submits topic, chapter count, & video preference
    NextJS->>Gemini: Requests structured JSON outline & chapter text
    Gemini-->>NextJS: Returns generated JSON course payload
    alt Video inclusion selected
        NextJS->>YT: Queries related videos per chapter
        YT-->>NextJS: Returns video metadata & IDs
    end
    NextJS->>DB: Stores course, chapters, and video links
    DB-->>NextJS: Confirms record creation
    NextJS-->>User: Redirects to interactive course dashboard
Authenticate: Log in securely via Clerk using social provider or credentials.

Configure Prompt: Access the creation interface, specify topic parameters, target chapter count, and toggle media integration.

Generation Workflow:

Gemini generates structured JSON containing chapter headers, explanations, and core concepts.

If enabled, the server queries the YouTube Data API for relevant support videos per topic.

Course payloads are saved to Neon via Drizzle ORM.

Interactive Dashboard: Users consume lesson text, stream videos, and mark chapters complete to update visual progress bars.

🔮 Roadmap & Future Enhancements
[ ] Interactive Quizzes: Auto-generate AI comprehension checks at the end of each chapter.

[ ] Flashcards: Export key concepts into spaced-repetition flashcard sets.

[ ] Collaborative Learning: Course sharing, public registries, and user forks.

[ ] Dark Mode Support: Native theme switching using next-themes.

[ ] Export Options: Export generated courses as PDF or Markdown files.

🤝 Contributing
Contributions are welcome! If you find a bug or have a feature request, feel free to open an issue or submit a pull request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for more information.
