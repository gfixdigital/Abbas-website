"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

/**
 * The login screen sits under /admin so middleware can treat the whole
 * subtree uniformly, but it must not show the editor sidebar to someone who is
 * not signed in yet. It renders standalone; every other admin route gets the
 * rail.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg-soft lg:grid lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
