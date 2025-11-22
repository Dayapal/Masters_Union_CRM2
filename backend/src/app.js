import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import taskRoutes from "./routes/task.routes.js";  // ✅ added
import activityRoutes from "./routes/activity.routes.js";
import dealRoutes from "./routes/deal.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import emailRoutes from "./routes/email.routes.js";
import historyRoutes from "./routes/history.routes.js";
import noteRoutes from "./routes/note.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";



const app = express();

app.use(cors());
app.use(express.json());

// ----------------------
// Public Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/dashboard", dashboardRoutes);
import userStatsRoutes from "./routes/userStats.routes.js";

// ----------------------
// Protected Routes
// ----------------------
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/user-stats", userStatsRoutes);
// ✅ added

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "CRM Backend Running 🚀",
    time: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
