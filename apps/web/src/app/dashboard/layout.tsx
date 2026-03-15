import { OperatorSidebar } from "@/components/layout/operator-sidebar";
import { PrototypeBanner } from "@/components/layout/prototype-banner";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <PrototypeBanner />
      <div className="flex flex-1">
        <OperatorSidebar />
        <main className="flex-1 bg-slate-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
