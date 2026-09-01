
//as only two priorities exist, so two arrays will be sufficient.
class TaskQueue {
  constructor() {
    this.highPriorityQueue = [];
    this.lowPriorityQueue = [];
  }

  enqueue(task) {
    if (task.priority === "high") this.highPriorityQueue.push(task);
    else this.lowPriorityQueue.push(task);
  }

  dequeue() {
    if (this.highPriorityQueue.length > 0) return this.highPriorityQueue.shift();
    if (this.lowPriorityQueue.length > 0) return this.lowPriorityQueue.shift();
    return null;
  }

  get length() {
    return this.highPriorityQueue.length + this.lowPriorityQueue.length;
  }
}
export default TaskQueue;
