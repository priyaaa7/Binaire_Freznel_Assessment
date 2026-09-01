import os from "node:os";
import fs from "node:fs/promises";
import { parseCSV } from "../utils/parseCSV.js";
import { runWorkerForChunk } from "../utils/runWorkers.js";

class TaskManager {
  constructor(queue) {
    this.queue = queue;

    // number of tasks currently being processed.
    this.activeTasks = 0;

    this.maxConcurrentTasks = 1;

    // this will prevent multiple scheduler loops from starting together.
    this.isSchedulerRunning = false;
  }

  /*
     method for checking the queue

    whenever a new task is added:
    taskManager.start()

    it checks whether:
     There is a task in the queue
     a processing slot is available or not
  */
  async start() {
    // if scheduler is already running, don't start another one.
    if (this.isSchedulerRunning) return;

    this.isSchedulerRunning = true;

    try {
      while (
        this.queue.length > 0 &&
        this.activeTasks < this.maxConcurrentTasks
      ) {
        const task = this.queue.dequeue();

        if (!task) break;

        this.activeTasks++;

        this.processTask(task);
      }
    } finally {
      this.isSchedulerRunning = false;
    }
  }

  /*
    this function is for handling one complete csv task.
  */
  async processTask(task) {
    try {
      task.status = "waiting";
      task.progress = 0;

      // small delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const matrix = await parseCSV(task.filePath);

      task.rows = matrix.length;
      task.columns = matrix[0]?.length || 0;

      task.status = "processing";
      task.progress = 0;

      const cpuCount = os.availableParallelism
        ? os.availableParallelism()
        : os.cpus().length;

      const workerCount = Math.min(cpuCount, matrix.length);

      const chunkSize = Math.ceil(matrix.length / workerCount);

      const chunks = [];

      for (let i = 0; i < matrix.length; i += chunkSize) {
        const chunk = matrix.slice(i, i + chunkSize);

        chunks.push(chunk);
      }

      let completedWorkers = 0;

      const workerPromises = chunks.map(async (chunk) => {
        const workerResult = await runWorkerForChunk(chunk);

        // one worker finished.
        completedWorkers++;

        task.progress = Math.round((completedWorkers / chunks.length) * 100);

        return workerResult;
      });

      const workerResults = await Promise.all(workerPromises);

      console.log("Worker results:", workerResults);

      let finalSum = 0;

      for (const result of workerResults) {
        finalSum += result.partialSum;
      }

      console.log("Final result:", finalSum);

      task.result = finalSum;

      console.log("Task after result:", task);

      task.progress = 100;
      task.status = "completed";
     

      console.log(`Task completed: ${task.fileName} → Sum: ${finalSum}`);

      try {
        await fs.unlink(task.filePath);
        console.log(`Uploaded file deleted: ${task.fileName}`);
      } catch (error) {
        console.error("Failed to delete uploaded file:", error.message);
      }
    } catch (error) {
      console.error("Task processing failed:", error);

      task.status = "error";
      task.error = error.message;
    } finally {
      this.activeTasks--;

      this.start();
    }
  }
}

export default TaskManager;
