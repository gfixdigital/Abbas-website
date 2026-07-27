import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  input: string,
  opts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" },
) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return new Intl.DateTimeFormat("en-GB", opts).format(date);
}

export function formatDateRange(start: string, end: string | null) {
  return `${formatDate(start)} — ${end ? formatDate(end) : "Present"}`;
}

export function durationFrom(start: string, end: string | null) {
  const from = new Date(start);
  const to = end ? new Date(end) : new Date();
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years <= 0) return `${Math.max(rest, 1)} mo`;
  if (rest === 0) return `${years} yr`;
  return `${years} yr ${rest} mo`;
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbas.gfixdigital.com";
  return new URL(path, base).toString();
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
