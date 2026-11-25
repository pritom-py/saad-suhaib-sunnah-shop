"use client";

import React from "react";
import { usePathname } from "next/navigation";

/** Keeps the shop header, footer and floating controls out of the Admin CMS. */
export function StorefrontOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : <>{children}</>;
}
