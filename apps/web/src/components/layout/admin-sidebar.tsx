"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  SplitSquareHorizontal,
  Landmark,
  FileBarChart,
  Shield,
  Anchor,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SwitchPortal } from "./switch-portal";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/organisations", label: "Organisations", icon: Building2 },
  { href: "/admin/fee-schedules", label: "Fee Schedules", icon: FileBarChart },
  { href: "/admin/split-rules", label: "Split Rules", icon: SplitSquareHorizontal },
  { href: "/admin/settlements", label: "Settlements", icon: Landmark },
  { href: "/admin/reports",       label: "Reports",      icon: FileBarChart },
  { href: "/admin/integrations",  label: "Integrations", icon: Plug },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-navy flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
            <Anchor className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Liquid Emissions</p>
            <p className="text-white/50 text-xs">Revenue Collection</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-3 w-3 text-teal" />
          <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">Admin</p>
        </div>
        <p className="text-white font-semibold text-sm">Platform Admin</p>
        <p className="text-white/50 text-xs">admin@bluewave.ng</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Switch portal */}
      <div className="px-3 pb-4">
        <SwitchPortal />
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-white/30 text-xs">Blue Wave © 2026</p>
        <Link href="/login" className="text-white/40 text-xs hover:text-white/60">
          Sign out
        </Link>
      </div>
    </aside>
  );
}
