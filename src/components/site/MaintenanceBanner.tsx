import { AlertTriangle } from "lucide-react";
import { useData } from "@/store/DataContext";

export function MaintenanceBanner() {
  const { settings } = useData();
  if (!settings.maintenance_mode) return null;

  return (
    <div className="border-b border-warning/30 bg-warning/10 text-warning">
      <div className="container-page flex items-center gap-3 py-2.5 text-sm">
        <AlertTriangle size={16} className="shrink-0" />
        <p className="font-medium">{settings.maintenance_message}</p>
      </div>
    </div>
  );
}
