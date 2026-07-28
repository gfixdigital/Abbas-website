"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Profile } from "@/content";
import type { SiteSettings } from "@/lib/data";

export type SiteData = {
  profile: Profile;
  settings: SiteSettings | null;
};

const SiteContext = createContext<SiteData | null>(null);

export function SiteProvider({
  value,
  children,
}: {
  value: SiteData;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteData {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within a SiteProvider");
  return ctx;
}

export function useProfile(): Profile {
  return useSite().profile;
}
