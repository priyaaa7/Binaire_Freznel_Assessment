export default function TaskCard({ task }) {
  return (
    <article className="task-card">
      <div className="task-top">
        <div>
          <h3>{task.fileName}</h3>
          <p className="task-id">ID: {task.id.slice(0, 8)}</p>
        </div>
        <span className="priority-badge">{task.priority}</span>
      </div>

      <div className="task-meta">
        <span>{task.rows || "—"} rows</span>
        <span>{task.columns || "—"} columns</span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${task.progress || 0}%` }}
        />
      </div>

      <div className="task-footer">
        <span className="status">{task.status}</span>
        <strong>{task.progress || 0}%</strong>
      </div>

      {/* {task.result !== null && <div className="result-box">Final sum: <strong>{task.result}</strong></div>} */}
      {task.status === "completed" && (
        <>
          {/*  calculated result */}
          {/* <div className="result-box">
      <span>Reduced Output</span>
      <strong>{task.result}</strong>
    </div> */}

          {/* for downloading a csv containing only the reduced result */}
          <a
            href={`${
              import.meta.env.VITE_API_URL || "http://localhost:5000"
            }/api/tasks/${task.id}/download`}
            className="download-button"
          >
            Download Result
          </a>
        </>
      )}
      {task.error && <p className="error-text">{task.error}</p>}
    </article>
  );
}
