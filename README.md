# EduAI – AI-Powered Online Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat&logo=clerk)](https://clerk.com/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat&logo=drizzle)](https://orm.drizzle.team/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat&logo=vercel)](https://vercel.com/)

<br />

# 🚀 EduAI
### Instant, AI-Driven Personalized Course Generation

**EduAI** is an intelligent learning platform designed to generate fully structured, personalized educational courses on demand. By providing a topic, desired chapter depth, and video preferences, EduAI generates complete chapter breakdowns, rich text content, and curated YouTube video resources within minutes.

The application is **fully containerized using Docker**, ensuring seamless local development, isolated dependencies, and production-ready deployments.

---

# 💡 Overview

Learning new subjects often requires aggregating information across disparate sources. EduAI simplifies this process by orchestrating AI content generation and real-time video aggregation into a single, interactive learning portal.

* **Instant Course Generation**: Generates custom curricula tailored to user inputs.
* **Smart Media Integration**: Connects chapter concepts directly with relevant video tutorials.
* **Docker Containerized**: Built with multi-stage Docker builds for rapid setup and environment consistency.
* **Interactive Learning Workflows**: Allows users to read material, consume media, mark chapters complete, and track progress visually.

---

# ✨ Features

### 🎓 AI-Generated Curricula
* Generates structured, multi-chapter content via Google Gemini.
* Tailors course depth based on chosen chapter count.
* Automatically synthesizes lesson summaries and key learning points.

### 🎥 Automated Video Curation
* Leverages the YouTube Data API to source relevant, high-quality video content for each chapter.
* Embeds contextual video support directly into the lesson viewer.

### 🐳 Full Docker Support
* Pre-configured `Dockerfile` and `docker-compose.yml` for single-command spin-up.
* Environment consistency between development, staging, and production.
* Optimized multi-stage builds to keep image sizes minimal.

### 📈 Progress Tracking & Dashboard
* Real-time progress visualizer tracking completed chapters.
* Persistent user state across sessions.
* Interactive lesson completion toggles.

### 🔐 Secure Authentication & User Management
* User authentication powered by Clerk (Email/Password & OAuth).
* Protected routes, server-side authorization checks, and session management.
* User profile customization and saved course history.

---

# 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Server Actions, Server Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI |
| **Containerization** | Docker, Docker Compose |
| **Authentication** | Clerk Auth |
| **Database** | Neon PostgreSQL |
| **ORM** | Drizzle ORM |
| **AI Models** | Google Gemini API (`gemini-2.5-flash` / Gemini API) |
| **External APIs** | YouTube Data API v3 |
| **Deployment** | Vercel / Docker Container Hosting |

---

# 📂 Architecture & Directory Structure

```text
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
├── Dockerfile              # Multi-stage Docker build config
├── docker-compose.yml      # Docker Compose deployment setup
├── .dockerignore           # Excluded files from Docker context
├── drizzle.config.ts       # Drizzle migrations configuration
└── package.json

⚙️ Getting Started
Choose to run EduAI locally using standard Node.js or via Docker.

Prerequisites
Ensure you have the following installed:

Node.js: v18.x or later (for local run without Docker)

Docker & Docker Compose (for containerized run)

A Neon PostgreSQL database instance

Accounts/API keys for Clerk, Google Gemini AI, and Google Cloud (YouTube Data API)

🐳 Option A: Running with Docker (Recommended)
Clone the Repository

Bash
git clone [https://github.com/your-username/eduai.git](https://github.com/your-username/eduai.git)
cd eduai
Configure Environment Variables
Create a .env.local file (or .env) in the root directory:

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
Build and Run the Container

Bash
docker-compose up --build -d
The application will be accessible at http://localhost:3000.

Stop the Container

Bash
docker-compose down
💻 Option B: Running Locally (Node.js)
Clone and Install Dependencies

Bash
git clone [https://github.com/your-username/eduai.git](https://github.com/your-username/eduai.git)
cd eduai
npm install
Configure .env.local (same variables as shown above)

Run Database Migrations

Bash
npx drizzle-kit push
Start Development Server

Bash
npm run dev
📌 How It Works
Code snippet
sequenceDiagram
    autonumber
    actor User
    participant App as Next.js (Docker Container)
    participant Gemini as Google Gemini AI
    participant YT as YouTube API
    participant DB as Neon Database (Drizzle)

    User->>App: Submits topic, chapter count, & video preference
    App->>Gemini: Requests structured JSON outline & chapter text
    Gemini-->>App: Returns generated JSON course payload
    alt Video inclusion selected
        App->>YT: Queries related videos per chapter
        YT-->>App: Returns video metadata & IDs
    end
    App->>DB: Stores course, chapters, and video links
    DB-->>App: Confirms record creation
    App-->>User: Redirects to interactive course dashboard
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
