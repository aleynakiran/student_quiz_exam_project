/** UI enrichment mocks — no backend dependency */

export const SEMESTER_LABEL = "Spring 2026 · Term B";

export const MOCK_UPCOMING_EXAMS = [
  {
    id: "u1",
    subject: "Architecture Proficiency Sprint",
    teacher: "Dr. Rowan Blake",
    opensAt: "Mar 12 · 09:00",
    closesAt: "Mar 12 · 21:00",
    countdownLabel: "Opens in 4 days",
    mode: "Proctored · Browser lock recommended",
  },
  {
    id: "u2",
    subject: "Distributed Systems Drill",
    teacher: "Prof. Mira Chen",
    opensAt: "Mar 18 · 14:00",
    closesAt: "Mar 18 · 18:00",
    countdownLabel: "Opens in 10 days",
    mode: "Open notes · Timed sections",
  },
];

export const MOCK_CALENDAR_EVENTS = [
  { day: "12", month: "Mar", title: "Architecture window opens", tone: "indigo" },
  { day: "14", month: "Mar", title: "Office hours · cohort B", tone: "zinc" },
  { day: "18", month: "Mar", title: "Distributed quiz closes", tone: "emerald" },
];

export const MOCK_ACTIVITY = [
  {
    id: "a1",
    title: "Exam submitted",
    detail: "Architecture Proficiency Sprint · attempt finalized",
    time: "32m ago",
    icon: "check",
  },
  {
    id: "a2",
    title: "Score released",
    detail: "Practice readiness diagnostic · 82%",
    time: "Yesterday",
    icon: "award",
  },
  {
    id: "a3",
    title: "New quiz published",
    detail: "Distributed Systems Drill · availability widened",
    time: "2d ago",
    icon: "sparkles",
  },
];

export const MOCK_STUDENT_KPIS = {
  activeQuizzes: 4,
  completedExams: 18,
  averageScore: 81,
  pendingExams: 2,
};

export const MOCK_RECENT_RESULTS = [
  { id: "r1", exam: "Practice readiness diagnostic", score: "24 / 30", pct: 80, passed: true },
  { id: "r2", exam: "Weekly checkpoint · layering", score: "17 / 22", pct: 77, passed: true },
  { id: "r3", exam: "Integrity primer quiz", score: "9 / 15", pct: 60, passed: true },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "You", score: 812, delta: "+12" },
  { rank: 2, name: "Jordan K.", score: 798, delta: "+4" },
  { rank: 3, name: "Samira P.", score: 786, delta: "+9" },
  { rank: 4, name: "Alex R.", score: 774, delta: "−2" },
];

export const MOCK_STUDY_RESOURCES = [
  { id: "sr1", title: "Layered architecture cheatsheet", type: "PDF · 1.2 MB" },
  { id: "sr2", title: "Distributed patterns lecture deck", type: "Slides · Week 4" },
  { id: "sr3", title: "Obsidian exam integrity checklist", type: "HTML · Internal" },
];

export const MOCK_TEACHER_QUIZZES = [
  {
    id: 1,
    title: "Architecture Proficiency Sprint",
    active: true,
    attempts: 248,
    avgScore: 76,
    passRate: 0.82,
  },
  {
    id: 2,
    title: "Distributed Systems Drill",
    active: true,
    attempts: 186,
    avgScore: 71,
    passRate: 0.74,
  },
  {
    id: 3,
    title: "Weekly checkpoint · layering",
    active: false,
    attempts: 412,
    avgScore: 79,
    passRate: 0.88,
  },
];

export const MOCK_TEACHER_ACTIVITY = [
  { id: "t1", title: "Late submission flagged", detail: "Jordan K. · +6m past window", time: "18m ago" },
  { id: "t2", title: "Submission burst detected", detail: "Architecture sprint · 42 attempts / 10m", time: "1h ago" },
  { id: "t3", title: "New attempt completed", detail: "Distributed drill · median time 27m", time: "3h ago" },
];

export const MOCK_SCORE_DISTRIBUTION = [
  { band: "90–100", count: 22 },
  { band: "80–89", count: 54 },
  { band: "70–79", count: 61 },
  { band: "60–69", count: 38 },
  { band: "<60", count: 15 },
];

export const MOCK_SUBMISSIONS_OVER_TIME = [
  { day: "Mon", attempts: 42 },
  { day: "Tue", attempts: 58 },
  { day: "Wed", attempts: 36 },
  { day: "Thu", attempts: 72 },
  { day: "Fri", attempts: 64 },
  { day: "Sat", attempts: 28 },
  { day: "Sun", attempts: 22 },
];

export const MOCK_ADMIN_USERS = [
  { id: 1, name: "Riley Admin", email: "riley@univ.edu", role: "admin", status: "Active" },
  { id: 2, name: "Jordan Teacher", email: "jordan@univ.edu", role: "teacher", status: "Active" },
  { id: 3, name: "Avery Student", email: "avery@univ.edu", role: "student", status: "Active" },
  { id: 4, name: "Guest Auditor", email: "guest@univ.edu", role: "student", status: "Suspended" },
];

export const MOCK_AUDIT_LOGS = [
  { id: "l1", event: "login.success", actor: "avery@univ.edu", ip: "10.12.4.88", time: "09:42" },
  { id: "l2", event: "exam.submit", actor: "avery@univ.edu", ip: "10.12.4.88", time: "10:18" },
  { id: "l3", event: "login.failure", actor: "unknown", ip: "192.168.0.44", time: "08:02" },
];

export const EXAM_SESSION_STORAGE_KEY = "obsidian_active_exam";
