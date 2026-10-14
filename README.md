# Smart AI Mentor–Mentee Management System 🎓🚀
**An Intelligent Higher Education Mentorship, Career Navigation & Accountability Platform**

[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Express%20%7C%20React%2019%20%7C%20TailwindCSS-0d9488)](#technical-architecture)
[![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20Atomic%20JSON%20Fallback-1e293b)](#database-setup--configuration)
[![Status](https://img.shields.io/badge/Build-Passing%20(15%2F15%20Tests)-16a34a)](#automated-api-test-suite)

---

## 📌 Executive Overview & Value Proposition

In modern higher education, undergraduate students often struggle to translate academic theory into competitive industry readiness. Mentorship programs frequently fail due to:
1. **Arbitrary Pairings:** Matching students to mentors based on casual interest without evaluating domain taxonomies or specific skill overlap.
2. **Accountability Vacuum:** Meetings that devolve into unstructured coffee chats without measurable milestone roadmaps.
3. **Lack of Institutional Visibility:** College deans and department chairs have zero telemetry into student progress velocity until post-graduation placement statistics.

The **Smart AI Mentor–Mentee Management System** addresses this problem by delivering a complete SaaS ecosystem combining **multi-attribute AI matching**, **actionable milestone checklists**, **1-on-1 session orchestration**, **progress velocity alerts**, and **administrative control**.

---

## 🧭 System Architecture & Palette

- **Design Philosophy:** Premium SaaS aesthetic with modern rounded cards (`rounded-2xl`, `rounded-3xl`), subtle shadows, and consistent spacing.
- **Color Palette:**
  - **Navy Blue (`#0f172a`, `#1e293b`):** Structural authority, executive trust, high contrast text.
  - **Soft Lavender (`#ede9fe`, `#f5f3ff`):** Supportive guidance, academic badges, approachable accents.
  - **Teal / Cyan (`#0d9488`, `#2dd4bf`):** Active progress indicators, growth arcs, high-velocity CTAs.
  - **Pure Crisp White (`#ffffff`):** Uncluttered readability and clean card separation.
- **Custom Logo:** Abstract geometric growth nexus symbol combining upward trajectory arcs with intersecting guidance nodes (*complies strictly with design guidelines: no generic two human figures*).

---

## 🚀 Quick Start Guide (Windows CMD Commands)

The platform is configured for instant, zero-friction setup.

### Prerequisites
* **Node.js** (v18, v20, or v24 LTS recommended)
* **npm** (v9+)
* Optional: **MySQL 8.0+** (if direct MySQL persistence is desired)

### Method 1 — One-Click Automated Launch
Double-click `start_app.bat` or run from Windows Command Prompt:
```cmd
start_app.bat
```
*This command starts the Backend API server (Port 5000), spins up the React Vite frontend (Port 5173), and opens `http://localhost:5173/` in your default browser.*

---

### Method 2 — Manual Command Line Setup

#### Step 1: Start Backend REST API
Open a Windows Command Prompt:
```cmd
cd backend
npm install
node server.js
```
*Backend runs on `http://localhost:5000`. Health check available at `http://localhost:5000/api/health`.*

#### Step 2: Start Frontend Development Server
Open a second Windows Command Prompt:
```cmd
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173/` with automated proxy to backend port 5000.*

---

## 🧪 Automated API Test Suite

The backend includes a comprehensive automated test script validating authentication, student workflows, mentor actions, admin approvals, AI matching, and contact submissions:

```cmd
cd backend
node test_api.js
```

**Results (15/15 Passed):**
- ✅ Health check returns `200 HEALTHY`
- ✅ Student demo login authentication
- ✅ Mentor demo login authentication
- ✅ Admin demo login authentication
- ✅ Student dashboard query & goals retrieval
- ✅ Goal creation with auto-generated AI milestones
- ✅ Goal progress updating
- ✅ 1-on-1 session request creation
- ✅ Mentor dashboard & mentee inspection
- ✅ Mentor session confirmation
- ✅ Mentor rubric feedback submission
- ✅ Admin platform statistics computation
- ✅ Admin mentor-mentee pairing & AI suggestions
- ✅ AI multi-factor mentor matching calculation
- ✅ Contact inquiry logging with reference code

---

## 👥 Pre-Configured Demonstration Accounts

To allow evaluators, hackathon judges, and professors to explore all role-based features without tedious registration, the system includes pre-seeded demo accounts. You can also use the **"1-Click Demo"** dropdown in the navigation header to switch roles instantly!

| Role | Email | Password | Pre-loaded Context |
| :--- | :--- | :--- | :--- |
| **Student (Mentee)** | `student@smartmentor.ai` | `Student@123` | Alex Johnson • Junior B.Tech CS & AI • 3 active goals with milestones • Paired with Dr. Elena Vance |
| **Industry Mentor** | `mentor@smartmentor.ai` | `Mentor@123` | Dr. Elena Vance • Principal AI Scientist at DeepTech Labs • Assigned mentees • Session queue |
| **Administrator** | `admin@smartmentor.ai` | `Admin@123` | Dr. Arthur Pendelton • Dean of Student Mentorship • Full user oversight & AI auto-pairing |

---

## 🗄️ Database Setup & Configuration

### Dual-Driver Persistence Engine:
1. **MySQL 8.0+ Support:** Full relational DDL script provided in `backend/schema.sql`.
   To use MySQL:
   1. Create database: `CREATE DATABASE mentor_system_db;`
   2. Import schema: `mysql -u root -p mentor_system_db < backend/schema.sql`
   3. Set credentials in `backend/.env` (see `backend/.env.example`).
2. **Zero-Config Persistent JSON Fallback:** If no MySQL credentials are provided, the backend automatically utilizes an atomic persistent file store (`backend/data/mentor_db.json`). All creations, status updates, and deletions are persisted to disk immediately, guaranteeing 100% functionality out-of-the-box on any machine.

---

## 🌐 Complete Navigation & Route Map

### Public Pages
- **`/` (Home):** Hero banner, live interactive AI Matcher Sandbox widget, 4 core capability cards, student and mentor roadmap, benefits comparison, sample demo testimonials, footer.
- **`/about` (About):** Mission, vision, higher education problem statement, proposed institutional impact, and ethical AI transparency statement.
- **`/features` (Features):** Tabbed deep dive into AI Matching, Milestone Breakdown, 1-on-1 Session Suite, Progress Intelligence, and Structured Feedback Rubrics.
- **`/how-it-works` (How It Works):** Step-by-step visual timelines for both students and mentors.
- **`/contact` (Contact):** Validated inquiry form with campus partnership categories, saving to backend and issuing reference ticket numbers.
- **`/login` & `/register`:** Role-based authentication with bcrypt hashing and 1-Click Demo buttons.

### Role-Protected Dashboards
- **`/student/dashboard`:** Profile summary, assigned mentor card, goals and interactive milestone checklists, session scheduler with Google Meet links, AI progress velocity analysis, and mentor feedback review.
- **`/mentor/dashboard`:** Assigned mentee roster, attention-required alerts (stalled goals > 14 days), session request approvals, mentee detail inspection modal, and 5-star rubric evaluation form.
- **`/admin/dashboard`:** Executive KPI metrics, user directory with active/suspended toggling, mentor application approval/rejection queue, mentor-mentee pairing management with AI Auto-Pairing batch run, session/feedback audit log, and contact inquiry review.

---

## 🤖 AI-Assisted Features & Ethical Governance

### Mathematical Compatibility Formula
The AI Matching Engine (`backend/services/aiEngine.js`) calculates composite compatibility using a deterministic multi-attribute model:

$$\text{MatchScore} = (0.35 \times D) + (0.30 \times J) + (0.20 \times C) + (0.15 \times M)$$

Where:
* **$D$ (Academic Domain Alignment):** Categorical compatibility between student major and mentor industry domain.
* **$J$ (Jaccard Skill Overlap):** Semantic intersection over union of student learning objectives and mentor skills.
* **$C$ (Career Goal Semantic Fit):** Keyword and vertical alignment between student career statement and mentor domain.
* **$M$ (Mentor Experience & Capacity):** Workload availability and industry tenure factor.

> **Ethical Governance Notice:** *"AI assists. Humans decide."* The system operates with full transparency. AI provides structured recommendations, milestone steps, and velocity warnings; mentors and deans retain final authority over guidance and approvals.

---

## 📦 GitHub Preparation Instructions

To push this codebase to a new GitHub repository:

```cmd
git init
git add .
git commit -m "feat: complete Smart AI Mentor-Mentee Management System"
git branch -M main
git remote add origin https://github.com/your-username/smart-ai-mentor.git
git push -u origin main
```

---

## 📜 Implemented Features & Technical Highlights

- [x] Complete RESTful MVC architecture with clean service separation.
- [x] Secure authentication with BCrypt password hashing & JWT tokens.
- [x] Role-Based Access Control (`STUDENT`, `MENTOR`, `ADMIN`) across client and server.
- [x] Interactive live AI Matcher preview widget on homepage.
- [x] Dynamic milestone checklist engine that recalculates progress percentage in real-time.
- [x] 1-on-1 session orchestration with Google Meet video links.
- [x] Mentor rubric evaluation with multi-criteria scores (Technical, Communication, Next Steps).
- [x] Early intervention warnings for stalled goals (>14 days without updates).
- [x] Administrator batch AI auto-pairing algorithm.
- [x] Validated contact form with persistent inquiry storage and reference tickets.
- [x] Fully responsive layout tested across mobile, tablet, and desktop form factors.
