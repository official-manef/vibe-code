"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const convex = useMemo(() => {
    return new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud");
  }, []);

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
