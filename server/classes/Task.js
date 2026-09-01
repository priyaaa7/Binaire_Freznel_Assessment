import crypto from "node:crypto";

// one object wil represent one uploaded CSV job.
class Task {
  constructor(fileName, filePath, priority) {
    this.id = crypto.randomUUID();
    this.fileName = fileName;
    this.filePath = filePath;
    this.priority = priority;
    this.status = "uploading";
    this.progress = 0;
    this.rows = 0;
    this.columns = 0;
    this.result = null;
    this.error = null;
   
  }
}
export default Task;
