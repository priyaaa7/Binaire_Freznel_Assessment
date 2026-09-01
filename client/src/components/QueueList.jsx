import TaskCard from "./TaskCard";

export default function QueueList({ tasks, loading }) {
  return (
    <section className="queue-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LIVE OVERVIEW</p>
          <h2>Processing queue</h2>
        </div>
        <span className="task-count">{tasks.length} jobs</span>
      </div>

      {loading ? (
        <div className="empty-state">Loading queue...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          No jobs yet. Upload a numeric CSV to begin.
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}
