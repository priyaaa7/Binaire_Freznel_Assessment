export default function SystemStatus({ tasks }) {
  const queued = tasks.filter((task) => task.status === "queued").length;

  return (
    <section className="panel system-panel">
      <p className="eyebrow">SYSTEM</p>
      <h2>Control status</h2>

      {/* <div className="status-row">
        <span  />
        Server connection
      </div> */}
      <div className="status-row">
        <span className="live-dot"  />
        Queued jobs<strong>{queued}</strong>
      </div>
      {/* <div className="status-row">
        <span />
        Update method
      </div> */}
    </section>
  );
}
