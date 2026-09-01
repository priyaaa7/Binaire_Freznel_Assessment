import { useCallback, useEffect, useState } from "react";
import { Activity } from "lucide-react";
import UploadPanel from "./components/UploadPanel";
import StatsCards from "./components/StatsCards";
import SystemStatus from "./components/SystemStatus";
import QueueList from "./components/QueueList";
import { getTasks } from "./lib/api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setTasks(await getTasks());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();

    
    const interval = setInterval(fetchTasks, 1500);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark">B</div>
          <div><p className="eyebrow">BINAIRE </p><h1>Queueing System</h1></div>
        </div>
        <div className="live-status"><Activity size={16}/>Live monitor</div>
      </header>

      <section className="hero">
        <p className="eyebrow">MULTI-USER CSV PROCESSING</p>
        <p>Upload numeric CSV files, choose priority and monitor the processing lifecycle.</p>
      </section>

      <StatsCards tasks={tasks} />

      <div className="workspace-grid">
        <UploadPanel onUploaded={fetchTasks} />
        <SystemStatus tasks={tasks} />
      </div>

      <QueueList tasks={tasks} loading={loading} />
    </main>
  );
}
