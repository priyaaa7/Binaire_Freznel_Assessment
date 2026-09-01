import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

import Task from "./classes/Task.js";
import TaskQueue from "./classes/TaskQueue.js";
import TaskManager from "./classes/TaskManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const allowedOrigin = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: allowedOrigin || "http://localhost:5173",
  }),
);

app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
);

// i can keep temporary metadata in memory.
const tasks = [];
const queue = new TaskQueue();
const taskManager = new TaskManager(queue);



app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

app.post("/api/tasks", async (req, res) => {
  try {
    // uploaded file will be available through req.files.
    if (!req.files?.file) {
      return res.status(400).json({ message: "Please upload a CSV file." });
    }

    const file = req.files.file;
    const priority = req.body.priority === "high" ? "high" : "low";

    if (!file.name.toLowerCase().endsWith(".csv")) {
      return res.status(400).json({ message: "Only CSV files are allowed." });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedPath = path.join(uploadsDir, `${Date.now()}-${safeName}`);

    // for saving physical file on  server.
    await file.mv(storedPath);

    //  metadata object for this job.
    const task = new Task(file.name, storedPath, priority);
    task.status = "uploaded";
    tasks.push(task);

    // putting task into high or low priority queue.
    task.status = "queued";
    queue.enqueue(task);

    taskManager.start();

    res.status(201).json({
      message: "File uploaded and added to queue",
      task,
      queueLength: queue.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Upload failed" });
  }
});

// for downloading
app.get("/api/tasks/:id/download", (req, res) => {
  // finding task
  const task = tasks.find((task) => task.id === req.params.id);

  // if task doesn't exist
  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  // before processing completes
  if (task.status !== "completed") {
    return res.status(400).json({
      message: "Task is not completed yet",
    });
  }

  const fileContent = `Reduced Result\n${task.result}`;

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="result-${task.id}.csv"`,
  );
  // for cvs file type

  res.setHeader("Content-Type", "text/csv");

  // send file content directly to client
  res.send(fileContent);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
