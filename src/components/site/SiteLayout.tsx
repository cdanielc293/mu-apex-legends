import { ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LiveStatsBar } from "@/components/site/LiveStatsBar";
import { MaintenanceBanner } from "@/components/site/MaintenanceBanner";

export function SiteLayout({
  children,
  hideStats = false,
}: {
  children: ReactNode;
  hideStats?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MaintenanceBanner />
      <SiteHeader />
      {!hideStats && <LiveStatsBar />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
