import { useEffect, useState } from "react";
import { useData } from "@/store/DataContext";
import { Activity, Clock, Server, Users, Zap } from "lucide-react";

function useServerClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now.toUTCString().slice(17, 25); // HH:MM:SS
}

export function LiveStatsBar() {
  const { settings, serverStatus } = useData();
  const time = useServerClock();
  const isOnline = !settings.maintenance_mode && serverStatus.status === "online";

  const items = [
    {
      icon: Users,
      label: "Players Online",
      value: serverStatus.online_count.toLocaleString(),
      accent: true,
    },
    { icon: Server, label: "Status", value: isOnline ? "Online" : "Maintenance" },
    { icon: Zap, label: "EXP", value: `x${settings.exp_rate}` },
    { icon: Activity, label: "Drop", value: `${settings.drop_rate}%` },
    { icon: Clock, label: "Server Time (UTC)", value: time, mono: true },
  ];

  return (
    <div className="border-y border-border/80 bg-surface-1/60 backdrop-blur-md">
      <div className="container-page">
        <ul className="flex items-stretch gap-x-6 overflow-x-auto py-3 text-sm md:justify-center md:gap-x-10 md:py-3.5">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li
                key={it.label}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
              >
                <Icon
                  size={16}
                  className={it.accent ? "text-primary" : "text-muted-foreground"}
                />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {it.label}
                </span>
                <span
                  className={`font-semibold ${it.accent ? "text-primary" : "text-foreground"} ${
                    it.mono ? "font-mono tabular-nums" : ""
                  }`}
                >
                  {it.value}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
