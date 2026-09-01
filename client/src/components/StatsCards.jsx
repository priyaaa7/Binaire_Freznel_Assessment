import { ListTodo, Cpu, CircleCheck } from "lucide-react";

export default function StatsCards({ tasks }) {
  const stats = [
    { label: "Total jobs", value: tasks.length, icon: ListTodo },
    {
      label: "Processing",
      value: tasks.filter((t) => t.status === "processing").length,
      icon: Cpu,
    },
    {
      label: "Completed",
      value: tasks.filter((t) => t.status === "completed").length,
      icon: CircleCheck,
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map(({ label, value, icon: Icon }) => (
        <div className="stat-card" key={label}>
          <div>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
          <Icon size={22} />
        </div>
      ))}
    </div>
  );
}
