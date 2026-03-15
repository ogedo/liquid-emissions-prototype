"use client";

import Link from "next/link";
import { Globe } from "lucide-react";

export function SwitchPortal() {
  return (
    <div className="border-t border-white/10 pt-3 mt-3">
      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2 px-1 flex items-center gap-1">
        <Globe className="h-3 w-3" />
        Switch Portal
      </p>
      <div className="space-y-1">
        <Link
          href="/dashboard"
          className="block text-xs text-white/60 hover:text-white hover:bg-white/10 rounded px-2 py-1 transition-colors"
        >
          Operator Portal
        </Link>
        <Link
          href="/admin/dashboard"
          className="block text-xs text-white/60 hover:text-white hover:bg-white/10 rounded px-2 py-1 transition-colors"
        >
          Admin Portal
        </Link>
        <Link
          href="/finance/wallet"
          className="block text-xs text-white/60 hover:text-white hover:bg-white/10 rounded px-2 py-1 transition-colors"
        >
          Finance Portal
        </Link>
      </div>
    </div>
  );
}
