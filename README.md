# EduAI – AI-Powered Online Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![NGINX](https://img.shields.io/badge/NGINX-Load_Balancer-009639?style=flat&logo=nginx)](https://www.nginx.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat&logo=clerk)](https://clerk.com/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat&logo=drizzle)](https://orm.drizzle.team/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat&logo=vercel)](https://vercel.com/)

<br />

# 🚀 EduAI
### Instant, AI-Driven Personalized Course Generation

**EduAI** is an intelligent learning platform designed to generate fully structured, personalized educational courses on demand. By providing a topic, desired chapter depth, and video preferences, EduAI generates complete chapter breakdowns, rich text content, and curated YouTube video resources within minutes.

The application is **fully containerized using Docker** and utilizes an **NGINX Reverse Proxy & Load Balancer** to distribute incoming requests across multiple Next.js app instances, ensuring high availability, zero downtime, and optimal traffic handling.

---

# 💡 Overview

Learning new subjects often requires aggregating information across disparate sources. EduAI simplifies this process by orchestrating AI content generation and real-time video aggregation into a single, interactive learning portal.

* **Instant Course Generation**: Generates custom curricula tailored to user inputs.
* **Smart Media Integration**: Connects chapter concepts directly with relevant video tutorials.
* **NGINX Load Balancing**: Configured reverse proxy for high availability and load distribution across container instances.
* **Docker Containerized**: Multi-stage builds and Docker Compose integration for consistent deployment across environments.
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

### ⚡ NGINX Load Balancing & Reverse Proxy
* Round-robin request distribution across scaled Next.js app replicas.
* SSL/TLS termination ready and static asset caching.
* Health monitoring and seamless failover management.

### 🐳 Full Docker Support
* Pre-configured `Dockerfile`, `nginx.conf`, and `docker-compose.yml`.
* Multi-instance scaling with a single Docker Compose command.
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
| **Infrastructure** | Docker, Docker Compose, NGINX Load Balancer |
| **Authentication** | Clerk Auth |
| **Database** | Neon PostgreSQL |
| **ORM** | Drizzle ORM |
| **AI Models** | Google Gemini API (`gemini-2.5-flash` / Gemini API) |
| **External APIs** | YouTube Data API v3 |
| **Deployment** | Vercel / Containerized Cloud Hosting (AWS, DigitalOcean) |

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
├── nginx/
│   └── nginx.conf          # NGINX reverse proxy & load balancer configuration
├── lib/                    # Shared utilities, Gemini & YouTube API helpers
├── public/                 # Static assets and icons
├── Dockerfile              # Multi-stage Docker build config
├── docker-compose.yml      # Docker Compose setup (App instances + NGINX)
├── .dockerignore           # Excluded files from Docker context
├── drizzle.config.ts       # Drizzle migrations configuration
└── package.json

⚙️ Getting Started
Choose to run EduAI locally using standard Node.js or via Docker with NGINX Load Balancing.

Prerequisites
Ensure you have the following installed:

Node.js: v18.x or later (for local run without Docker)

Docker & Docker Compose (for containerized setup)

A Neon PostgreSQL database instance

Accounts/API keys for Clerk, Google Gemini AI, and Google Cloud (YouTube Data API)

⚡ NGINX Load Balancer Configuration Sample
Below is the standard nginx/nginx.conf used in the project to route traffic across Next.js app replicas:

Nginx
events {
    worker_connections 1024;
}

http {
    upstream eduai_app {
        # Load balancing across scaled app instances
        server app_1:3000;
        server app_2:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://eduai_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
🐳 Option A: Running with Docker & NGINX (Recommended)
Clone the Repository

Bash
git clone [https://github.com/your-username/eduai.git](https://github.com/your-username/eduai.git)
cd eduai
Configure Environment Variables
Create a .env.local file in the root directory:

Code snippet
# Next.js Application
NEXT_PUBLIC_APP_URL=http://localhost

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
Build and Scale Containers
Spin up the application with NGINX load balancing traffic across multiple instances:

Bash
docker-compose up --build --scale app=2 -d
The application will be accessible via NGINX on port 80 at http://localhost.

Stop the Container Cluster

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
    participant NGINX as NGINX Load Balancer
    participant App as Next.js Replicas (Docker)
    participant Gemini as Google Gemini AI
    participant YT as YouTube API
    participant DB as Neon Database (Drizzle)

    User->>NGINX: HTTP Request (Port 80)
    NGINX->>App: Proxies request (Round-Robin to App Instance)
    App->>Gemini: Requests structured JSON outline & chapter text
    Gemini-->>App: Returns generated JSON course payload
    alt Video inclusion selected
        App->>YT: Queries related videos per chapter
        YT-->>App: Returns video metadata & IDs
    end
    App->>DB: Stores course, chapters, and video links
    DB-->>App: Confirms record creation
    App-->>NGINX: Returns HTTP Response
    NGINX-->>User: Delivers dashboard UI
Traffic Routing: Requests enter through the NGINX Reverse Proxy, which distributes them across running Next.js app instances.

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
