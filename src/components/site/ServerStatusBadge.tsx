import { useData } from "@/store/DataContext";
import { Circle } from "lucide-react";

export function ServerStatusBadge({ compact = false }: { compact?: boolean }) {
  const { settings, serverStatus } = useData();
  const isMaintenance = settings.maintenance_mode;
  const status = isMaintenance ? "maintenance" : serverStatus.status;

  const map = {
    online: { label: "Online", color: "text-success", dot: "bg-success" },
    offline: { label: "Offline", color: "text-destructive", dot: "bg-destructive" },
    maintenance: { label: "Maintenance", color: "text-warning", dot: "bg-warning" },
  } as const;

  const c = map[status];

  if (compact) {
    return (
      <span className="inline-flex items-center gap-2 text-xs font-medium">
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`}>
          <span className={`absolute inset-0 rounded-full ${c.dot} opacity-60 animate-ping`} />
        </span>
        <span className={c.color}>{c.label}</span>
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface-1/80 px-3 py-1.5 backdrop-blur">
      <Circle size={8} className={`${c.color} fill-current`} />
      <span className="text-xs font-medium tracking-wide text-muted-foreground">Server:</span>
      <span className={`text-xs font-semibold ${c.color}`}>{c.label}</span>
    </div>
  );
}
